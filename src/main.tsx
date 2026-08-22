import { render } from 'solid-js/web';
import { App } from './App';
import { authStore } from '@/stores/auth.store';
import { googleAuthService } from '@/services/google-auth.service';
import { toastService } from '@/services/toast.service';
import { communityService } from '@/services/community.service';
import { supabaseService } from '@/services/supabase.service';
import { storageService } from '@/services/storage.service';
import '@/styles/auth.css';

// تعريف الدوال العامة للقالب
(window as any).openAccountSheet = () => authStore.openSheet('dashboard');
(window as any).closeAccountSheet = () => authStore.closeSheet();
(window as any).openCommunityMembers = () => authStore.openSheet('members');
(window as any).openStatsPage = () => authStore.openSheet('stats');
(window as any).openProductsPage = () => authStore.openSheet('products');
(window as any).handleLogout = () => {
  authStore.logout();
  toastService.show('تم تسجيل الخروج بنجاح!');
};

// تتبع زيارة المقال
function trackArticleVisit() {
  // نكتشف عنوان المقال من الصفحة
  const titleElement = document.querySelector('h1.post-title, h1.entry-title, h3.post-title a');
  const title = titleElement?.textContent?.trim() || document.title.split('|')[0].trim();
  const url = window.location.href;

  if (title && window.location.pathname.includes('/p/') || window.location.pathname.includes('.html')) {
    storageService.setLastVisitedArticle(title, url);
    if (authStore.isLoggedIn()) {
      supabaseService.setLastVisitedArticle(authStore.userEmail(), { title, url });
    }
  }
}

function initApp() {
  const root = document.getElementById('modpro-auth-root');
  if (root) {
    render(() => <App />, root);
  }

  trackArticleVisit();

  if (!authStore.isLoggedIn()) {
    googleAuthService.initOneTap((googleUser) => {
      authStore.login(googleUser.name, googleUser.email, googleUser.picture);
      communityService.addCurrentUserToCommunity();
      toastService.show(`أهلاً بك، ${googleUser.name}!`);
    });
  }

  if (authStore.isLoggedIn()) {
    communityService.addCurrentUserToCommunity();
  }

  if (typeof (window as any).updateAccountUI === 'function') {
    (window as any).updateAccountUI();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

window.addEventListener('storage', (e) => {
  if (e.key === 'userLoggedIn' || e.key === 'userName' || e.key === 'userPicture' || e.key === 'userBio') {
    window.location.reload();
  }
});
