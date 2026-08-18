import { createEffect, onCleanup, Match, Switch } from 'solid-js';
import { authStore } from '@/stores/auth.store';
import { LoginPage } from '@/components/account/LoginPage';
import { DashboardPage } from '@/components/account/DashboardPage';
import { MembersPage } from '@/components/community/MembersPage';
import { ProfilePage } from '@/components/community/ProfilePage';
import { StatsPage } from '@/components/stats/StatsPage';
import { ProductsPage } from '@/components/stats/ProductsPage';

const sheetTitles: Record<string, string> = {
  dashboard: 'إدارة الحساب',
  members: 'أعضاء المجتمع',
  profile: 'الملف الشخصي',
  stats: 'مركز الإحصائيات',
  products: 'المنتجات',
};

export function App() {
  createEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    if (authStore.isSheetOpen()) {
      html.style.overflow = 'hidden';
      body.style.overflow = 'hidden';
    } else {
      html.style.overflow = '';
      body.style.overflow = '';
    }
  });

  onCleanup(() => {
    document.documentElement.style.overflow = '';
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
            <Match when={authStore.sheetView() === 'stats'}>
              <StatsPage />
            </Match>
            <Match when={authStore.sheetView() === 'products'}>
              <ProductsPage />
            </Match>
          </Switch>
        </div>
      </div>
    </div>
  );
}
