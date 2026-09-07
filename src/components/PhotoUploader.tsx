import React, { useState, useRef } from 'react';
import { UploadCloud, Camera, Image as ImageIcon, Sparkles, Check, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { RoomType, DeclutterGoal, SampleRoom } from '../types';
import { SAMPLE_ROOMS } from '../data/sampleRooms';
import { fileToBase64, urlToBase64 } from '../utils/imageHelper';
import { CameraModal } from './CameraModal';

interface PhotoUploaderProps {
  onAnalyze: (payload: {
    imageBase64: string;
    mimeType: string;
    roomType: RoomType;
    goal: DeclutterGoal;
    focusNotes: string;
  }) => Promise<void>;
  isAnalyzing: boolean;
  analysisError: string | null;
}

const ROOM_TYPES: RoomType[] = [
  'Ev Ofisi / Çalışma Masası',
  'Oturma Odası / Salon',
  'Yatak Odası',
  'Mutfak & Kiler',
  'Gardırop & Giysi Dolabı',
  'Banyo',
  'Depo & Garaj',
  'Yemek Odası',
  'Antre / Koridor',
  'Çocuk Odası',
];

const DECLUTTER_GOALS: DeclutterGoal[] = [
  'Genel Düzenleme & Alan Canlandırma',
  'Derinlemesine 4 Kutu Yöntemi (Sakla/Bağışla/At)',
  'Maksimum Depolama & Zemin Alanı Kazanma',
  'Masa & Kablo Yönetimi',
  'Gardırop & Dolap Sadeleştirme',
  '15 Dakikalık Acil Toparlama',
];

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  onAnalyze,
  isAnalyzing,
  analysisError,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/jpeg');
  const [roomType, setRoomType] = useState<RoomType>('Ev Ofisi / Çalışma Masası');
  const [goal, setGoal] = useState<DeclutterGoal>('Genel Düzenleme & Alan Canlandırma');
  const [focusNotes, setFocusNotes] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [selectedSampleId, setSelectedSampleId] = useState<string | null>(null);
  const [isLoadingSample, setIsLoadingSample] = useState<boolean>(false);
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Lütfen geçerli bir görsel dosyası yükleyin (JPG, PNG, WebP).');
      return;
    }
    try {
      const res = await fileToBase64(file);
      setSelectedImage(res.base64);
      setMimeType(res.mimeType);
      setSelectedSampleId(null);
    } catch (err) {
      console.error('Görsel işleme hatası:', err);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSelectSample = async (sample: SampleRoom) => {
    setIsLoadingSample(true);
    setSelectedSampleId(sample.id);
    setRoomType(sample.roomType);
    setGoal(sample.goal);
    try {
      const res = await urlToBase64(sample.imageUrl);
      setSelectedImage(res.base64);
      setMimeType(res.mimeType);
    } catch (err) {
      console.warn('Örnek görsel base64 dönüştürme hatası, direkt URL kullanılıyor:', err);
      setSelectedImage(sample.imageUrl);
    } finally {
      setIsLoadingSample(false);
    }
  };

  const handleStartAnalysis = () => {
    if (!selectedImage) return;
    onAnalyze({
      imageBase64: selectedImage,
      mimeType,
      roomType,
      goal,
      focusNotes,
    });
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
      {/* Hero Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h1 className="text-3xl sm:text-4xl font-semibold text-stone-900 tracking-tight">
          Dağınıklığı Düzen ve Huzura Dönüştürün
        </h1>
        <p className="mt-2 text-stone-600 text-sm sm:text-base">
          Odanızın fotoğrafını yükleyin; Gemini AI görsel analiziyle 4-Kutu yöntemi adım adım düzenleme planı ve bölge bazlı akıllı çözümler sunsun.
        </p>
      </div>

      {analysisError && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 mt-0.5 shrink-0 text-rose-600" />
          <div className="text-sm">
            <p className="font-medium">Analiz sırasında bir sorun oluştu</p>
            <p className="text-rose-700 mt-0.5">{analysisError}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Image Upload Area */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-5 sm:p-6">
            <h2 className="text-base font-semibold text-stone-900 mb-3 flex items-center justify-between">
              <span>1. Oda Fotoğrafı Yükleyin</span>
              {selectedImage && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedImage(null);
                    setSelectedSampleId(null);
                  }}
                  className="text-xs text-rose-600 hover:text-rose-700 font-medium cursor-pointer"
                >
                  Fotoğrafı Değiştir
                </button>
              )}
            </h2>

            {!selectedImage ? (
              <div>
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragOver(true);
                  }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-8 sm:p-10 text-center cursor-pointer transition-all ${
                    isDragOver
                      ? 'border-emerald-500 bg-emerald-50/50'
                      : 'border-stone-300 hover:border-stone-400 bg-stone-50/60'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleFileChange(e.target.files[0]);
                    }}
                  />
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleFileChange(e.target.files[0]);
                    }}
                  />

                  <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 mb-4">
                    <UploadCloud className="w-7 h-7" />
                  </div>

                  <p className="text-sm font-semibold text-stone-800">
                    Göz atmak için tıklayın veya fotoğrafı buraya sürükleyin
                  </p>
                  <p className="text-xs text-stone-500 mt-1">JPG, PNG, WebP formatları desteklenir (20MB'a kadar)</p>

                  <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsCameraOpen(true);
                      }}
                      className="inline-flex items-center px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 border border-emerald-300 text-emerald-800 hover:bg-emerald-100 shadow-2xs cursor-pointer transition-colors"
                    >
                      <Camera className="w-3.5 h-3.5 mr-1.5 text-emerald-700" />
                      Kamera ile Çek
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-white border border-stone-300 text-stone-700 hover:bg-stone-100 shadow-2xs cursor-pointer"
                    >
                      <ImageIcon className="w-3.5 h-3.5 mr-1.5 text-stone-600" />
                      Dosyalara Göz At
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative rounded-xl overflow-hidden border border-stone-200 bg-stone-900 group">
                <img
                  src={selectedImage}
                  alt="Analiz edilecek oda"
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                  <span className="bg-black/50 backdrop-blur px-2.5 py-1 rounded-md">
                    Gemini Mekansal Analizi İçin Hazır
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setIsCameraOpen(true)}
                      className="bg-stone-900/80 hover:bg-stone-900 text-white px-2.5 py-1 rounded-md font-medium transition cursor-pointer flex items-center space-x-1"
                    >
                      <Camera className="w-3 h-3" />
                      <span>Kamera</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedImage(null);
                        setSelectedSampleId(null);
                      }}
                      className="bg-white/90 hover:bg-white text-stone-900 px-3 py-1 rounded-md font-medium transition cursor-pointer"
                    >
                      Fotoğrafı Değiştir
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Sample Presets */}
            <div className="mt-6 pt-5 border-t border-stone-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Veya hazır örnek odalarla hemen deneyin:
                </span>
                {isLoadingSample && (
                  <span className="text-xs text-emerald-600 flex items-center">
                    <Loader2 className="w-3 h-3 animate-spin mr-1" /> Örnek hazırlanıyor...
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {SAMPLE_ROOMS.map((sample) => (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => handleSelectSample(sample)}
                    className={`text-left p-2 rounded-xl border transition group overflow-hidden cursor-pointer ${
                      selectedSampleId === sample.id
                        ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20'
                        : 'border-stone-200 hover:border-stone-300 bg-stone-50/50'
                    }`}
                  >
                    <div className="aspect-video w-full rounded-lg overflow-hidden bg-stone-200 mb-1.5 relative">
                      <img
                        src={sample.imageUrl}
                        alt={sample.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        loading="eager"
                      />
                      {selectedSampleId === sample.id && (
                        <div className="absolute top-1 right-1 bg-emerald-600 text-white p-0.5 rounded-full shadow-xs">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                    <div className="text-xs font-medium text-stone-900 truncate">{sample.name}</div>
                    <div className="text-[10px] text-stone-500 truncate">{sample.description}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Customization Parameters & Action Trigger */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-5 sm:p-6 space-y-5">
            <h2 className="text-base font-semibold text-stone-900">2. Oda Detayları ve Hedefiniz</h2>

            {/* Room Type Picker */}
            <div>
              <label htmlFor="select-room-type" className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
                Oda Türü
              </label>
              <select
                id="select-room-type"
                value={roomType}
                onChange={(e) => setRoomType(e.target.value as RoomType)}
                className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-hidden"
              >
                {ROOM_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Primary Decluttering Goal */}
            <div>
              <label htmlFor="select-declutter-goal" className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
                Öncelikli Hedef
              </label>
              <select
                id="select-declutter-goal"
                value={goal}
                onChange={(e) => setGoal(e.target.value as DeclutterGoal)}
                className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-hidden"
              >
                {DECLUTTER_GOALS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            {/* Specific Notes / Pain Points */}
            <div>
              <label htmlFor="input-focus-notes" className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
                Özel Notlar veya Rahatsız Eden Noktalar <span className="text-stone-400 font-normal">(İsteğe Bağlı)</span>
              </label>
              <textarea
                id="input-focus-notes"
                rows={3}
                value={focusNotes}
                onChange={(e) => setFocusNotes(e.target.value)}
                placeholder="Örn: Masanın altındaki kablolar çok karışık; çok fazla kağıt ve evrak birikti; kitapları koyacak yer bulamıyorum."
                className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 placeholder-stone-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-hidden resize-none"
              />
            </div>

            {/* Method Highlight info pill */}
            <div className="rounded-xl bg-stone-50 border border-stone-200/80 p-3.5 text-xs text-stone-600 space-y-1">
              <div className="font-semibold text-stone-900 flex items-center">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 mr-1.5 shrink-0" />
                4-Kutu Yöntemi Planı
              </div>
              <p>
                Gemini; tespit edilen eşyaları <strong>Sakla</strong>, <strong>Bağışla/Sat</strong>, <strong>Yerini Değiştir</strong> ve <strong>At/Geri Dönüştür</strong> olarak kategorize ederek uygulanabilir mikro adımlara böler.
              </p>
            </div>

            {/* Submit Analyze Button */}
            <button
              id="btn-analyze-room"
              type="button"
              disabled={!selectedImage || isAnalyzing}
              onClick={handleStartAnalysis}
              className={`w-full py-3.5 px-4 rounded-xl font-semibold text-sm flex items-center justify-center space-x-2 transition shadow-xs ${
                !selectedImage || isAnalyzing
                  ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer active:scale-[0.99]'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Gemini Vision ile Oda Analiz Ediliyor...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Odayı Analiz Et &amp; Plan Oluştur</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(img) => {
          setSelectedImage(img);
          setMimeType('image/jpeg');
          setSelectedSampleId(null);
        }}
      />
    </div>
  );
};
