import { createEffect, onCleanup, Match, Switch } from 'solid-js';
import { authStore } from '@/stores/auth.store';
import { LoginPage } from '@/components/account/LoginPage';
import { DashboardPage } from '@/components/account/DashboardPage';
import { MembersPage } from '@/components/community/MembersPage';
import { ProfilePage } from '@/components/community/ProfilePage';
import { ChatPage } from '@/components/chat/ChatPage';
import { AdminPage } from '@/components/admin/AdminPage';

const sheetTitles: Record<string, string> = {
  dashboard: 'إدارة الحساب',
  members: 'أعضاء المجتمع',
  profile: 'الملف الشخصي',
  chat: ' مجتمع مود ويب',
  admin: ' لوحة التحكم',
};

export function App() {
  // إضافة/إزالة overflow:hidden من body عند فتح/إغلاق النافذة
  createEffect(() => {
    if (authStore.isSheetOpen()) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });

  // إزالة التأثير عند تدمير المكون
  onCleanup(() => {
    document.body.style.overflow = '';
  });

  const handleClose = () => authStore.closeSheet();

  return (
    <div class={`lgnBottomSheet ${authStore.isSheetOpen() ? 'visible' : ''}`}>
      <div class="lgnOverlay" onClick={handleClose} />
      <div class="lgnSheet">
        <div class="lgnHeader">
          <h3 id="sheetTitle">
            {authStore.isLoggedIn()
              ? sheetTitles[authStore.sheetView()] || 'الحساب'
              : 'تسجيل الدخول'}
          </h3>
          <button class="lgnClose" onClick={handleClose} aria-label="إغلاق">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="lgnBody">
          <Switch>
            <Match when={!authStore.isLoggedIn()}>
              <LoginPage />
            </Match>
            <Match when={authStore.sheetView() === 'dashboard'}>
              <DashboardPage />
            </Match>
            <Match when={authStore.sheetView() === 'members'}>
              <MembersPage />
            </Match>
            <Match when={authStore.sheetView() === 'profile'}>
              <ProfilePage />
            </Match>
            <Match when={authStore.sheetView() === 'chat'}>
              <ChatPage />
            </Match>
            <Match when={authStore.sheetView() === 'admin'}>
              <AdminPage />
            </Match>
          </Switch>
        </div>
      </div>
    </div>
  );
}
