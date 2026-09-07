import React, { useState } from 'react';
import { Sparkles, Camera, ClipboardList, MessageSquare, Archive, Timer, PlusCircle, Server } from 'lucide-react';
import { BackendConfigModal } from './BackendConfigModal';

interface NavbarProps {
  currentTab: 'upload' | 'plan' | 'chat' | 'history';
  setCurrentTab: (tab: 'upload' | 'plan' | 'chat' | 'history') => void;
  hasActiveRoom: boolean;
  savedRoomsCount: number;
  onOpenTimer: () => void;
  onNewRoom: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  hasActiveRoom,
  savedRoomsCount,
  onOpenTimer,
  onNewRoom,
}) => {
  const [showConfigModal, setShowConfigModal] = useState(false);
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-stone-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & App Name */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentTab('upload')}>
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-lg text-stone-900 tracking-tight">Room Declutter AI</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  Gemini Vision
                </span>
              </div>
              <p className="text-xs text-stone-500 hidden sm:block">AI-powered spatial organization &amp; decluttering plans</p>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="flex items-center space-x-1 sm:space-x-2">
            <button
              id="nav-tab-upload"
              onClick={() => setCurrentTab('upload')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentTab === 'upload'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>Analyze</span>
            </button>

            {hasActiveRoom && (
              <button
                id="nav-tab-plan"
                onClick={() => setCurrentTab('plan')}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentTab === 'plan'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <ClipboardList className="w-4 h-4" />
                <span>Room Plan</span>
              </button>
            )}

            <button
              id="nav-tab-chat"
              onClick={() => setCurrentTab('chat')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentTab === 'chat'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Coach Chat</span>
              {hasActiveRoom && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Room context attached" />
              )}
            </button>

            <button
              id="nav-tab-history"
              onClick={() => setCurrentTab('history')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentTab === 'history'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Archive className="w-4 h-4" />
              <span>Saved</span>
              {savedRoomsCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-xs bg-stone-200 text-stone-700">
                  {savedRoomsCount}
                </span>
              )}
            </button>
          </nav>

          {/* Right Action Tools */}
          <div className="flex items-center space-x-2">
            <button
              id="btn-declutter-timer"
              onClick={onOpenTimer}
              className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-stone-300 text-stone-700 hover:bg-stone-100 transition-colors"
              title="Quick Declutter Sprint Timer"
            >
              <Timer className="w-3.5 h-3.5 text-emerald-600" />
              <span>Sprint Timer</span>
            </button>

            {hasActiveRoom && (
              <button
                id="btn-nav-new-room"
                onClick={onNewRoom}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-xs"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">New Room</span>
              </button>
            )}

            <button
              id="btn-backend-config"
              onClick={() => setShowConfigModal(true)}
              className="p-2 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors"
              title="Configure API / Backend Service"
            >
              <Server className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <BackendConfigModal
        isOpen={showConfigModal}
        onClose={() => setShowConfigModal(false)}
      />
    </header>
  );
};
