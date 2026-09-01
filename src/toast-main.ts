import { createApp, h, defineComponent } from 'vue';
import { Toaster, toast } from 'vue-sonner';
import 'vue-sonner/style.css';
import '@/styles/toast-custom.css';

const CloseIcon = () => h('svg', {
  class: 'line',
  viewBox: '0 0 24 24',
  width: '14',
  height: '14',
  stroke: 'currentColor',
  'stroke-width': '2',
  fill: 'none',
}, [
  h('path', { d: 'M18 6L6 18M6 6l12 12' })
]);

const CustomToast = defineComponent({
  props: {
    title: { type: String, default: 'تحديث متوفر' },
    message: { type: String, default: '' },
    onReload: { type: Function, default: () => {} },
    onClose: { type: Function, default: () => {} },
  },
  setup(props) {
    return () => h('div', { class: 'pwa-toast-wrapper', role: 'alert' }, [
      h('div', { class: 'pwa-toast-message' }, [
        h('div', { class: 'pwa-toast-title' }, props.title),
        h('div', { class: 'pwa-toast-desc' }, props.message),
      ]),
      h('div', { class: 'pwa-toast-buttons' }, [
        h('button', {
          class: 'pwa-toast-refresh',
          type: 'button',
          onClick: (e) => { e.stopPropagation(); e.preventDefault(); props.onReload(); },
        }, 'تحديث'),
        h('button', {
          class: 'pwa-toast-close',
          type: 'button',
          'aria-label': 'إغلاق',
          onClick: (e) => { e.stopPropagation(); e.preventDefault(); props.onClose(); },
        }, [CloseIcon()]),
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
    title: 'تحديث متوفر',
    message: 'يوجد تحديث جديد، اضغط تحديث لإعادة تحميل الصفحة.',
    onReload: () => location.reload(),
    onClose: () => toast.dismiss(t.id),
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

// منطق الخمول: يظهر التنبيه بعد 30 ثانية من عدم النشاط
let lastActivity = Date.now();
let idleToastShown = false;
const IDLE_DELAY = 30000;

function resetActivity(e?: Event) {
  const target = e?.target;
  if (target && target instanceof Element && typeof (target as Element).closest === 'function') {
    if ((target as Element).closest('.pwa-toast-refresh, .pwa-toast-close')) return;
  }
  lastActivity = Date.now();
  if (idleToastShown) {
    toast.dismiss();
    idleToastShown = false;
  }
}

['pointerdown', 'keydown', 'scroll', 'touchstart'].forEach(evt =>
  window.addEventListener(evt, resetActivity, { passive: true })
);
window.addEventListener('mousemove', () => {
  lastActivity = Date.now();
}, { passive: true });

setInterval(() => {
  if (!idleToastShown && Date.now() - lastActivity >= IDLE_DELAY) {
    idleToastShown = true;
    showUpdateToast();
  }
}, 1000);

// ===== كشف التحديثات عبر MutationObserver =====
let lastChangeTime = Date.now();
let updateToastShown = false;

const observer = new MutationObserver((mutations) => {
  const significant = mutations.some(m => {
    const added = m.addedNodes.length;
    const removed = m.removedNodes.length;
    // نتجاهل التغييرات الصغيرة جداً
    return added > 0 || removed > 0;
  });

  if (significant) {
    const now = Date.now();
    // إذا حدث تغيير بعد تحميل الصفحة بأكثر من 10 ثوان
    if (now - lastChangeTime > 10000 && !updateToastShown) {
      updateToastShown = true;
      showUpdateToast();
    } else {
      lastChangeTime = now;
    }
  }
});

// مراقبة الجسم بالكامل
observer.observe(document.body, {
  childList: true,
  subtree: true,
});
