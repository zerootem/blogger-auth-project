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
    if (authStore.isSheetOpen()) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });

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
            <Match when={authStore.sheetView() === 'stats'}>
              <StatsPage />
            </Match>
            <Match when={authStore.sheetView() === 'products'}>
              <ProductsPage />
            </Match>
          </Switch>
        </div>
        <div class="lgnFooter">
          <Switch>
            <Match when={authStore.isLoggedIn() && authStore.sheetView() === 'dashboard'}>
              <button class="backBtn" onClick={() => authStore.logout()}>تسجيل الخروج</button>
            </Match>
            <Match when={authStore.isLoggedIn() && authStore.sheetView() === 'members'}>
              <button class="backBtn" onClick={() => authStore.openSheet('dashboard')}>الرجوع للوحة</button>
            </Match>
            <Match when={authStore.isLoggedIn() && authStore.sheetView() === 'profile'}>
              <button class="backBtn" onClick={() => authStore.openSheet('members')}>الرجوع للأعضاء</button>
            </Match>
            <Match when={authStore.isLoggedIn() && authStore.sheetView() === 'stats'}>
              <button class="backBtn" onClick={() => authStore.openSheet('dashboard')}>الرجوع للوحة</button>
            </Match>
            <Match when={authStore.isLoggedIn() && authStore.sheetView() === 'products'}>
              <button class="backBtn" onClick={() => authStore.openSheet('dashboard')}>الرجوع للوحة</button>
            </Match>
          </Switch>
        </div>
      </div>
    </div>
  );
}
