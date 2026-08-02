import type { UserSession, CommunityMember, ChatMessage } from '@/types';

const STORAGE_KEYS = {
  USER_LOGGED_IN: 'userLoggedIn',
  USER_NAME: 'userName',
  USER_EMAIL: 'userEmail',
  USER_PICTURE: 'userPicture',
  USER_JOIN_DATE: 'userJoinDate',
  USER_SESSIONS: 'userSessions',
  COMMUNITY_MEMBERS: 'communityMembers',
  COMMUNITY_MESSAGES: 'communityMessages',
  VIEW_PROFILE_EMAIL: 'viewProfileEmail',
} as const;

function safeGet<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : fallback;
  } catch {
    return fallback;
  }
}

function safeSet(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
  } catch {
    console.warn(`Failed to save ${key} to localStorage`);
  }
}

export const storageService = {
  isLoggedIn(): boolean {
    return localStorage.getItem(STORAGE_KEYS.USER_LOGGED_IN) === 'true';
  },
  getUserName(): string {
    return localStorage.getItem(STORAGE_KEYS.USER_NAME) || '';
  },
  getUserEmail(): string {
    return localStorage.getItem(STORAGE_KEYS.USER_EMAIL) || '';
  },
  getUserPicture(): string {
    return localStorage.getItem(STORAGE_KEYS.USER_PICTURE) || '';
  },
  getUserJoinDate(): string {
    return localStorage.getItem(STORAGE_KEYS.USER_JOIN_DATE) || '';
  },
  setUserData(data: { name: string; email: string; picture: string; joinDate: string }): void {
    safeSet(STORAGE_KEYS.USER_LOGGED_IN, 'true');
    safeSet(STORAGE_KEYS.USER_NAME, data.name);
    safeSet(STORAGE_KEYS.USER_EMAIL, data.email);
    safeSet(STORAGE_KEYS.USER_PICTURE, data.picture);
    safeSet(STORAGE_KEYS.USER_JOIN_DATE, data.joinDate);
  },
  updateProfile(name: string, picture: string): void {
    safeSet(STORAGE_KEYS.USER_NAME, name);
    safeSet(STORAGE_KEYS.USER_PICTURE, picture);
  },
  getSessions(): UserSession[] {
    return safeGet<UserSession[]>(STORAGE_KEYS.USER_SESSIONS, []);
  },
  addSession(session: UserSession): void {
    const sessions = this.getSessions();
    sessions.push(session);
    safeSet(STORAGE_KEYS.USER_SESSIONS, sessions);
  },
  removeSession(index: number): void {
    const sessions = this.getSessions();
    sessions.splice(index, 1);
    safeSet(STORAGE_KEYS.USER_SESSIONS, sessions);
  },
  getCommunityMembers(): CommunityMember[] {
    return safeGet<CommunityMember[]>(STORAGE_KEYS.COMMUNITY_MEMBERS, []);
  },
  saveCommunityMembers(members: CommunityMember[]): void {
    safeSet(STORAGE_KEYS.COMMUNITY_MEMBERS, members);
  },
  getMessages(): ChatMessage[] {
    return safeGet<ChatMessage[]>(STORAGE_KEYS.COMMUNITY_MESSAGES, []);
  },
  saveMessages(messages: ChatMessage[]): void {
    safeSet(STORAGE_KEYS.COMMUNITY_MESSAGES, messages);
  },
  getViewProfileEmail(): string {
    return localStorage.getItem(STORAGE_KEYS.VIEW_PROFILE_EMAIL) || '';
  },
  setViewProfileEmail(email: string): void {
    safeSet(STORAGE_KEYS.VIEW_PROFILE_EMAIL, email);
  },
  clearAll(): void {
    localStorage.clear();
  },
};
