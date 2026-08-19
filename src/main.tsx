import { render } from 'solid-js/web';
import { App } from './App';
import { authStore } from '@/stores/auth.store';
import { supabaseService } from '@/services/supabase.service';
import { toastService } from '@/services/toast.service';
import { communityService } from '@/services/community.service';
import '@/styles/auth.css';

// تعريف الدوال العامة للقالب
(window as any).openAccountSheet = () => authStore.openSheet('dashboard');
(window as any).closeAccountSheet = () => authStore.closeSheet();
(window as any).openCommunityMembers = () => authStore.openSheet('members');
(window as any).openStatsPage = () => authStore.openSheet('stats');
(window as any).openProductsPage = () => authStore.openSheet('products');
(window as any).handleLogout = async () => {
  await supabaseService.signOut();
  authStore.logout();
  toastService.show('تم تسجيل الخروج بنجاح!');
};
(window as any).handleLogin = async () => {
  try {
    await supabaseService.signInWithGoogle();
  } catch (e) {
    console.error(e);
    toastService.show('فشل تسجيل الدخول');
  }
};

async function initApp() {
  const root = document.getElementById('modpro-auth-root');
  if (root) {
    render(() => <App />, root);
  }

  // فحص الجلسة الحالية
  const user = await supabaseService.getCurrentUser();
  if (user && user.email) {
    authStore.setLoggedIn(user.user_metadata?.full_name || user.email, user.email, user.user_metadata?.avatar_url || '');
    // تحميل بيانات الملف الشخصي من Supabase
    const profile = await supabaseService.getProfile(user.email);
    if (profile) {
      authStore.setUserBio(profile.bio || '');
      authStore.setJoinDate(profile.session_start || new Date().toISOString());
    } else {
      await supabaseService.upsertProfile({
        email: user.email,
        name: user.user_metadata?.full_name || user.email,
        picture: user.user_metadata?.avatar_url || '',
        bio: '',
      });
    }
    communityService.addCurrentUserToCommunity();
  } else {
    authStore.setLoggedIn('', '', '');
  }

  // الاستماع لتغيرات المصادقة
  supabaseService.onAuthStateChange(async (user) => {
    if (user && user.email) {
      authStore.setLoggedIn(user.user_metadata?.full_name || user.email, user.email, user.user_metadata?.avatar_url || '');
      const profile = await supabaseService.getProfile(user.email);
      if (profile) {
        authStore.setUserBio(profile.bio || '');
      }
      communityService.addCurrentUserToCommunity();
      toastService.show(`أهلاً بك، ${user.user_metadata?.full_name || user.email}!`);
    } else {
      authStore.logout();
    }
    if (typeof (window as any).updateAccountUI === 'function') {
      (window as any).updateAccountUI();
    }
  });

  if (typeof (window as any).updateAccountUI === 'function') {
    (window as any).updateAccountUI();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
