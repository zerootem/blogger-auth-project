import { authStore } from '@/stores/auth.store';

const BackIcon = () => (
  <svg class="line" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><path d="M9.57 5.92993L3.5 11.9999L9.57 18.0699" stroke-miterlimit="10"/><path d="M20.5 12H3.67004" stroke-miterlimit="10"/></svg>
);

export function ProductsPage() {
  return (
    <div style="text-align:center;padding:30px 10px; display:flex; flex-direction:column; min-height:100%;">
      <div style="font-size:2rem;margin-bottom:10px;">📦</div>
      <h2 style="font-size:1.1rem;font-weight:700;color:var(--headC);margin:0 0 6px;">قيد الإنشاء ،،،</h2>
      <p style="font-size:.8rem;color:var(--bodyCa);line-height:1.6;">نعمل حاليًا على تطوير قائمة المنتجات. ستجد هنا قريبًا أدوات وموارد مفيدة.</p>
      <div class="sheet-footer">
        <button onClick={() => authStore.openSheet('dashboard')} class="backBtn"><BackIcon /> الرجوع للوحة</button>
      </div>
    </div>
  );
}
