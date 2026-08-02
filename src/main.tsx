import { render } from 'solid-js/web';
import { App } from './App';
import { authStore } from '@/stores/auth.store';
import { googleAuthService } from '@/services/google-auth.service';
import { toastService } from '@/services/toast.service';
import { communityService } from '@/services/community.service';
import '@/styles/auth.css';

// تعريف الدوال العامة للقالب
(window as any).openAccountSheet = () => authStore.openSheet('dashboard');
(window as any).closeAccountSheet = () => authStore.closeSheet();
(window as any).openCommunityMembers = () => authStore.openSheet('members');
(window as any).openStatsPage = () => authStore.openSheet('stats');
(window as any).openAdminPanel = () => authStore.openSheet('admin');
(window as any).handleLogout = () => {
  authStore.logout();
  toastService.show('تم تسجيل الخروج بنجاح!');
};

function initApp() {
  const root = document.getElementById('modpro-auth-root');
  if (root) {
    render(() => <App />, root);
  }

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
  if (e.key === 'userLoggedIn' || e.key === 'userName' || e.key === 'userPicture') {
    window.location.reload();
  }
});
