import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  MessageSquare,
  AlertTriangle,
  Layers,
  Box,
  Repeat,
  Zap,
  Check,
  Printer,
  ChevronRight,
  Flame,
  ShieldCheck,
  Package,
} from 'lucide-react';
import { RoomAnalysisData } from '../types';

interface AnalysisResultsProps {
  analysis: RoomAnalysisData;
  photoUrl: string;
  completedTaskIds: string[];
  onToggleTask: (taskId: string) => void;
  onOpenCoachChat: () => void;
  onStartTimerForTask: (taskTitle: string, durationMinutes: number) => void;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({
  analysis,
  photoUrl,
  completedTaskIds,
  onToggleTask,
  onOpenCoachChat,
  onStartTimerForTask,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'plan' | 'zones' | 'storage'>('overview');
  const [boxFilter, setBoxFilter] = useState<string>('all');
  const [copiedNotification, setCopiedNotification] = useState(false);

  const totalTasks = analysis.actionPlan?.length || 0;
  const completedCount = completedTaskIds.length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  // Clutter score colors and labels
  const getScoreColor = (score: number) => {
    if (score <= 3) return { bg: 'bg-emerald-500', text: 'text-emerald-700', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    if (score <= 6) return { bg: 'bg-amber-500', text: 'text-amber-700', badge: 'bg-amber-50 text-amber-700 border-amber-200' };
    if (score <= 8) return { bg: 'bg-orange-500', text: 'text-orange-700', badge: 'bg-orange-50 text-orange-700 border-orange-200' };
    return { bg: 'bg-rose-500', text: 'text-rose-700', badge: 'bg-rose-50 text-rose-700 border-rose-200' };
  };

  const scoreStyle = getScoreColor(analysis.clutterScore);

  // Filter tasks
  const filteredTasks = (analysis.actionPlan || []).filter((task) => {
    if (boxFilter === 'all') return true;
    const cat = task.boxMethodCategory.toLowerCase();
    const filter = boxFilter.toLowerCase();
    if (filter === 'sakla' || filter === 'keep') return cat.includes('sakla') || cat.includes('keep');
    if (filter === 'bağışla' || filter === 'donate') return cat.includes('bağış') || cat.includes('donate') || cat.includes('sat');
    if (filter === 'yerini değiştir' || filter === 'relocate') return cat.includes('yer') || cat.includes('relocate');
    if (filter === 'at' || filter === 'trash') return cat.includes('at') || cat.includes('trash') || cat.includes('geri');
    return cat.includes(filter);
  });

  const handleExportText = () => {
    const textLines = [
      `=== ODA DÜZENLEME PLANI: ${(analysis.roomType || 'ODA').toUpperCase()} ===`,
      `Dağınıklık Puanı: ${analysis.clutterScore}/10 (${analysis.clutterLevel})`,
      `\nGENEL ÖZET:\n${analysis.summary}`,
      `\nHIZLI KAZANIMLAR (5 Dakika Altı):`,
      ...(analysis.quickWins || []).map((q) => `- [${q.duration}] ${q.task}: ${q.impact}`),
      `\nADIM ADIM EYLEM PLANI (4-KUTU YÖNTEMİ):`,
      ...(analysis.actionPlan || []).map(
        (a, i) =>
          `${i + 1}. [${completedTaskIds.includes(a.id) ? 'TAMAMLANDI' : ' '}] ${a.title} (${a.timeEstimate}, ${a.boxMethodCategory})\n   ${a.description}`
      ),
      `\nGÜNLÜK KALICI ALIŞKANLIKLAR:`,
      ...(analysis.maintenanceHabits || []).map((h) => `- ${h.habit} (${h.frequency}): ${h.description}`),
    ];
    navigator.clipboard.writeText(textLines.join('\n'));
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Top Banner: Score & Room Snapshot */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 items-stretch">
          {/* Room Photo Preview */}
          <div className="md:col-span-4 relative bg-stone-900 min-h-[220px] md:min-h-[260px]">
            <img
              src={photoUrl}
              alt="Analiz Edilen Oda"
              className="w-full h-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 text-white">
              <span className="text-xs font-semibold uppercase tracking-wider bg-black/50 backdrop-blur px-2 py-0.5 rounded text-stone-200">
                Analiz Edilen Mekan
              </span>
              <p className="text-sm font-semibold mt-1">{analysis.roomType}</p>
            </div>
          </div>

          {/* Assessment & Metrics */}
          <div className="md:col-span-8 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${scoreStyle.badge}`}>
                    {analysis.clutterLevel} Dağınıklık Seviyesi
                  </span>
                  <span className="text-xs text-stone-500 font-medium">Gemini Vision Analizi</span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleExportText}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-stone-200 text-stone-700 hover:bg-stone-50 transition cursor-pointer"
                    title="Planı panoya kopyala"
                  >
                    {copiedNotification ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600 font-semibold">Kopyalandı!</span>
                      </>
                    ) : (
                      <>
                        <Printer className="w-3.5 h-3.5 text-stone-500" />
                        <span>Planı Kopyala</span>
                      </>
                    )}
                  </button>

                  <button
                    id="btn-ask-coach-top"
                    onClick={onOpenCoachChat}
                    className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Koça Sor</span>
                  </button>
                </div>
              </div>

              {/* Clutter Score Gauge & Summary */}
              <div className="flex items-start space-x-5 mb-4">
                <div className="shrink-0 text-center">
                  <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-stone-100 flex flex-col items-center justify-center border border-stone-200">
                    <span className="text-2xl sm:text-3xl font-bold text-stone-900 leading-none">
                      {analysis.clutterScore}
                    </span>
                    <span className="text-[10px] uppercase font-semibold text-stone-500 mt-0.5">/ 10 Puan</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h2 className="text-lg font-semibold text-stone-900 leading-tight">
                    Mekansal Değerlendirme &amp; İyileştirme Stratejisi
                  </h2>
                  <p className="text-sm text-stone-600 leading-relaxed">{analysis.summary}</p>
                </div>
              </div>
            </div>

            {/* Task Completion Progress Meter */}
            <div className="pt-4 border-t border-stone-100">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-stone-700 flex items-center">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mr-1.5" />
                  Eylem Planı İlerlemesi: {totalTasks} görevden {completedCount} tanesi tamamlandı
                </span>
                <span className="font-bold text-stone-900">%{completionPercentage}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                <div
                  className="h-full bg-emerald-600 transition-all duration-500 rounded-full"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex border-b border-stone-200 overflow-x-auto gap-2 pb-1">
        <button
          onClick={() => setActiveSubTab('overview')}
          className={`flex items-center space-x-2 px-4 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition cursor-pointer ${
            activeSubTab === 'overview'
              ? 'border-emerald-600 text-emerald-700 font-semibold'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Zap className="w-4 h-4 text-amber-500" />
          <span>Hızlı Kazanımlar &amp; Sorunlar</span>
        </button>

        <button
          onClick={() => setActiveSubTab('plan')}
          className={`flex items-center space-x-2 px-4 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition cursor-pointer ${
            activeSubTab === 'plan'
              ? 'border-emerald-600 text-emerald-700 font-semibold'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Box className="w-4 h-4 text-emerald-600" />
          <span>4-Kutu Eylem Listesi</span>
          <span className="ml-1 text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full">
            {totalTasks}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('zones')}
          className={`flex items-center space-x-2 px-4 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition cursor-pointer ${
            activeSubTab === 'zones'
              ? 'border-emerald-600 text-emerald-700 font-semibold'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Layers className="w-4 h-4 text-blue-600" />
          <span>Bölge Bazlı Çözümler</span>
          <span className="ml-1 text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full">
            {analysis.zones?.length || 0}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('storage')}
          className={`flex items-center space-x-2 px-4 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition cursor-pointer ${
            activeSubTab === 'storage'
              ? 'border-emerald-600 text-emerald-700 font-semibold'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Package className="w-4 h-4 text-indigo-600" />
          <span>Depolama &amp; Alışkanlıklar</span>
        </button>
      </div>

      {/* Tab 1: Overview & Quick Wins */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Wins Banner */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-5 sm:p-6">
            <div className="flex items-center space-x-2 mb-3">
              <Flame className="w-5 h-5 text-amber-600" />
              <h3 className="text-base font-semibold text-stone-900">
                5 Dakikalık Hızlı Kazanımlar (Quick Wins)
              </h3>
              <span className="text-xs bg-amber-100 text-amber-800 font-medium px-2 py-0.5 rounded-full">
                Anında Moral &amp; Ferahlık
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 mb-4">
              Önce bu zahmetsiz, ufak adımları tamamlayın. Görsel karmaşayı hemen azaltarak toparlama motivasyonunuzu katlayacaktır.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(analysis.quickWins || []).map((win, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl border border-amber-200/60 p-4 shadow-2xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold text-amber-700 mb-1.5">
                      <span className="flex items-center">
                        <Clock className="w-3.5 h-3.5 mr-1" />
                        {win.duration}
                      </span>
                      <span className="text-stone-400">Adım {idx + 1}</span>
                    </div>
                    <h4 className="text-sm font-semibold text-stone-900 mb-1">{win.task}</h4>
                    <p className="text-xs text-stone-600 leading-relaxed">{win.impact}</p>
                  </div>

                  <button
                    onClick={() => onStartTimerForTask(win.task, 5)}
                    className="mt-4 w-full py-1.5 px-3 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center space-x-1 transition shadow-2xs cursor-pointer"
                  >
                    <Clock className="w-3.5 h-3.5 mr-1" />
                    <span>5 Dk Sayacı Başlat</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Primary Detected Bottlenecks */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
            <h3 className="text-base font-semibold text-stone-900 mb-4 flex items-center">
              <AlertTriangle className="w-4 h-4 text-orange-500 mr-2" />
              Fotoğrafta Tespit Edilen Temel Dağınıklık Nedenleri
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {(analysis.keyIssues || []).map((issue, idx) => (
                <div
                  key={idx}
                  className="flex items-start space-x-3 p-3.5 rounded-xl bg-stone-50 border border-stone-200/70"
                >
                  <span className="w-5 h-5 rounded-full bg-stone-200 text-stone-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-xs sm:text-sm text-stone-800 font-medium leading-relaxed">
                    {issue}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: 4-Box Action Checklist */}
      {activeSubTab === 'plan' && (
        <div className="space-y-5">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
            <div className="flex items-center space-x-1.5 overflow-x-auto text-xs">
              <span className="text-stone-500 font-semibold mr-1">Kutu Filtresi:</span>
              {[
                { key: 'all', label: 'Tüm Görevler' },
                { key: 'sakla', label: 'Sakla' },
                { key: 'bağışla', label: 'Bağışla / Sat' },
                { key: 'yerini değiştir', label: 'Yerini Değiştir' },
                { key: 'at', label: 'At / Dönüştür' },
              ].map((filterItem) => (
                <button
                  key={filterItem.key}
                  onClick={() => setBoxFilter(filterItem.key)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                    boxFilter === filterItem.key
                      ? 'bg-stone-900 text-white font-semibold'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {filterItem.label}
                </button>
              ))}
            </div>

            <div className="text-xs text-stone-500 font-medium">
              Tamamladığınız adımları işaretleyerek ilerlemenizi kaydedin!
            </div>
          </div>

          {/* Action Cards */}
          <div className="space-y-3">
            {filteredTasks.map((task) => {
              const isDone = completedTaskIds.includes(task.id);
              return (
                <div
                  key={task.id}
                  onClick={() => onToggleTask(task.id)}
                  className={`p-4 sm:p-5 rounded-2xl border transition cursor-pointer ${
                    isDone
                      ? 'bg-emerald-50/40 border-emerald-200 text-stone-500'
                      : 'bg-white border-stone-200 hover:border-stone-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-start space-x-3.5">
                    <button
                      type="button"
                      className="mt-0.5 text-stone-400 hover:text-emerald-600 transition shrink-0 cursor-pointer"
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h4
                          className={`text-sm sm:text-base font-semibold ${
                            isDone ? 'line-through text-stone-500' : 'text-stone-900'
                          }`}
                        >
                          {task.title}
                        </h4>

                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-stone-100 text-stone-700 border border-stone-200">
                          <Clock className="w-3 h-3 mr-1 text-stone-500" />
                          {task.timeEstimate}
                        </span>

                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {task.boxMethodCategory}
                        </span>
                      </div>

                      <p className={`text-xs sm:text-sm leading-relaxed ${isDone ? 'text-stone-400' : 'text-stone-600'}`}>
                        {task.description}
                      </p>

                      {task.proTip && (
                        <div className="mt-2 text-xs text-stone-500 bg-stone-50/80 rounded-lg p-2 border border-stone-100 flex items-center space-x-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span>
                            <strong className="text-stone-700">Uzman Püf Noktası:</strong> {task.proTip}
                          </span>
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onStartTimerForTask(task.title, 15);
                      }}
                      className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border border-stone-200 text-stone-600 hover:bg-stone-100 shrink-0 cursor-pointer"
                      title="15 dakikalık sayaç başlat"
                    >
                      <Clock className="w-3 h-3 mr-1 text-stone-400" />
                      Sayaç
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Zone-by-Zone Breakdown */}
      {activeSubTab === 'zones' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {(analysis.zones || []).map((zone, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-stone-200 shadow-xs p-5 sm:p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 font-bold flex items-center justify-center text-xs">
                      {idx + 1}
                    </div>
                    <h4 className="font-semibold text-stone-900 text-base">{zone.zoneName}</h4>
                  </div>
                  <span className="text-xs text-stone-400 font-medium">İncelenen Bölge</span>
                </div>

                <div className="space-y-3 mb-4">
                  <div>
                    <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block mb-1">
                      Fotoğrafta Görülen Durum:
                    </span>
                    <p className="text-xs sm:text-sm text-stone-700 bg-stone-50 p-2.5 rounded-lg border border-stone-100 leading-relaxed">
                      {zone.currentObservation}
                    </p>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider block mb-1">
                      Önerilen Düzenleme Çözümü:
                    </span>
                    <p className="text-xs sm:text-sm text-stone-800 font-medium leading-relaxed">
                      {zone.recommendation}
                    </p>
                  </div>
                </div>
              </div>

              {zone.suggestedProducts && zone.suggestedProducts.length > 0 && (
                <div className="pt-3 border-t border-stone-100">
                  <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block mb-2">
                    Önerilen Düzenleme Araçları:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {zone.suggestedProducts.map((p, pIdx) => (
                      <span
                        key={pIdx}
                        className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs bg-stone-100 text-stone-700 font-medium border border-stone-200/80"
                      >
                        <ShieldCheck className="w-3 h-3 mr-1 text-emerald-600" />
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Storage Solutions & Micro-Habits */}
      {activeSubTab === 'storage' && (
        <div className="space-y-6">
          {/* Smart Storage Tools */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
            <h3 className="text-base font-semibold text-stone-900 mb-4 flex items-center">
              <Package className="w-4 h-4 text-emerald-600 mr-2" />
              Önerilen Depolama Düzeni ve Pratik Ürünler
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(analysis.storageSolutions || []).map((sol, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 flex flex-col justify-between"
                >
                  <div>
                    <h4 className="font-semibold text-stone-900 text-sm mb-1">{sol.title}</h4>
                    <p className="text-xs text-stone-600 mb-3 leading-relaxed">{sol.purpose}</p>
                  </div>
                  <div className="text-[11px] text-emerald-800 font-medium bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                    Yerleşim Konumu: {sol.placement}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Micro-Habits */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
            <h3 className="text-base font-semibold text-stone-900 mb-4 flex items-center">
              <Repeat className="w-4 h-4 text-indigo-600 mr-2" />
              Kalıcı Mikro Alışkanlıklar (Bir Daha Dağılmasın)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(analysis.maintenanceHabits || []).map((h, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/30 flex items-start space-x-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Repeat className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-stone-900 text-sm">{h.habit}</h4>
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                        {h.frequency}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">{h.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom CTA for Coach Chat */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold">Sorularınız mı var veya nereden başlayacağınızı bilemiyor musunuz?</h3>
          <p className="text-xs sm:text-sm text-emerald-100 mt-0.5">
            Manevi eşyaları ayıklama, kabloları gizleme veya bütçe dostu kutulama hakkında yapay zeka Düzen Koçumuzla konuşun.
          </p>
        </div>
        <button
          id="btn-open-coach-chat"
          onClick={onOpenCoachChat}
          className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-white text-emerald-800 hover:bg-emerald-50 transition shrink-0 shadow-xs flex items-center space-x-2 cursor-pointer"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Düzen Koçu ile Sohbet Edin</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
