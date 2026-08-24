# 🔐 نظام المصادقة المتكامل لمدونات بلوجر — مشروع "مود ويب"

مشروع مصادقة وحسابات متكامل مبني بـ **SolidJS + Vue + Vite + TypeScript**، يعمل كتطبيق مستقل يتم تحميله داخل قالب Blogger.  
يدعم تسجيل الدخول عبر Google، إدارة الحساب، الجلسات، المجتمع، الإحصائيات، المنتجات، والتنبيهات.

---

## 📌 الإصدار الحالي

- **الإصدار العام:** v1.0.0 (مستقر)
- **إجمالي التعديلات:** 77 commit
- **آخر تحديث:** 24 أغسطس 2026

---

## ✨ المميزات

### نظام المصادقة
- تسجيل دخول عبر Google Identity Services (OAuth 2.0)
- عرض بيانات الحساب (الاسم، البريد، الصورة، النبذة)
- إدارة الجلسات (IP حقيقي، نظام التشغيل، المتصفح، وقت الدخول)
- تعديل الملف الشخصي (الاسم، النبذة، الصورة)
- تسجيل الخروج

### المجتمع
- عرض الأعضاء المسجلين
- عرض الملف الشخصي لكل عضو
- إخفاء البريد الإلكتروني وإظهار النبذة فقط

### مركز الإحصائيات
- عدد مرات تسجيل الدخول
- مدة الجلسة الحالية
- آخر مقال تمت زيارته
- رسم بياني تفاعلي (Chart.js) لنشاط آخر 7 أيام
- نموذج تواصل سريع مع المشرف عبر البريد

### المنتجات
- صفحة منتجات قيد الإنشاء (قابلة للتوسع)

### التنبيهات (Vue Sonner)
- تنبيهات مخصصة بنمط PWA
- تنبيه تحديث تلقائي بعد الخمول
- أزرار تحديث/إغلاق مع أيقونات SVG

### الودجت العائم (FAB)
- زر Google Source عائم (مفضل لدى Google)
- مستقل تمامًا عن المصادقة

### التخزين والمزامنة
- **Supabase** لتخزين الملف الشخصي، الجلسات، والإحصائيات
- **LocalStorage** للتخزين المحلي السريع
- جلب IP حقيقي تلقائيًا عبر `api.ipify.org`

---

## 🛠️ التقنيات والأدوات

| التقنية | الاستخدام | الإصدار |
|---------|-----------|---------|
| **SolidJS** | إطار واجهات المستخدم | 1.9.14 |
| **Vue 3** | إطار تنبيهات Sonner | 3.5.41 |
| **Vite** | أداة البناء | 8.2.0 |
| **TypeScript** | فحص الأنواع | 6.0.3 |
| **Supabase JS** | قاعدة البيانات | 2.112.3 |
| **Vue Sonner** | مكون التنبيهات | 2.0.9 |
| **Terser** | ضغط الملفات | 5.49.0 |
| **Node.js** | بيئة التشغيل | 24.18.0 |
| **npm** | إدارة الحزم | 11.19.0 |
| **Git** | التحكم بالإصدارات | 2.55.0 |

### خدمات خارجية
- **Google Identity Services** — تسجيل الدخول
- **Supabase** — قاعدة بيانات PostgreSQL
- **api.ipify.org** — جلب IP الحقيقي
- **ui-avatars.com** — صور رمزية تلقائية
- **cdn.jsdelivr.net** — تحميل Chart.js

---

## 📁 هيكل المشروع

```

src/
├── components/
│   ├── account/          # تسجيل الدخول ولوحة الحساب
│   ├── community/        # الأعضاء والملف الشخصي
│   ├── stats/            # الإحصائيات والمنتجات
│   ├── fab/              # الزر العائم
│   └── ui/               # مكونات واجهة عامة
├── config/
│   ├── index.ts          # إعدادات المشروع
│   └── supabase.ts       # مفاتيح Supabase
├── services/
│   ├── google-auth.service.ts
│   ├── storage.service.ts
│   ├── supabase.service.ts
│   ├── community.service.ts
│   └── toast.service.ts
├── stores/
│   └── auth.store.ts     # حالة المستخدم
├── styles/
│   ├── auth.css          # تنسيقات المصادقة
│   ├── fab.css           # تنسيقات الزر العائم
│   └── toast-custom.css  # تنسيقات التنبيهات
├── types/
│   ├── index.ts          # تعريفات TypeScript
│   └── global.d.ts       # تعريفات عامة
├── main.tsx              # نقطة دخول المصادقة
├── fab-main.tsx          # نقطة دخول الزر العائم
├── toast-main.ts         # نقطة دخول التنبيهات
└── App.tsx               # المكون الرئيسي

```

