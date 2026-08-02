type ToastCallback = (message: string) => void;

let toastCallback: ToastCallback | null = null;
let toastElement: HTMLElement | null = null;

export const toastService = {
  register(callback: ToastCallback): void {
    toastCallback = callback;
  },

  show(message: string): void {
    if (typeof window !== 'undefined') {
      const pu = (window as unknown as Record<string, unknown>).PU;
      if (pu && typeof (pu as Record<string, unknown>).tNtf === 'function') {
        ((pu as Record<string, unknown>).tNtf as (msg: string) => void)(message);
        return;
      }
      if (!toastElement) {
        toastElement = document.getElementById('toastMessage');
      }
      if (toastElement) {
        toastElement.innerText = message;
        toastElement.classList.add('active');
        setTimeout(() => toastElement?.classList.remove('active'), 1500);
        return;
      }
    }
    if (toastCallback) {
      toastCallback(message);
    } else {
      console.log('[Toast]', message);
    }
  },
};
