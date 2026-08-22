import { createSignal } from 'solid-js';
import { storageService } from '@/services/storage.service';
import { CONFIG } from '@/config';
import { toastService } from '@/services/toast.service';

const LoginIcon = () => (
  <svg class="line" viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><path d="M11.68 14.62L14.24 12.06 11.68 9.5"/><path d="M4 12.06h10.17"/><path d="M12 4c4.42 0 8 3 8 8s-3.58 8-8 8"/></svg>
);
const TimerIcon = () => (
  <svg class="line" viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>
);
const ArticleIcon = () => (
  <svg class="line" viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><path d="M4 19.5v-15A2.5 2.5 0 016.5 2H20v20H6.5a2.5 2.5 0 01-2.5-2.5z"/><path d="M8 7h6"/><path d="M8 11h4"/></svg>
);
const ProductIcon = () => (
  <svg class="line" viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><path d="M21 8l-9-5-9 5v8l9 5 9-5V8z"/><path d="M3 8l9 5 9-5"/><path d="M12 13v8"/></svg>
);
const MailIcon = () => (
  <svg class="line" viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 4l-10 8L2 4"/></svg>
);

export function StatsPage() {
  const loginCount = () => storageService.getLoginCount();
  const lastArticle = () => storageService.getLastVisitedArticle();

  const sessionDuration = () => {
    const start = storageService.getSessionStartTime();
    if (!start) return 'غير متاحة';
    const now = new Date();
    const diffMs = now.getTime() - new Date(start).getTime();
    const minutes = Math.floor(diffMs / 60000);
    if (minutes < 1) return 'أقل من دقيقة';
    if (minutes < 60) return `${minutes} د`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours} س ${mins} د`;
  };

  const last7Days = () => {
    const history = storageService.getLoginHistory();
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const label = new Intl.DateTimeFormat('ar-EG', { weekday: 'short' }).format(d);
      days.push({ label, count: history[key] || 0 });
    }
    return days;
  };

  const [message, setMessage] = createSignal('');
  const sendMessage = () => {
    const msg = message().trim();
    if (!msg) { toastService.show('الرجاء كتابة رسالة'); return; }
    const subject = encodeURIComponent('رسالة من مركز الإحصائيات');
    const body = encodeURIComponent(`المستخدم: ${storageService.getUserName()} (${storageService.getUserEmail()})\n\n${msg}`);
    window.location.href = `mailto:${CONFIG.adminEmail}?subject=${subject}&body=${body}`;
    setMessage('');
    toastService.show('تم فتح برنامج البريد لإرسال الرسالة');
  };

  return (
    <div style="padding:4px 0;">
      <div class="statsGrid">
        <div class="statCard"><div class="statIcon"><LoginIcon /></div><div class="statInfo"><div class="statValue">{loginCount()}</div><div class="statLabel">دخول</div></div></div>
        <div class="statCard"><div class="statIcon"><TimerIcon /></div><div class="statInfo"><div class="statValue">{sessionDuration()}</div><div class="statLabel">الجلسة</div></div></div>
        <div class="statCard"><div class="statIcon"><ArticleIcon /></div><div class="statInfo">{lastArticle() ? <a href={lastArticle()!.url} target="_blank" rel="noopener" class="statLink">{lastArticle()!.title}</a> : <div class="statValue" style="font-size:.75rem;color:var(--bodyCa)">لا يوجد</div>}<div class="statLabel">آخر مقال</div></div></div>
        <div class="statCard"><div class="statIcon"><ProductIcon /></div><div class="statInfo"><div class="statValue" style="font-size:.75rem;color:var(--bodyCa)">قيد الإنشاء</div><div class="statLabel">المنتجات</div></div></div>
      </div>

      <div class="chartContainer">
        <div class="chartTitle">نشاط آخر 7 أيام</div>
        <div class="chartBars">{last7Days().map(day => <div class="chartBarItem"><div class="chartBar" style={{ height: Math.max(day.count * 18, 4) + 'px' }} title={`${day.count} مرات`}></div><div class="chartLabel">{day.label}</div></div>)}</div>
      </div>

      <div class="contactForm">
        <div class="chartTitle"><span style="display:inline-flex;align-items:center;gap:6px;"><MailIcon /> تواصل مع المشرف</span></div>
        <textarea class="contactInput" placeholder="اكتب رسالتك هنا..." value={message()} onInput={(e) => setMessage(e.currentTarget.value)} rows="2"></textarea>
        <button class="contactBtn" onClick={sendMessage}>إرسال</button>
      </div>
    </div>
  );
}