---

## 🚀 التثبيت والتطوير

### 1. استنساخ المشروع

```bash
git clone https://github.com/zerootem/blogger-auth-project.git
cd blogger-auth-project
npm install
```

2. إعداد Supabase

1. أنشئ مشروعًا في Supabase.
2. أنشئ جدولين:

```sql
-- جدول الملفات الشخصية
create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text,
  picture text,
  bio text default '',
  login_count integer default 0,
  login_history jsonb default '{}',
  session_start timestamptz,
  last_visited_article jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- جدول الجلسات
create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  user_email text not null,
  session_id text not null unique,
  time text,
  os text,
  ip text,
  is_current boolean default false,
  created_at timestamptz default now()
);
```

3. عطّل RLS مؤقتًا أو أنشئ سياسات عامة حسب الحاجة.

3. إضافة مفاتيح Supabase

عدّل src/config/supabase.ts:

```ts
export const SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co';
export const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';
```

4. إضافة Google Client ID

عدّل src/config/index.ts:

```ts
googleClientId: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
```

5. التشغيل المحلي

```bash
npm run dev
```

---

📦 البناء للإنتاج

```bash
npm run build
```

ستجد الملفات في dist/assets/ بأسماء مثل:

· auth.[hash].js و auth.[hash].css
· toast.[hash].js و toast.[hash].css
· fab.[hash].js و fab.[hash].css

---

☁️ النشر على Cloudflare Pages

الطريقة التلقائية (مستحسن)

1. ارفع المشروع إلى GitHub.
2. في Cloudflare Pages:
   · Build command: npm run build
   · Output directory: dist
3. سيتم البناء والنشر تلقائيًا عند كل git push.

الطريقة اليدوية

```bash
npx wrangler pages deploy dist --project-name=mod-auth
```

---

🔗 الدمج مع Blogger

أضف الكود التالي في قالب Blogger قبل </body>:

