import React, { useState, useEffect } from 'react';
import { RoomAnalysisData, SavedRoomRecord, RoomType, DeclutterGoal } from './types';
import { getApiUrl } from './utils/apiConfig';
import { Navbar } from './components/Navbar';
import { PhotoUploader } from './components/PhotoUploader';
import { AnalysisResults } from './components/AnalysisResults';
import { DeclutterChat } from './components/DeclutterChat';
import { RoomHistory } from './components/RoomHistory';
import { TimerModal } from './components/TimerModal';

const STORAGE_KEY = 'room_declutter_ai_records_v1';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'upload' | 'plan' | 'chat' | 'history'>('upload');
  const [activeAnalysis, setActiveAnalysis] = useState<RoomAnalysisData | null>(null);
  const [activePhotoUrl, setActivePhotoUrl] = useState<string | null>(null);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([]);
  const [savedRooms, setSavedRooms] = useState<SavedRoomRecord[]>([]);

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const [timerModal, setTimerModal] = useState<{
    isOpen: boolean;
    taskTitle: string;
    initialMinutes: number;
  }>({
    isOpen: false,
    taskTitle: 'Quick 5-Minute Declutter',
    initialMinutes: 5,
  });

  // Load saved rooms from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setSavedRooms(parsed);
          // If there's an existing room, load the most recent one as active
          if (parsed.length > 0) {
            const latest = parsed[0];
            setActiveAnalysis(latest.analysis);
            setActivePhotoUrl(latest.photoUrl);
            setActiveRoomId(latest.id);
            setCompletedTaskIds(latest.completedTaskIds || []);
          }
        }
      }
    } catch (e) {
      console.warn('Failed to read from localStorage:', e);
    }
  }, []);

  // Sync saved rooms to localStorage
  const persistRooms = (rooms: SavedRoomRecord[]) => {
    setSavedRooms(rooms);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rooms));
    } catch (e) {
      console.warn('Failed to persist to localStorage:', e);
    }
  };

  const handleAnalyze = async (payload: {
    imageBase64: string;
    mimeType: string;
    roomType: RoomType;
    goal: DeclutterGoal;
    focusNotes: string;
  }) => {
    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const response = await fetch(getApiUrl('/api/analyze-room'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const contentType = response.headers.get('content-type') || '';
      let resData: any = null;

      if (contentType.includes('application/json')) {
        resData = await response.json();
      } else {
        const rawText = await response.text();
        console.warn('Non-JSON response received:', rawText.slice(0, 150));
        throw new Error('Sunucudan beklenmeyen bir yanıt alındı. Lütfen birkaç saniye sonra tekrar deneyin.');
      }

      if (!response.ok || !resData.success) {
        throw new Error(resData.error || 'Oda analizi tamamlanamadı. Lütfen tekrar deneyin.');
      }

      const analysisResult: RoomAnalysisData = resData.data;
      const newRecordId = `room-${Date.now()}`;

      const newRecord: SavedRoomRecord = {
        id: newRecordId,
        createdAt: new Date().toISOString(),
        roomType: payload.roomType,
        goal: payload.goal,
        photoUrl: payload.imageBase64,
        analysis: analysisResult,
        completedTaskIds: [],
      };

      const updatedList = [newRecord, ...savedRooms.filter((r) => r.id !== newRecordId)];
      persistRooms(updatedList);

      setActiveAnalysis(analysisResult);
      setActivePhotoUrl(payload.imageBase64);
      setActiveRoomId(newRecordId);
      setCompletedTaskIds([]);
      setCurrentTab('plan');
    } catch (err: any) {
      console.error('Analysis error:', err);
      setAnalysisError(err?.message || 'Failed to analyze room photo. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleToggleTask = (taskId: string) => {
    const updated = completedTaskIds.includes(taskId)
      ? completedTaskIds.filter((id) => id !== taskId)
      : [...completedTaskIds, taskId];

    setCompletedTaskIds(updated);

    if (activeRoomId) {
      const updatedRooms = savedRooms.map((r) =>
        r.id === activeRoomId ? { ...r, completedTaskIds: updated } : r
      );
      persistRooms(updatedRooms);
    }
  };

  const handleSelectRoomFromHistory = (record: SavedRoomRecord) => {
    setActiveAnalysis(record.analysis);
    setActivePhotoUrl(record.photoUrl);
    setActiveRoomId(record.id);
    setCompletedTaskIds(record.completedTaskIds || []);
    setCurrentTab('plan');
  };

  const handleDeleteRoom = (roomId: string) => {
    const filtered = savedRooms.filter((r) => r.id !== roomId);
    persistRooms(filtered);
    if (activeRoomId === roomId) {
      if (filtered.length > 0) {
        setActiveAnalysis(filtered[0].analysis);
        setActivePhotoUrl(filtered[0].photoUrl);
        setActiveRoomId(filtered[0].id);
        setCompletedTaskIds(filtered[0].completedTaskIds || []);
      } else {
        setActiveAnalysis(null);
        setActivePhotoUrl(null);
        setActiveRoomId(null);
        setCompletedTaskIds([]);
        setCurrentTab('upload');
      }
    }
  };

  const handleNewRoom = () => {
    setCurrentTab('upload');
    setAnalysisError(null);
  };

  const handleStartTimer = (taskTitle: string, durationMinutes: number) => {
    setTimerModal({
      isOpen: true,
      taskTitle,
      initialMinutes: durationMinutes,
    });
  };

  return (
    <div className="min-h-screen bg-stone-100/60 text-stone-900 font-sans flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
      {/* Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        hasActiveRoom={!!activeAnalysis}
        savedRoomsCount={savedRooms.length}
        onOpenTimer={() =>
          setTimerModal({
            isOpen: true,
            taskTitle: '5-Minute Declutter Sprint',
            initialMinutes: 5,
          })
        }
        onNewRoom={handleNewRoom}
      />

      {/* Main Content View */}
      <main className="flex-1 pb-16">
        {currentTab === 'upload' && (
          <PhotoUploader
            onAnalyze={handleAnalyze}
            isAnalyzing={isAnalyzing}
            analysisError={analysisError}
          />
        )}

        {currentTab === 'plan' && activeAnalysis && activePhotoUrl && (
          <AnalysisResults
            analysis={activeAnalysis}
            photoUrl={activePhotoUrl}
            completedTaskIds={completedTaskIds}
            onToggleTask={handleToggleTask}
            onOpenCoachChat={() => setCurrentTab('chat')}
            onStartTimerForTask={handleStartTimer}
          />
        )}

        {currentTab === 'chat' && (
          <DeclutterChat
            roomContext={activeAnalysis}
            roomPhotoUrl={activePhotoUrl}
          />
        )}

        {currentTab === 'history' && (
          <RoomHistory
            savedRooms={savedRooms}
            onSelectRoom={handleSelectRoomFromHistory}
            onDeleteRoom={handleDeleteRoom}
            onStartNewRoom={handleNewRoom}
          />
        )}
      </main>

      {/* Sprint Timer Modal */}
      <TimerModal
        isOpen={timerModal.isOpen}
        onClose={() => setTimerModal((prev) => ({ ...prev, isOpen: false }))}
        taskTitle={timerModal.taskTitle}
        initialMinutes={timerModal.initialMinutes}
      />
    </div>
  );
}
