import { render } from 'solid-js/web';
import { App } from './App';
import { authStore } from '@/stores/auth.store';
import { googleAuthService } from '@/services/google-auth.service';
import { toastService } from '@/services/toast.service';
import { communityService } from '@/services/community.service';
import { AccountIcon } from '@/components/ui/AccountIcon';
import { DropdownMenu } from '@/components/ui/DropdownMenu';

/**
 * تهيئة التطبيق داخل Blogger
 * يقوم بحقن المكونات في عناصر HTML الموجودة مسبقاً
 */
function initApp() {
  // العثور على العنصر الجذر للتطبيق
  const root = document.getElementById('modpro-auth-root');
  if (root) {
    render(() => <App />, root);
  }

  // تحديث أيقونة الحساب والقائمة المنسدلة إذا كانت موجودة في القالب
  const accountIconContainer = document.querySelector('.tAcnt');
  if (accountIconContainer) {
    const parent = accountIconContainer.parentElement;
    if (parent) {
      // استبدال الأيقونة القديمة
      accountIconContainer.innerHTML = '';
      render(() => <AccountIcon />, accountIconContainer);
    }
  }

  const dropdownContainer = document.querySelector('.acntW');
  if (dropdownContainer) {
    dropdownContainer.innerHTML = '';
    render(() => <DropdownMenu />, dropdownContainer);
  }

  // تهيئة One Tap إذا كان المستخدم غير مسجل
  if (!authStore.isLoggedIn()) {
    googleAuthService.initOneTap((googleUser) => {
      authStore.login(googleUser.name, googleUser.email, googleUser.picture);
      communityService.addCurrentUserToCommunity();
      toastService.show(`أهلاً بك، ${googleUser.name}!`);
    });
  }

  // إضافة المستخدم الحالي إلى المجتمع إذا كان مسجلاً
  if (authStore.isLoggedIn()) {
    communityService.addCurrentUserToCommunity();
  }
}

// بدء التطبيق عند تحميل الصفحة
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// الاستماع لتغييرات localStorage من علامات تبويب أخرى
window.addEventListener('storage', (e) => {
  if (
    e.key === 'userLoggedIn' ||
    e.key === 'userName' ||
    e.key === 'userPicture'
  ) {
    // إعادة تحميل الصفحة لتحديث الحالة (يمكن تحسينها لاحقاً)
    window.location.reload();
  }
});
