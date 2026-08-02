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
  LOGIN_COUNT: 'loginCount',
  LOGIN_HISTORY: 'loginHistory',
  SESSION_START: 'sessionStart',
  LAST_VISITED_ARTICLE: 'lastVisitedArticle',
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
  saveSessions(sessions: UserSession[]): void {
    safeSet(STORAGE_KEYS.USER_SESSIONS, sessions);
  },
  addSession(session: UserSession): void {
    const sessions = this.getSessions();
    sessions.push(session);
    this.saveSessions(sessions);
  },
  removeSession(index: number): void {
    const sessions = this.getSessions();
    sessions.splice(index, 1);
    this.saveSessions(sessions);
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

  // ---- الإحصائيات ----
  getLoginCount(): number {
    return parseInt(localStorage.getItem(STORAGE_KEYS.LOGIN_COUNT) || '0', 10);
  },
  incrementLoginCount(): void {
    const count = this.getLoginCount() + 1;
    localStorage.setItem(STORAGE_KEYS.LOGIN_COUNT, count.toString());
    this.addLoginToHistory();
  },
  getLoginHistory(): Record<string, number> {
    return safeGet<Record<string, number>>(STORAGE_KEYS.LOGIN_HISTORY, {});
  },
  addLoginToHistory(): void {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const history = this.getLoginHistory();
    history[today] = (history[today] || 0) + 1;
    // نحتفظ بآخر 7 أيام فقط
    const keys = Object.keys(history).sort().slice(-7);
    const trimmed: Record<string, number> = {};
    keys.forEach(k => trimmed[k] = history[k]);
    safeSet(STORAGE_KEYS.LOGIN_HISTORY, trimmed);
  },
  getSessionStartTime(): string | null {
    return localStorage.getItem(STORAGE_KEYS.SESSION_START);
  },
  setSessionStartTime(): void {
    localStorage.setItem(STORAGE_KEYS.SESSION_START, new Date().toISOString());
  },
  getLastVisitedArticle(): { title: string; url: string } | null {
    const raw = localStorage.getItem(STORAGE_KEYS.LAST_VISITED_ARTICLE);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },
  setLastVisitedArticle(title: string, url: string): void {
    safeSet(STORAGE_KEYS.LAST_VISITED_ARTICLE, { title, url });
  },

  clearAll(): void {
    localStorage.clear();
  },
};