```html
<!-- نظام المصادقة -->
<script>
//<![CDATA[
!function(){var a="https://blogger-auth-project.pages.dev/assets/",b=document.createElement("script");b.async=!0,b.defer=!0,b.src="https://accounts.google.com/gsi/client",document.head.appendChild(b);var c=document.createElement("link");c.rel="stylesheet",c.href=a+"auth.ef3RdoMc.css",document.head.appendChild(c);var d=document.createElement("link");d.rel="stylesheet",d.href=a+"toast.BPcHJlAZ.css",document.head.appendChild(d);var e=document.createElement("script");e.type="module",e.src=a+"auth.BCeOKYoI.js",document.body.appendChild(e);var f=document.createElement("script");f.type="module",f.src=a+"toast.CNOmw0Gr.js",f.async=!0,document.body.appendChild(f);window.updateAccountUI=function(){var g="true"===localStorage.getItem("userLoggedIn"),h=localStorage.getItem("userName")||"",i=localStorage.getItem("userEmail")||"",j=localStorage.getItem("userPicture")||"",k=document.querySelector(".acntW"),l=document.querySelector(".tAcnt span"),m=document.getElementById("acntToggle");if(l){l.innerHTML=g?j?'<img src="'+j+'" alt="'+h+'" style="position:absolute;top:0;left:0;height:100%;width:100%;object-fit:cover;border-radius:8px;">':"<b>"+h.charAt(0).toUpperCase()+"</b>":"<i></i>"}if(k&&m&&!m.checked){var n="";if(g){n+='<button type="button" aria-label="الحساب" onclick="document.getElementById(\'acntToggle\').checked=false; openAccountSheet();"><svg class="line" viewBox="0 0 24 24" style="width:20px;height:20px;flex-shrink:0;"><path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"/><path d="M20.5899 22C20.5899 18.13 16.7399 15 11.9999 15C7.25991 15 3.40991 18.13 3.40991 22"/></svg><span style="white-space:nowrap;"></span></button>';n+='<button type="button" aria-label="أعضاء المجتمع" onclick="document.getElementById(\'acntToggle\').checked=false; openCommunityMembers();"><svg class="line" viewBox="0 0 24 24" style="width:20px;height:20px;flex-shrink:0;"><path d="M17 21V19C17 16.7909 15.2091 15 13 15H5C2.79086 15 1 16.7909 1 19V21"/><path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z"/><path d="M23 21V19C22.735 17.6175 21.6864 16.4738 20.28 16.12"/><path d="M16 3.13C17.4112 3.45279 18.6081 4.39075 19.2096 5.6806C19.8112 6.97045 19.7533 8.4493 19.05 9.69"/></svg><span style="white-space:nowrap;"></span></button>';n+='<button type="button" aria-label="مركز الإحصائيات" onclick="document.getElementById(\'acntToggle\').checked=false; openStatsPage();"><svg class="line" viewBox="0 0 24 24" style="width:20px;height:20px;flex-shrink:0;"><path d="M18 20V10M12 20V4M6 20v-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg><span style="white-space:nowrap;"></span></button>';n+='<button type="button" aria-label="المنتجات" onclick="document.getElementById(\'acntToggle\').checked=false; openProductsPage();"><svg class="line" viewBox="0 0 24 24" style="width:20px;height:20px;flex-shrink:0;"><path d="M21 8l-9-5-9 5v8l9 5 9-5V8z"/><path d="M3 8l9 5 9-5"/><path d="M12 13v8"/></svg><span style="white-space:nowrap;"></span></button>';n+='<button type="button" aria-label="تسجيل الخروج" onclick="document.getElementById(\'acntToggle\').checked=false; handleLogout();"><svg class="line" viewBox="0 0 24 24" style="width:20px;height:20px;flex-shrink:0;"><path d="M17.4399 14.62L19.9999 12.06L17.4399 9.5"/><path d="M9.76001 12.0601H19.93"/><path d="M11.76 20C7.34001 20 3.76001 17 3.76001 12C3.76001 7 7.34001 4 11.76 4"/></svg><span style="white-space:nowrap;"></span></button>'}else{n+='<button type="button" aria-label="تسجيل الدخول" onclick="document.getElementById(\'acntToggle\').checked=false; openAccountSheet();"><svg class="line" viewBox="0 0 24 24" style="width:20px;height:20px;flex-shrink:0;"><path d="M11.6801 14.62L14.2401 12.06L11.6801 9.5"/><path d="M4 12.0601H14.17"/><path d="M12 4C16.42 4 20 7 20 12C20 17 16.42 20 12 20"/></svg><span style="white-space:nowrap;"></span></button>'}k.innerHTML=n}};document.addEventListener("DOMContentLoaded",function(){setTimeout(window.updateAccountUI,100)});window.addEventListener("load",function(){setTimeout(window.updateAccountUI,100)});window.addEventListener("storage",function(e){if("userLoggedIn"===e.key||"userName"===e.key||"userPicture"===e.key)window.updateAccountUI()})}();
//]]>
</script>
```

ملاحظة: استبدل أسماء الملفات عند كل بناء جديد.

---

🔧 الصيانة والتحديث

· بعد أي تعديل، شغّل:
  ```bash
  npm run build
  git add -A
  git commit -m "وصف التعديل"
  git push
  ```
· سيتغير هاش الملفات، لذا حدّث الروابط في Blogger.
· افحص الأخطاء قبل النشر:
  ```bash
  npx tsc --noEmit
  npm audit --omit=dev
  ```

---

🛡️ الأمان

· لا تشارك SUPABASE_ANON_KEY في أماكن عامة.
· لا ترفع service_role مطلقًا.
· فعّل RLS مع سياسات مناسبة في الإنتاج.
· استخدم allowedDomains في config/index.ts لتقييد النطاقات.

---

📄 الترخيص

هذا المشروع خاص بمدونة مود ويب. يمنع استخدامه دون إذن.
