import React from 'react';
import { SavedRoomRecord } from '../types';
import { Archive, Calendar, CheckCircle2, Trash2, ArrowRight, Sparkles, FolderOpen } from 'lucide-react';

interface RoomHistoryProps {
  savedRooms: SavedRoomRecord[];
  onSelectRoom: (room: SavedRoomRecord) => void;
  onDeleteRoom: (roomId: string) => void;
  onStartNewRoom: () => void;
}

export const RoomHistory: React.FC<RoomHistoryProps> = ({
  savedRooms,
  onSelectRoom,
  onDeleteRoom,
  onStartNewRoom,
}) => {
  if (savedRooms.length === 0) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-center mx-auto text-stone-400 mb-4">
          <Archive className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-semibold text-stone-900">Henüz Kaydedilmiş Oda Yok</h3>
        <p className="text-sm text-stone-500 mt-1.5 max-w-md mx-auto">
          Bir oda fotoğrafı yükleyip analiz ettirdiğinizde, planınız ve ilerleme takibiniz otomatik olarak burada saklanır.
        </p>
        <button
          onClick={onStartNewRoom}
          className="mt-6 inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>Yeni Bir Oda Analiz Et</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-stone-900 tracking-tight">Kayıtlı Oda Analizleri</h2>
          <p className="text-sm text-stone-500 mt-0.5">
            Planlarınıza tekrar göz atın, görevleri işaretleyin ve düzenleme sürecinizi takip edin
          </p>
        </div>
        <button
          onClick={onStartNewRoom}
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Yeni Oda Analiz Et</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {savedRooms.map((record) => {
          const totalTasks = record.analysis?.actionPlan?.length || 0;
          const completedCount = record.completedTaskIds?.length || 0;
          const percentage = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

          return (
            <div
              key={record.id}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:border-stone-300 transition flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 bg-stone-900">
                  <img
                    src={record.photoUrl}
                    alt={record.roomType}
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-white flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-semibold uppercase bg-emerald-600/90 backdrop-blur px-2 py-0.5 rounded text-white">
                        {record.roomType}
                      </span>
                      <p className="text-sm font-semibold mt-1 truncate">{record.goal}</p>
                    </div>

                    <div className="bg-black/50 backdrop-blur px-2.5 py-1 rounded-lg text-right">
                      <div className="text-xs font-bold text-amber-300">
                        Puan {record.analysis.clutterScore}/10
                      </div>
                      <div className="text-[9px] text-stone-300">{record.analysis.clutterLevel}</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-5">
                  <div className="flex items-center text-xs text-stone-400 mb-2">
                    <Calendar className="w-3.5 h-3.5 mr-1" />
                    <span>Analiz Tarihi: {new Date(record.createdAt).toLocaleDateString('tr-TR')}</span>
                  </div>

                  <p className="text-xs sm:text-sm text-stone-600 line-clamp-2 mb-4">
                    {record.analysis.summary}
                  </p>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="text-stone-600 flex items-center">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mr-1" />
                        Tamamlanan Görevler: {completedCount}/{totalTasks}
                      </span>
                      <span className="text-stone-900 font-semibold">%{percentage}</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 transition-all rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => onDeleteRoom(record.id)}
                  className="p-2 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-stone-200/50 transition cursor-pointer"
                  title="Bu oda kaydını sil"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onSelectRoom(record)}
                  className="inline-flex items-center space-x-1 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-stone-900 hover:bg-stone-800 text-white transition shadow-2xs cursor-pointer"
                >
                  <FolderOpen className="w-3.5 h-3.5 mr-1" />
                  <span>Planı Aç</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
