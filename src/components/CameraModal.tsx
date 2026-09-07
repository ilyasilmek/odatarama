import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, X, RotateCcw, Check, FlipHorizontal, AlertCircle, Sparkles } from 'lucide-react';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (base64Image: string) => void;
}

export const CameraModal: React.FC<CameraModalProps> = ({ isOpen, onClose, onCapture }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasMultipleCameras, setHasMultipleCameras] = useState<boolean>(false);

  // Stop video tracks safely
  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch {
          // ignore
        }
      });
      streamRef.current = null;
    }
  }, []);

  // Check if device has multiple video inputs (e.g. rear and front)
  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.mediaDevices?.enumerateDevices) {
      navigator.mediaDevices.enumerateDevices().then((devices) => {
        const videoDevices = devices.filter((d) => d.kind === 'videoinput');
        setHasMultipleCameras(videoDevices.length > 1);
      }).catch(() => {
        // ignore
      });
    }
  }, []);

  // Start camera stream
  const startCamera = useCallback(async (mode: 'environment' | 'user') => {
    setIsLoading(true);
    setError(null);
    stopStream();

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Tarayıcınız doğrudan kamera erişimini desteklemiyor veya izin verilmedi.');
      setIsLoading(false);
      return;
    }

    try {
      // Try preferred facing mode first
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: mode,
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
          audio: false,
        });
      } catch (firstErr) {
        // Fallback to any available video stream
        console.warn('FacingMode constraint failed, falling back to basic video:', firstErr);
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      }

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch((playErr) => {
            console.warn('Video play error:', playErr);
          });
          setIsLoading(false);
        };
      } else {
        setIsLoading(false);
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      let msg = 'Kameraya erişilemedi. Lütfen tarayıcınızın kamera iznini kontrol edin.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        msg = 'Kamera erişim izni reddedildi. Lütfen adres çubuğundaki kilit simgesinden kamera iznini onaylayın.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        msg = 'Cihazınızda kullanılabilir bir kamera bulunamadı.';
      }
      setError(msg);
      setIsLoading(false);
    }
  }, [stopStream]);

  // Lifecycle
  useEffect(() => {
    if (isOpen && !capturedImage) {
      startCamera(facingMode);
    } else if (!isOpen) {
      stopStream();
      setCapturedImage(null);
      setError(null);
    }

    return () => {
      stopStream();
    };
  }, [isOpen, facingMode, capturedImage, startCamera, stopStream]);

  // Take photo from video feed
  const handleTakeShutter = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImage(dataUrl);
    stopStream();
  };

  const handleRetake = () => {
    setCapturedImage(null);
    startCamera(facingMode);
  };

  const handleConfirmPhoto = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      onClose();
    }
  };

  const handleToggleFacingMode = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-stone-900 rounded-3xl overflow-hidden shadow-2xl border border-stone-800 flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-stone-900/90 text-white border-b border-stone-800 z-10">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/30 text-emerald-400 flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold tracking-tight">Oda Kamerası</h3>
              <p className="text-[11px] text-stone-400">Odanızı geniş açıdan çerçeve içine alın</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition cursor-pointer"
            title="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder / Preview Area */}
        <div className="relative w-full aspect-4/3 sm:aspect-16/10 bg-black flex items-center justify-center overflow-hidden">
          {error ? (
            <div className="p-6 text-center max-w-sm text-stone-300 space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center">
                <AlertCircle className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-rose-300">{error}</p>
              <p className="text-xs text-stone-400">
                Tarayıcınızın kamera iznini onaylayabilir veya fotoğrafı doğrudan galerinizden yükleyebilirsiniz.
              </p>
              <button
                type="button"
                onClick={() => startCamera(facingMode)}
                className="mt-2 inline-flex items-center px-3.5 py-1.5 rounded-xl text-xs font-medium bg-stone-800 text-white hover:bg-stone-700 transition cursor-pointer"
              >
                Tekrar Dene
              </button>
            </div>
          ) : capturedImage ? (
            <div className="relative w-full h-full">
              <img
                src={capturedImage}
                alt="Çekilen oda fotoğrafı"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-md text-emerald-400 text-xs font-medium flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Fotoğraf Çekildi</span>
              </div>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />

              {/* Grid Guide Overlay */}
              <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 opacity-25">
                <div className="border-r border-b border-white" />
                <div className="border-r border-b border-white" />
                <div className="border-b border-white" />
                <div className="border-r border-b border-white" />
                <div className="border-r border-b border-white" />
                <div className="border-b border-white" />
                <div className="border-r border-white" />
                <div className="border-r border-white" />
                <div />
              </div>

              {isLoading && (
                <div className="absolute inset-0 bg-stone-950 flex flex-col items-center justify-center text-stone-400 space-y-2">
                  <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs">Kamera başlatılıyor...</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Bottom Control Bar */}
        <div className="px-6 py-4 bg-stone-900 border-t border-stone-800 flex items-center justify-between">
          {capturedImage ? (
            <>
              <button
                type="button"
                onClick={handleRetake}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-medium text-stone-300 hover:text-white hover:bg-stone-800 transition cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Tekrar Çek</span>
              </button>

              <button
                type="button"
                onClick={handleConfirmPhoto}
                className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-lg shadow-emerald-950 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Bu Fotoğrafı Kullan</span>
              </button>
            </>
          ) : (
            <>
              <div className="w-10">
                {hasMultipleCameras && (
                  <button
                    type="button"
                    onClick={handleToggleFacingMode}
                    className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition cursor-pointer"
                    title="Kamerayı Değiştir (Ön/Arka)"
                  >
                    <FlipHorizontal className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Shutter Button */}
              <button
                type="button"
                onClick={handleTakeShutter}
                disabled={isLoading || !!error}
                className="group relative flex items-center justify-center w-16 h-16 rounded-full border-4 border-white/80 hover:border-white p-1 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                title="Fotoğraf Çek"
              >
                <div className="w-full h-full rounded-full bg-white group-hover:scale-95 transition-transform" />
              </button>

              <div className="w-10" />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
