export type RoomType =
  | 'Home Office'
  | 'Living Room'
  | 'Bedroom'
  | 'Kitchen'
  | 'Closet & Wardrobe'
  | 'Bathroom'
  | 'Garage & Storage'
  | 'Dining Room'
  | 'Entryway / Hallway'
  | 'Kids Room';

export type DeclutterGoal =
  | 'General Decluttering & Space Revival'
  | 'Deep 4-Box Purge (Keep/Donate/Trash)'
  | 'Maximize Storage & Floor Space'
  | 'Desk & Cable Management'
  | 'Wardrobe & Closet Streamlining'
  | 'Quick 15-Minute Emergency Tidy';

export interface QuickWin {
  task: string;
  duration: string;
  impact: string;
}

export interface ZoneAnalysis {
  zoneName: string;
  currentObservation: string;
  recommendation: string;
  suggestedProducts: string[];
}

export interface ActionPlanItem {
  id: string;
  title: string;
  category: 'declutter' | 'organize' | 'donate' | 'trash' | 'store';
  timeEstimate: string;
  boxMethodCategory: 'Keep' | 'Donate / Sell' | 'Relocate' | 'Trash / Recycle' | string;
  description: string;
  proTip?: string;
  completed?: boolean;
}

export interface StorageSolution {
  title: string;
  purpose: string;
  placement: string;
}

export interface MaintenanceHabit {
  habit: string;
  frequency: string;
  description: string;
}

export interface RoomAnalysisData {
  roomType: string;
  clutterScore: number; // 1-10
  clutterLevel: 'Low' | 'Moderate' | 'High' | 'Overwhelming';
  summary: string;
  keyIssues: string[];
  quickWins: QuickWin[];
  zones: ZoneAnalysis[];
  actionPlan: ActionPlanItem[];
  storageSolutions: StorageSolution[];
  maintenanceHabits: MaintenanceHabit[];
}

export interface SavedRoomRecord {
  id: string;
  createdAt: string;
  roomType: string;
  goal: string;
  photoUrl: string;
  analysis: RoomAnalysisData;
  completedTaskIds: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface SampleRoom {
  id: string;
  name: string;
  roomType: RoomType;
  goal: DeclutterGoal;
  description: string;
  imageUrl: string;
}
