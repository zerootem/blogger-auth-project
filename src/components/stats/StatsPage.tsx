import { createSignal } from 'solid-js';
import { storageService } from '@/services/storage.service';
import { CONFIG } from '@/config';
import { toastService } from '@/services/toast.service';

export function StatsPage() {
  const loginCount = () => storageService.getLoginCount();
  const lastArticle = () => storageService.getLastVisitedArticle();

  // مدة الجلسة الحالية
  const sessionDuration = () => {
    const start = storageService.getSessionStartTime();
    if (!start) return 'غير متاحة';
    const now = new Date();
    const diffMs = now.getTime() - new Date(start).getTime();
    const minutes = Math.floor(diffMs / 60000);
    if (minutes < 1) return 'أقل من دقيقة';
    if (minutes < 60) return `${minutes} دقيقة`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours} ساعة ${mins} دقيقة`;
  };

  // رسم بياني لآخر 7 أيام
  const last7Days = () => {
    const history = storageService.getLoginHistory();
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const label = new Intl.DateTimeFormat('ar-EG', { weekday: 'short', month: 'short', day: 'numeric' }).format(d);
      days.push({ label, count: history[key] || 0 });
    }
    return days;
  };

  // نموذج الاتصال
  const [message, setMessage] = createSignal('');
  const sendMessage = () => {
    const msg = message().trim();
    if (!msg) {
      toastService.show('الرجاء كتابة رسالة');
      return;
    }
    const subject = encodeURIComponent('رسالة من مركز الإحصائيات');
    const body = encodeURIComponent(`المستخدم: ${storageService.getUserName()} (${storageService.getUserEmail()})\n\n${msg}`);
    window.location.href = `mailto:${CONFIG.adminEmail}?subject=${subject}&body=${body}`;
    setMessage('');
    toastService.show('تم فتح برنامج البريد لإرسال الرسالة');
  };

  return (
    <div style="padding:4px 0">
      {/* عدد مرات الدخول */}
      <div class="statCard">
        <div class="statIcon">🔑</div>
        <div class="statInfo">
          <div class="statValue">{loginCount()}</div>
          <div class="statLabel">مرة تسجيل دخول</div>
        </div>
      </div>

      {/* مدة الجلسة الحالية */}
      <div class="statCard">
        <div class="statIcon">⏱️</div>
        <div class="statInfo">
          <div class="statValue">{sessionDuration()}</div>
          <div class="statLabel">مدة الجلسة الحالية</div>
        </div>
      </div>

      {/* آخر مقال تمت زيارته */}
      <div class="statCard">
        <div class="statIcon">📄</div>
        <div class="statInfo">
          {lastArticle() ? (
            <>
              <div class="statValue" style="font-size:.8rem">
                <a href={lastArticle()!.url} target="_blank" rel="noopener" style="color:var(--linkC);text-decoration:none">
                  {lastArticle()!.title}
                </a>
              </div>
              <div class="statLabel">آخر مقال تمت زيارته</div>
            </>
          ) : (
            <div class="statValue" style="font-size:.8rem">لا يوجد</div>
          )}
        </div>
      </div>

      {/* رسم بياني بسيط */}
      <div class="chartContainer">
        <div class="chartTitle">نشاط آخر 7 أيام</div>
        <div class="chartBars">
          {last7Days().map(day => (
            <div class="chartBarItem">
              <div class="chartBar" style={{ height: Math.max(day.count * 20, 4) + 'px' }} title={`${day.count} مرات`}></div>
              <div class="chartLabel">{day.label.split('،')[0]}</div>
            </div>
          ))}
        </div>
      </div>

      {/* نموذج الاتصال السريع */}
      <div class="contactForm">
        <div class="chartTitle">📧 تواصل مع المشرف</div>
        <textarea
          class="contactInput"
          placeholder="اكتب رسالتك هنا..."
          value={message()}
          onInput={(e) => setMessage(e.currentTarget.value)}
          rows="3"
        ></textarea>
        <button class="contactBtn" onClick={sendMessage}>
          إرسال عبر البريد
        </button>
      </div>

      <div style="margin-top:10px;text-align:center">
        <button onClick={() => history.back()} class="gBtn gBtn-outline" style="display:inline-flex;width:auto;padding:6px 16px;font-size:.7rem">
          ↩ الرجوع
        </button>
      </div>
    </div>
  );
}
