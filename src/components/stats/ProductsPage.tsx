import { authStore } from '@/stores/auth.store';

const BackIcon = () => (
  <svg class="line" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none">
    <path d="M16.8701 18.3101H8.87012C6.11012 18.3101 3.87012 16.0701 3.87012 13.3101C3.87012 10.5501 6.11012 8.31006 8.87012 8.31006H19.8701" stroke-miterlimit="10" />
    <path d="M17.5701 10.8099L20.1301 8.24994L17.5701 5.68994" />
  </svg>
);

export function ProductsPage() {
  return (
    <div style="text-align:center;padding:30px 10px;">
      <div style="font-size:2rem;margin-bottom:10px;">📦</div>
      <h2 style="font-size:1.1rem;font-weight:700;color:var(--headC);margin:0 0 6px;">قيد الإنشاء ،،،</h2>
      <p style="font-size:.8rem;color:var(--bodyCa);line-height:1.6;">نعمل حاليًا على تطوير قائمة المنتجات. ستجد هنا قريبًا أدوات وموارد مفيدة.</p>
      <div class="sheetFooter">
        <button onClick={() => authStore.openSheet('dashboard')} class="backBtn"><BackIcon /> الرجوع للوحة</button>
      </div>
    </div>
  );
}
