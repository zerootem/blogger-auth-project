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
const [sessions, setSessions] = createSignal<UserSession[]>(storageService.getSessions());
const [sheetView, setSheetView] = createSignal<SheetView>('dashboard');
const [isSheetOpen, setIsSheetOpen] = createSignal(false);

const isAdmin = createMemo(() => userEmail() === CONFIG.adminEmail);
const userInitial = createMemo(() => {
  const name = userName();
  return name ? name[0].toUpperCase() : '';
});

async function login(name: string, email: string, picture: string) {
  const now = new Date().toISOString();
  storageService.setUserData({ name, email, picture, joinDate: now });
  setIsLoggedIn(true);
  setUserName(name);
  setUserEmail(email);
  setUserPicture(picture);
  setJoinDate(now);

  // محاولة تحميل البيانات من Supabase
  const profile = await supabaseService.getProfile(email);
  if (profile) {
    setUserBio(profile.bio || '');
    storageService.setUserBio(profile.bio || '');
  } else {
    await supabaseService.upsertProfile({ email, name, picture });
  }

  await supabaseService.incrementLoginCount(email);
  await supabaseService.addLoginToHistory(email);
  await supabaseService.setSessionStart(email);

  if (typeof (window as any).updateAccountUI === 'function') {
    (window as any).updateAccountUI();
  }
}

async function logout() {
  storageService.clearAll();
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

  if (userEmail()) {
    await supabaseService.updateProfile(userEmail(), { name, picture, bio });
  }

  if (typeof (window as any).updateAccountUI === 'function') {
    (window as any).updateAccountUI();
  }
}

function refreshSessions() {
  setSessions(storageService.getSessions());
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
