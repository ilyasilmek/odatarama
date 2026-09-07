import React, { useState, useEffect } from 'react';
import { X, Server, Check, AlertCircle, RefreshCw, Zap } from 'lucide-react';
import { DEFAULT_CLOUD_RUN_BACKEND } from '../utils/apiConfig';

interface BackendConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BackendConfigModal: React.FC<BackendConfigModalProps> = ({ isOpen, onClose }) => {
  const [backendUrl, setBackendUrl] = useState('');
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'connected' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('declutter_backend_url') || '';
      setBackendUrl(stored);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setTestStatus('testing');
    setErrorMessage('');
    try {
      const url = backendUrl.trim().replace(/\/+$/, '');
      const testEndpoint = url ? `${url}/api/health` : '/api/health';
      const res = await fetch(testEndpoint);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} yanıtı alındı`);
      }
      const data = await res.json();
      if (data.status === 'ok') {
        setTestStatus('connected');
      } else {
        throw new Error('Geçersiz yanıt formatı');
      }
    } catch (err: any) {
      setTestStatus('error');
      setErrorMessage(err?.message || 'Sunucuya bağlanılamadı');
    }
  };

  const handleUseDefaultCloudRun = () => {
    setBackendUrl(DEFAULT_CLOUD_RUN_BACKEND);
    setTestStatus('idle');
  };

  const handleSave = () => {
    const clean = backendUrl.trim().replace(/\/+$/, '');
    if (clean) {
      localStorage.setItem('declutter_backend_url', clean);
    } else {
      localStorage.removeItem('declutter_backend_url');
    }
    onClose();
  };

  const isGitHubPages = typeof window !== 'undefined' && window.location.hostname.endsWith('github.io');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
          <Server className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-stone-900">API &amp; Sunucu Bağlantısı</h3>
        <p className="text-xs text-stone-500 mt-1">
          {isGitHubPages
            ? 'GitHub Pages statik dosya barındırır. Yapay zeka analizi ve Düzen Koçu için çalışan sunucu adresinizi (örn. Cloud Run veya Render) girebilirsiniz.'
            : 'Harici sunucu için adres girin veya yerleşik sunucu için boş bırakın.'}
        </p>

        <div className="mt-4 space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
                Sunucu Servis URL'si
              </label>
              <button
                type="button"
                onClick={handleUseDefaultCloudRun}
                className="inline-flex items-center space-x-1 text-[11px] font-medium text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer"
              >
                <Zap className="w-3 h-3 text-emerald-600" />
                <span>AI Studio Cloud Run URL'sini Doldur</span>
              </button>
            </div>
            <input
              type="url"
              value={backendUrl}
              onChange={(e) => {
                setBackendUrl(e.target.value);
                setTestStatus('idle');
              }}
              placeholder="https://sunucu-adresiniz.run.app"
              className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-xs text-stone-900 placeholder-stone-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-hidden"
            />
          </div>

          <div className="flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testStatus === 'testing'}
              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-50 font-medium transition cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1 ${testStatus === 'testing' ? 'animate-spin text-emerald-600' : ''}`} />
              <span>Bağlantıyı Test Et</span>
            </button>

            {testStatus === 'connected' && (
              <span className="text-emerald-700 font-medium flex items-center">
                <Check className="w-4 h-4 mr-1" /> Bağlandı (/api/health ok)
              </span>
            )}

            {testStatus === 'error' && (
              <span className="text-rose-600 font-medium flex items-center truncate max-w-[200px]" title={errorMessage}>
                <AlertCircle className="w-4 h-4 mr-1 shrink-0" /> {errorMessage}
              </span>
            )}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 transition cursor-pointer"
          >
            İptal
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-xs cursor-pointer"
          >
            URL'yi Kaydet
          </button>
        </div>
      </div>
    </div>
  );
};
