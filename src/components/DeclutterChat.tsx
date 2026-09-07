import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Loader2,
  Trash2,
  Lightbulb,
} from 'lucide-react';
import { ChatMessage, RoomAnalysisData } from '../types';
import { getApiUrl } from '../utils/apiConfig';

interface DeclutterChatProps {
  roomContext: RoomAnalysisData | null;
  roomPhotoUrl?: string | null;
}

const DEFAULT_PROMPTS = [
  'Bu odada başlamak için en iyi köşe neresi?',
  'Bir eşyayı Saklamak mı yoksa Bağışlamak mı gerektiğine nasıl karar veririm?',
  'Manevi değeri olan eşyalarla nasıl başa çıkabilirim?',
  'Kablo karmaşasını en ucuz ve pratik şekilde nasıl gizlerim?',
  'Kendimi çok bunalmış hissediyorum. Şu an yapabileceğim 5 dakikalık tek bir görev ver.',
];

export const DeclutterChat: React.FC<DeclutterChatProps> = ({
  roomContext,
  roomPhotoUrl,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome-1',
      role: 'assistant',
      content: roomContext
        ? `Merhaba! Ben Düzen Koçunuz (Coach ClutterClear). ${roomContext.roomType} odanızın fotoğrafını ve analizini inceledim (Dağınıklık Puanı: ${roomContext.clutterScore}/10). Hangi köşeden veya adımdan başlamak istersiniz?`
        : `Merhaba! Ben Düzen Koçunuz (Coach ClutterClear). İster kalabalık bir dolabı sadeleştirmek, ister dağınık bir çalışma masasını toplamak isteyin; size adım adım rehberlik etmek için buradayım. Bugün nereden başlamak istersiniz?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const messageContent = (textToSend || input).trim();
    if (!messageContent || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: messageContent,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch(getApiUrl('/api/chat'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          roomContext: roomContext || undefined,
        }),
      });

      const contentType = response.headers.get('content-type') || '';
      let data: any = null;

      if (contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const rawText = await response.text();
        console.warn('Non-JSON chat response received:', rawText.slice(0, 150));
        throw new Error('Düzen koçu şu anda meşgul. Lütfen birkaç saniye sonra tekrar yazın.');
      }

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Düzen koçundan yanıt alınamadı');
      }

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('Chat hatası:', err);
      setErrorMessage(err?.message || 'Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('Düzen Koçu ile olan sohbet geçmişini sıfırlamak istiyor musunuz?')) {
      setMessages([
        {
          id: `welcome-${Date.now()}`,
          role: 'assistant',
          content: 'Sohbet geçmişi sıfırlandı. Odanız ve eşyalarınızla ilgili bugün size nasıl yardımcı olabilirim?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6">
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs flex flex-col h-[750px] max-h-[85vh] overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 bg-stone-50/70 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-stone-900 text-sm sm:text-base">Düzen Koçu</h3>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                  Yapay Zeka
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Oda düzenleme, 4-Kutu yöntemi ve kalıcı alışkanlık danışmanlığı
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleClearHistory}
              className="p-2 text-stone-400 hover:text-stone-600 rounded-lg hover:bg-stone-200/60 transition cursor-pointer"
              title="Sohbeti temizle"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Attached Room Context Indicator */}
        {roomContext && (
          <div className="bg-emerald-50/80 border-b border-emerald-100 px-4 py-2 flex items-center justify-between text-xs text-emerald-900">
            <div className="flex items-center space-x-2 truncate">
              {roomPhotoUrl && (
                <img
                  src={roomPhotoUrl}
                  alt="Oda Küçük Resmi"
                  className="w-6 h-6 rounded-md object-cover shrink-0"
                />
              )}
              <span className="font-medium truncate">
                Aktif Oda Analizi: <strong>{roomContext.roomType}</strong> (Puan: {roomContext.clutterScore}/10)
              </span>
            </div>
            <span className="text-[10px] uppercase font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded shrink-0">
              Oda Bilgisi Bağlı
            </span>
          </div>
        )}

        {/* Messages Thread (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-stone-50/30">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start space-x-2.5 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    isUser ? 'bg-stone-900 text-white' : 'bg-emerald-600 text-white shadow-2xs'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                </div>

                <div className="max-w-[82%] sm:max-w-[75%] space-y-1">
                  <div
                    className={`p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                      isUser
                        ? 'bg-stone-900 text-white rounded-tr-xs'
                        : 'bg-white text-stone-800 border border-stone-200 shadow-2xs rounded-tl-xs'
                    }`}
                  >
                    {msg.content}
                  </div>
                  <div
                    className={`text-[10px] text-stone-400 px-1 ${isUser ? 'text-right' : 'text-left'}`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-start space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-stone-200 shadow-2xs rounded-tl-xs flex items-center space-x-2 text-stone-600 text-xs sm:text-sm">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                <span>Düzen Koçu düşünüyor...</span>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
              {errorMessage}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Prompt Chips */}
        <div className="px-4 py-2 border-t border-stone-100 bg-white overflow-x-auto">
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-stone-400 flex items-center shrink-0">
              <Lightbulb className="w-3.5 h-3.5 mr-1 text-amber-500" />
              Örnek Sorular:
            </span>
            {DEFAULT_PROMPTS.map((prompt, pIdx) => (
              <button
                key={pIdx}
                type="button"
                onClick={() => handleSendMessage(prompt)}
                disabled={isLoading}
                className="whitespace-nowrap px-3 py-1 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium transition cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-stone-200 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center space-x-2"
          >
            <input
              id="input-chat-message"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Düzen Koçuna eşya ayıklama, kablo gizleme veya oda düzeni hakkında dilediğinizi sorun..."
              disabled={isLoading}
              className="flex-1 rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 placeholder-stone-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-hidden"
            />
            <button
              id="btn-send-chat"
              type="submit"
              disabled={!input.trim() || isLoading}
              className={`p-3 rounded-xl font-semibold transition ${
                !input.trim() || isLoading
                  ? 'bg-stone-100 text-stone-300 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-xs active:scale-95'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
