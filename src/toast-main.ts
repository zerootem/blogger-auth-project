import { createApp, h, defineComponent } from 'vue';
import { Toaster, toast } from 'vue-sonner';
import 'vue-sonner/style.css';
import '@/styles/toast-custom.css';

const CustomToast = defineComponent({
  props: {
    message: { type: String, default: '' },
    onReload: { type: Function, default: () => {} },
    onClose: { type: Function, default: () => {} },
  },
  setup(props) {
    return () => h('div', { class: 'pwa-toast-wrapper', role: 'alert' }, [
      h('div', { class: 'pwa-toast-message' }, [
        h('div', { class: 'pwa-toast-desc' }, props.message),
      ]),
      h('div', { class: 'pwa-toast-buttons' }, [
        h('button', {
          class: 'pwa-toast-refresh',
          type: 'button',
          onClick: (e) => {
            e.stopPropagation(); // منع إغلاق التنبيه
            props.onReload();
          },
        }, 'تحديث'),
        h('button', {
          class: 'pwa-toast-close',
          type: 'button',
          onClick: (e) => {
            e.stopPropagation(); // منع إغلاق التنبيه
            props.onClose();
          },
        }, 'إغلاق'),
      ]),
    ]);
  },
});

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

function showUpdateToast() {
  toast.custom((t) => h(CustomToast, {
    message: 'يوجد نسخة جديدة من الصفحة. اضغط تحديث لإعادة التحميل.',
    onReload: () => location.reload(),
    onClose: () => toast.dismiss(t.id),
  }), {
    duration: 30000, // 30 ثانية
    position: 'bottom-left',
  });
}

function showActionToast(message: string, actionLabel: string, actionOnClick: () => void) {
  toast(message, {
    action: { label: actionLabel, onClick: actionOnClick },
    position: 'bottom-left',
  });
}

(window as any).toast = toast;
(window as any).showUpdateToast = showUpdateToast;
(window as any).showActionToast = showActionToast;

// منطق الخمول: يظهر التنبيه بعد 30 ثانية من عدم النشاط
let lastActivity = Date.now();
let idleToastShown = false;
const IDLE_DELAY = 30000; // 30 ثانية

function resetActivity() {
  lastActivity = Date.now();
  if (idleToastShown) {
    toast.dismiss();
    idleToastShown = false;
  }
}

['pointerdown', 'keydown', 'scroll', 'touchstart', 'mousemove'].forEach(evt => {
  window.addEventListener(evt, resetActivity, { passive: true });
});

setInterval(() => {
  if (!idleToastShown && Date.now() - lastActivity >= IDLE_DELAY) {
    idleToastShown = true;
    showUpdateToast();
  }
}, 1000);
