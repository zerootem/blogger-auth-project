import { authStore } from '@/stores/auth.store';

export function ProductsPage() {
  return (
    <div style="display:flex; flex-direction:column; min-height:100%;">
      <div style="flex:1; text-align:center; padding:20px 10px;">
        <div style="font-size:2rem;margin-bottom:10px;">📦</div>
        <h2 style="font-size:1.1rem;font-weight:700;color:var(--headC);margin:0 0 6px;">قيد الإنشاء ،،،</h2>
        <p style="font-size:.8rem;color:var(--bodyCa);line-height:1.6;">نعمل حاليًا على تطوير قائمة المنتجات. ستجد هنا قريبًا أدوات وموارد مفيدة.</p>
      </div>
      <div class="sheet-footer">
        <button onClick={() => authStore.openSheet('dashboard')} class="backBtn">الرجوع للوحة</button>
      </div>
    </div>
  );
}
