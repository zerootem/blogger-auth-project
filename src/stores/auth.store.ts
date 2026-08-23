import { createSignal, createMemo } from 'solid-js';
import type { UserSession, SheetView } from '@/types';
import { storageService } from '@/services/storage.service';
import { supabaseService } from '@/services/supabase.service';
import { CONFIG } from '@/config';

const [isLoggedIn, setIsLoggedIn] = createSignal(storageService.isLoggedIn());
const [userName, setUserName] = createSignal(storageService.getUserName());
const [userEmail, setUserEmail] = createSignal(storageService.getUserEmail());
const [userPicture, setUserPicture] = createSignal(storageService.getUserPicture());
const [joinDate, setJoinDate] = createSignal(storageService.getUserJoinDate());
const [userBio, setUserBio] = createSignal(storageService.getUserBio());
const [sessions, setSessions] = createSignal<UserSession[]>([]);
const [sheetView, setSheetView] = createSignal<SheetView>('dashboard');
const [isSheetOpen, setIsSheetOpen] = createSignal(false);

const isAdmin = createMemo(() => userEmail() === CONFIG.adminEmail);
const userInitial = createMemo(() => {
  const name = userName();
  return name ? name[0].toUpperCase() : '';
});

function getOrCreateSessionId(): string {
  let id = localStorage.getItem('sessionId');
  if (!id) {
    id = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();
    localStorage.setItem('sessionId', id);
  }
  return id;
}

function getOS(): string {
  const ua = navigator.userAgent;
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('iPhone')) return 'iOS';
  if (ua.includes('Windows')) return 'Windows';
  if (ua.includes('Mac')) return 'MacOS';
  if (ua.includes('Linux')) return 'Linux';
  if (ua.includes('CrOS')) return 'ChromeOS';
  return 'غير معروف';
}

async function login(name: string, email: string, picture: string) {
  const now = new Date().toISOString();
  storageService.setUserData({ name, email, picture, joinDate: now });
  setIsLoggedIn(true);
  setUserName(name);
  setUserEmail(email);
  setUserPicture(picture);
  setJoinDate(now);

  // إنشاء جلسة جديدة
  const sessionId = getOrCreateSessionId();
  try {
    let ip = 'غير معروف';
    try {
      const res = await fetch('https://api.ipify.org?format=json');
      const data = await res.json();
      ip = data.ip || 'غير معروف';
    } catch {}

    await supabaseService.createSession({
      user_email: email,
      session_id: sessionId,
      time: new Date().toLocaleString('en-US', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      os: getOS(),
      ip,
      is_current: true,
    });
  } catch (e) {
    console.warn('تعذر حفظ الجلسة في Supabase', e);
  }

  try {
    const profile = await supabaseService.getProfile(email);
    if (profile) {
      setUserBio(profile.bio || '');
      storageService.setUserBio(profile.bio || '');
    } else {
      await supabaseService.upsertProfile({ email, name, picture, bio: '' });
    }
    await supabaseService.incrementLoginCount(email);
    await supabaseService.addLoginToHistory(email);
    await supabaseService.setSessionStart(email);
  } catch (e) {
    console.warn('Supabase profile sync skipped:', e);
  }

  if (typeof (window as any).updateAccountUI === 'function') {
    (window as any).updateAccountUI();
  }
}

async function logout() {
  try {
    const sessionId = localStorage.getItem('sessionId');
    if (sessionId) {
      await supabaseService.deleteSession(sessionId);
    }
  } catch (e) {}

  storageService.clearAll();
  localStorage.removeItem('sessionId');
  setIsLoggedIn(false);
  setUserName('');
  setUserEmail('');
  setUserPicture('');
  setUserBio('');
  setJoinDate('');
  setSessions([]);
  setSheetView('dashboard');
  setIsSheetOpen(false);

  if (typeof (window as any).updateAccountUI === 'function') {
    (window as any).updateAccountUI();
  }
}

async function updateProfile(name: string, picture: string, bio: string) {
  storageService.updateProfile(name, picture, bio);
  setUserName(name);
  setUserPicture(picture);
  setUserBio(bio);

  try {
    if (userEmail()) {
      await supabaseService.updateProfile(userEmail(), { name, picture, bio });
    }
  } catch (e) {
    console.warn('Supabase profile update skipped:', e);
  }

  if (typeof (window as any).updateAccountUI === 'function') {
    (window as any).updateAccountUI();
  }
}

async function refreshSessions() {
  const email = userEmail();
  if (!email) return;
  try {
    const serverSessions = await supabaseService.getSessions(email);
    const currentSessionId = localStorage.getItem('sessionId');
    const mapped = serverSessions.map((s, index) => ({
      id: index,
      time: s.time || '',
      os: s.os || 'غير معروف',
      ip: s.ip || 'غير معروف',
      isCurrent: s.session_id === currentSessionId,
    }));
    setSessions(mapped);
  } catch (e) {
    console.warn('تعذر جلب الجلسات من Supabase', e);
  }
}

function openSheet(view: SheetView = 'dashboard') {
  setSheetView(view);
  setIsSheetOpen(true);
}

function closeSheet() {
  setIsSheetOpen(false);
}

export const authStore = {
  isLoggedIn,
  userName,
  userEmail,
  userPicture,
  userBio,
  joinDate,
  sessions,
  sheetView,
  isSheetOpen,
  isAdmin,
  userInitial,
  login,
  logout,
  updateProfile,
  refreshSessions,
  openSheet,
  closeSheet,
  setSheetView,
};
