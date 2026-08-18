export interface UserSession {
  id: number;
  time: string;
  os: string;
  ip: string;
  isCurrent: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  picture: string;
  joinDate: string;
  isLoggedIn: boolean;
  bio: string;
  sessions: UserSession[];
}

export interface CommunityMember {
  name: string;
  email: string;
  picture: string;
  joinDate: string;
  lastSeen: string;
  online: boolean;
  bio: string;
}

export interface ChatMessage {
  senderName: string;
  senderEmail: string;
  text: string;
  time: string;
}

export type SheetView =
  | 'dashboard'
  | 'members'
  | 'profile'
  | 'stats'
  | 'products'
  | 'admin';

export type LoginMethod = 'google' | 'guest';
