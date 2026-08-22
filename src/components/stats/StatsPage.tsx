import { createSignal, onMount, onCleanup } from 'solid-js';
import { supabaseService } from '@/services/supabase.service';
import { storageService } from '@/services/storage.service';
import { authStore } from '@/stores/auth.store';
import { toastService } from '@/services/toast.service';
import { CONFIG } from '@/config';

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
  const [loginCount, setLoginCount] = createSignal(0);
  const [lastArticle, setLastArticle] = createSignal<{ title: string; url: string } | null>(null);
  const [sessionStart, setSessionStart] = createSignal<string | null>(null);
  const [loginHistory, setLoginHistory] = createSignal<Record<string, number>>({});
  let chartCanvas: HTMLCanvasElement | undefined;
  let chartInstance: any = null;

  const loadChartJs = () => {
    return new Promise<void>((resolve, reject) => {
      if ((window as any).Chart) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('فشل تحميل Chart.js'));
      document.head.appendChild(script);
    });
  };

  const createChart = () => {
    if (!chartCanvas || !(window as any).Chart) return;

    const days = last7Days();
    const labels = days.map(d => d.label);
    const data = days.map(d => d.count);
    const ctx = chartCanvas.getContext('2d');
    if (!ctx) return;

    const gradient = ctx.createLinearGradient(0, 0, 0, chartCanvas.height);
    gradient.addColorStop(0, 'rgba(195, 113, 239, 0.15)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    chartInstance = new (window as any).Chart(chartCanvas, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'نشاط',
          data,
          fill: true,
          tension: 0.4,
          borderColor: '#c371ef',
          borderWidth: 2,
          backgroundColor: gradient,
          pointRadius: 2,
          pointHoverRadius: 5,
          pointHoverBorderWidth: 4,
          pointHoverBackgroundColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          tooltip: {
            backgroundColor: 'rgba(53, 27, 92, 0.8)',
            caretPadding: 5,
            boxWidth: 5,
            usePointStyle: 'triangle',
            boxPadding: 3,
            callbacks: {
              label: (ctx) => `نشاط: ${ctx.raw}`,
              title: (ctx) => `تاريخ: ${ctx[0].label}`
            }
          },
          legend: { display: false }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { font: { size: 10 } }
          },
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => Math.round(Number(value)),
              font: { size: 10 }
            }
          }
        }
      }
    });
  };

  onMount(async () => {
    const localArticle = storageService.getLastVisitedArticle();
    if (localArticle) setLastArticle(localArticle);

    const email = authStore.userEmail();
    if (email) {
      const profile = await supabaseService.getProfile(email);
      if (profile) {
        setLoginCount(profile.login_count || 0);
        setSessionStart(profile.session_start || null);
        setLoginHistory(profile.login_history || {});
        if (!localArticle && profile.last_visited_article) {
          setLastArticle(profile.last_visited_article);
        }
      }
    }

    try {
      await loadChartJs();
      createChart();
    } catch (e) {
      console.warn('تعذر تحميل Chart.js', e);
    }
  });

  onCleanup(() => {
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }
  });

  const last7Days = () => {
    const history = loginHistory();
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

  const sessionDuration = () => {
    const start = sessionStart();
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

  const [message, setMessage] = createSignal('');
  const sendMessage = () => {
    const msg = message().trim();
    if (!msg) { toastService.show('الرجاء كتابة رسالة'); return; }
    const subject = encodeURIComponent('رسالة من مركز الإحصائيات');
    const body = encodeURIComponent(`المستخدم: ${authStore.userName()} (${authStore.userEmail()})\n\n${msg}`);
    window.location.href = `mailto:${CONFIG.adminEmail}?subject=${subject}&body=${body}`;
    setMessage('');
    toastService.show('تم فتح برنامج البريد لإرسال الرسالة');
  };

  return (
    <div style="padding:4px 0;">
      <div class="statsGrid">
        <div class="statCard"><div class="statIcon"><LoginIcon /></div><div class="statInfo"><div class="statValue">{loginCount()}</div><div class="statLabel">دخول</div></div></div>
        <div class="statCard"><div class="statIcon"><TimerIcon /></div><div class="statInfo"><div class="statValue">{sessionDuration()}</div><div class="statLabel">الجلسة</div></div></div>
        <div class="statCard"><div class="statIcon"><ArticleIcon /></div><div class="statInfo">
          {lastArticle() ? <a href={lastArticle()!.url} target="_blank" rel="noopener" class="statLink">{lastArticle()!.title}</a> : <div class="statValue" style="font-size:.75rem;color:var(--bodyCa)">لا يوجد</div>}
          <div class="statLabel">آخر مقال</div>
        </div></div>
        <div class="statCard"><div class="statIcon"><ProductIcon /></div><div class="statInfo"><div class="statValue" style="font-size:.75rem;color:var(--bodyCa)">قيد الإنشاء</div><div class="statLabel">المنتجات</div></div></div>
      </div>

      <div class="chartContainer" style="height:180px; padding:8px;">
        <div class="chartTitle">نشاط آخر 7 أيام</div>
        <div style="position:relative; height:140px;">
          <canvas ref={chartCanvas} style="width:100%; height:140px;"></canvas>
        </div>
      </div>

      <div class="contactForm">
        <div class="chartTitle"><span style="display:inline-flex;align-items:center;gap:6px;"><MailIcon /> تواصل مع المشرف</span></div>
        <textarea class="contactInput" placeholder="اكتب رسالتك هنا..." value={message()} onInput={(e) => setMessage(e.currentTarget.value)} rows="2"></textarea>
        <button class="contactBtn" onClick={sendMessage}>إرسال</button>
      </div>
    </div>
  );
}
