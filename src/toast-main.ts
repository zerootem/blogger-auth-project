import { createApp, h, defineComponent } from 'vue';
import type { MouseEvent, PointerEvent } from 'vue';
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
          onPointerDown: (e: PointerEvent) => e.stopPropagation(),
          onMouseDown: (e: MouseEvent) => e.stopPropagation(),
          onClick: (e: MouseEvent) => {
            e.stopPropagation();
            props.onReload();
          },
        }, 'تحديث'),
        h('button', {
          class: 'pwa-toast-close',
          type: 'button',
          onPointerDown: (e: PointerEvent) => e.stopPropagation(),
          onMouseDown: (e: MouseEvent) => e.stopPropagation(),
          onClick: (e: MouseEvent) => {
            e.stopPropagation();
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
    onReload: () => {
      location.reload();
    },
    onClose: () => {
      toast.dismiss(t.id);
    },
  }), {
    duration: 30000,
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

// منطق الخمول
let lastActivity = Date.now();
let idleToastShown = false;
const IDLE_DELAY = 30000;

function isInsideToast(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return !!target.closest('.pwa-toast-wrapper');
}

function resetActivity(e: Event) {
  // إذا كان الحدث من داخل التنبيه، لا نعيد ضبط النشاط ولا نغلق التنبيه
  if (isInsideToast(e.target)) return;

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
