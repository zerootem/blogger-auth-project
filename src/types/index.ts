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
  sessions: UserSession[];
}

export interface CommunityMember {
  name: string;
  email: string;
  picture: string;
  joinDate: string;
  lastSeen: string;
  online: boolean;
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
  | 'chat'
  | 'admin';

export type LoginMethod = 'google' | 'guest';
