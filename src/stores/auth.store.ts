import { createSignal, createMemo } from 'solid-js';
import type { UserSession, SheetView } from '@/types';
import { storageService } from '@/services/storage.service';
import { CONFIG } from '@/config';

const [isLoggedIn, setIsLoggedIn] = createSignal(storageService.isLoggedIn());
const [userName, setUserName] = createSignal(storageService.getUserName());
const [userEmail, setUserEmail] = createSignal(storageService.getUserEmail());
const [userPicture, setUserPicture] = createSignal(storageService.getUserPicture());
const [joinDate, setJoinDate] = createSignal(storageService.getUserJoinDate());
const [sessions, setSessions] = createSignal<UserSession[]>(storageService.getSessions());
const [sheetView, setSheetView] = createSignal<SheetView>('dashboard');
const [isSheetOpen, setIsSheetOpen] = createSignal(false);

const isAdmin = createMemo(() => userEmail() === CONFIG.adminEmail);
const userInitial = createMemo(() => {
  const name = userName();
  return name ? name[0].toUpperCase() : '';
});

function login(name: string, email: string, picture: string) {
  const now = new Date().toISOString();
  storageService.setUserData({ name, email, picture, joinDate: now });
  storageService.incrementLoginCount();
  storageService.setSessionStartTime();
  setIsLoggedIn(true);
  setUserName(name);
  setUserEmail(email);
  setUserPicture(picture);
  setJoinDate(now);

  if (typeof (window as any).updateAccountUI === 'function') {
    (window as any).updateAccountUI();
  }
}

function logout() {
  storageService.clearAll();
  setIsLoggedIn(false);
  setUserName('');
  setUserEmail('');
  setUserPicture('');
  setJoinDate('');
  setSessions([]);
  setSheetView('dashboard');
  setIsSheetOpen(false);

  if (typeof (window as any).updateAccountUI === 'function') {
    (window as any).updateAccountUI();
  }
}

function updateProfile(name: string, picture: string) {
  storageService.updateProfile(name, picture);
  setUserName(name);
  setUserPicture(picture);

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
