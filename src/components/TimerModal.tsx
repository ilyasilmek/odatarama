import React, { useState, useEffect } from 'react';
import { X, Play, Pause, RotateCcw, Timer, CheckCircle } from 'lucide-react';

interface TimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskTitle?: string;
  initialMinutes?: number;
}

export const TimerModal: React.FC<TimerModalProps> = ({
  isOpen,
  onClose,
  taskTitle = 'Toparlama Deparı',
  initialMinutes = 5,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(initialMinutes);

  useEffect(() => {
    setSecondsLeft(initialMinutes * 60);
    setSelectedDuration(initialMinutes);
    setIsRunning(false);
  }, [initialMinutes, isOpen]);

  useEffect(() => {
    let interval: any = null;
    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isRunning) {
      setIsRunning(false);
      // Play brief web audio chime if available
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.2); // A5
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.8);
      } catch (e) {
        console.log('Ses çalınamadı veya desteklenmiyor');
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsLeft]);

  if (!isOpen) return null;

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const totalDurationSecs = selectedDuration * 60;
  const progressPercent = totalDurationSecs > 0 ? ((totalDurationSecs - secondsLeft) / totalDurationSecs) * 100 : 0;

  const handleSelectPreset = (mins: number) => {
    setSelectedDuration(mins);
    setSecondsLeft(mins * 60);
    setIsRunning(false);
  };

  const handleReset = () => {
    setSecondsLeft(selectedDuration * 60);
    setIsRunning(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xl max-w-sm w-full p-6 text-center relative overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-3">
          <Timer className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-stone-900">Odaklanmış Toparlama Sayacı</h3>
        <p className="text-xs text-stone-500 mt-0.5 line-clamp-1 px-4">{taskTitle}</p>

        {/* Circular / Large Digital Display */}
        <div className="my-6">
          <div className="text-5xl font-extrabold tracking-tight text-stone-900 font-mono">
            {formattedTime}
          </div>
          {secondsLeft === 0 ? (
            <div className="mt-2 text-xs font-semibold text-emerald-600 flex items-center justify-center">
              <CheckCircle className="w-4 h-4 mr-1" /> Harika iş çıkardınız! Süre tamamlandı!
            </div>
          ) : (
            <div className="mt-2 text-xs text-stone-400">
              {isRunning ? 'Sayaç çalışıyor — sadece bu göreve odaklanın!' : 'Duraklatıldı'}
            </div>
          )}

          {/* Progress Bar */}
          <div className="w-full h-2 bg-stone-100 rounded-full mt-4 overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center justify-center space-x-2 mb-6">
          {[2, 5, 10, 15].map((mins) => (
            <button
              key={mins}
              onClick={() => handleSelectPreset(mins)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                selectedDuration === mins
                  ? 'bg-stone-900 text-white shadow-2xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {mins} dk
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-3">
          <button
            onClick={handleReset}
            className="p-3 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-100 transition cursor-pointer"
            title="Sayacı sıfırla"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-6 py-3 rounded-xl font-semibold text-sm flex items-center space-x-2 transition shadow-xs cursor-pointer ${
              isRunning
                ? 'bg-amber-500 hover:bg-amber-600 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Duraklat</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>{secondsLeft === 0 ? 'Yeniden Başlat' : 'Sayacı Başlat'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
