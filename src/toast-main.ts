import { createApp, h, defineComponent } from 'vue';
import { Toaster, toast } from 'vue-sonner';
import 'vue-sonner/style.css';
import '@/styles/toast-custom.css';

// مكون Vue مخصص للتنبيه بزرين (تحديث/إغلاق)
const CustomToast = defineComponent({
  props: {
    title: { type: String, default: 'تنبيه' },
    message: { type: String, default: '' },
    onReload: { type: Function, default: () => {} },
    onClose: { type: Function, default: () => {} },
  },
  setup(props) {
    return () => h('div', {
      class: 'pwa-toast-wrapper',
      role: 'alert',
      'aria-labelledby': 'toast-message',
    }, [
      h('div', { class: 'pwa-toast-message' }, [
        h('div', { class: 'pwa-toast-title' }, props.title),
        h('div', { class: 'pwa-toast-desc' }, props.message),
      ]),
      h('div', { class: 'pwa-toast-buttons' }, [
        h('button', {
          class: 'pwa-toast-refresh',
          type: 'button',
          onClick: props.onReload,
        }, 'تحديث'),
        h('button', {
          class: 'pwa-toast-close',
          type: 'button',
          onClick: props.onClose,
        }, 'إغلاق'),
      ]),
    ]);
  },
});

// إنشاء حاوية Vue
let container = document.getElementById('vue-toast-root');
if (!container) {
  container = document.createElement('div');
  container.id = 'vue-toast-root';
  document.body.appendChild(container);
}

const app = createApp({
  render() {
    return h(Toaster, {
      position: 'bottom-left',
      richColors: true,
      closeButton: false,
      expand: true,
      visibleToasts: 5,
      duration: 8000,
    });
  },
});

app.mount(container);

// دالة مخصصة لعرض تنبيه التحديث
function showUpdateToast() {
  toast.custom((t) => h(CustomToast, {
    title: 'تحديث متوفر',
    message: 'يوجد نسخة جديدة من الصفحة. اضغط تحديث لإعادة التحميل.',
    onReload: () => {
      location.reload();
    },
    onClose: () => {
      toast.dismiss(t.id);
    },
  }), {
    duration: Infinity,
    position: 'bottom-left',
  });
}

// دالة عامة تستخدم action
function showActionToast(message: string, actionLabel: string, actionOnClick: () => void) {
  toast(message, {
    action: {
      label: actionLabel,
      onClick: actionOnClick,
    },
    position: 'bottom-left',
  });
}

// تعريض الدوال
(window as any).toast = toast;
(window as any).showUpdateToast = showUpdateToast;
(window as any).showActionToast = showActionToast;

// ===== منطق الخمول التلقائي =====
let lastActivity = Date.now();
let idleToastShown = false;
const IDLE_DELAY = 20000; // 20 ثانية

function resetActivity() {
  lastActivity = Date.now();
  // إذا عاد النشاط وكان التنبيه معروضًا، نغلقه
  if (idleToastShown) {
    toast.dismiss();
    idleToastShown = false;
  }
}

// أحداث النشاط
['pointerdown', 'keydown', 'scroll', 'touchstart', 'mousemove'].forEach(evt => {
  window.addEventListener(evt, resetActivity, { passive: true });
});

// فحص الخمول كل ثانية
setInterval(() => {
  if (!idleToastShown && Date.now() - lastActivity >= IDLE_DELAY) {
    idleToastShown = true;
    showUpdateToast();
  }
}, 1000);
