# نظام المصادقة الاحترافي لمدونات بلوجر (مود ويب)

مشروع مصادقة وحسابات متكامل مبني بـ **SolidJS + TypeScript + Vite**، يعمل كتطبيق مستقل يتم تحميله داخل قالب Blogger.  
يدعم تسجيل الدخول عبر Google، إدارة الحساب، الجلسات، المجتمع، الإحصائيات، ولوحة تحكم للمشرف.

---

## 📋 المميزات

- ✅ تسجيل دخول عبر Google (OAuth 2.0 / One Tap)
- ✅ إدارة الجلسات (حذف الجلسات السابقة)
- ✅ تعديل الملف الشخصي (الاسم والصورة)
- ✅ مجتمع الأعضاء (عرض الأعضاء والملفات الشخصية)
- ✅ مركز إحصائيات (عدد الدخول، مدة الجلسة، آخر مقال، رسم بياني)
- ✅ نموذج اتصال سريع بالمشرف
- ✅ لوحة تحكم للمشرف (إدارة الأعضاء والرسائل)
- ✅ حماية النطاقات (يعمل فقط على النطاقات المسموحة)
- ✅ فصل كامل عن القالب (Blogger مجرد حاوية)
- ✅ نشر تلقائي عبر GitHub Actions إلى GitHub Pages

---

## 🚀 التثبيت والنشر

### 1. استنساخ المشروع

```bash
git clone https://github.com/zerootem/blogger-auth-project.git
cd blogger-auth-project
npm install
```

2. إعداد النطاقات المسموحة

افتح ملف src/config/index.ts وعدّل مصفوفة allowedDomains:

```ts
allowedDomains: [
  'localhost',
  '127.0.0.1',
  'your-blog.blogspot.com',
  'your-custom-domain.com',
],
```

⚠️ هام: إذا تركت المصفوفة فارغة [] فسيعمل المشروع على أي نطاق (غير موصى به للإنتاج).

3. بناء المشروع

```bash
npm run build
```

4. رفع الملفات إلى GitHub Pages

المشروع مهيأ للنشر التلقائي. بعد رفعه إلى GitHub، سيتم بناءه ونشره على https://USERNAME.github.io/blogger-auth-project.

5. الدمج مع قالب Blogger

أضف الكود التالي في قالب Blogger (قبل </body>):

```html
<!-- إعدادات المشروع (اختياري) -->
<script>
  window.__MOD_AUTH_CONFIG__ = {
    googleClientId: "YOUR_GOOGLE_CLIENT_ID",
    adminEmail: "your-email@gmail.com",
    projectName: "مدونتك",
    allowedDomains: ["your-blog.blogspot.com"]
  };
</script>

<!-- حاوية التطبيق -->
<div id="modpro-auth-root"></div>

<!-- تحميل ملفات المشروع -->
<link rel="stylesheet" href="https://zerootem.github.io/blogger-auth-project/assets/auth.css" />
<script type="module" src="https://zerootem.github.io/blogger-auth-project/assets/auth.js"></script>
```

استبدل zerootem باسم المستخدم الخاص بك في GitHub.

---

🔧 التطوير المحلي

```bash
npm run dev
```

سيتم فتح المتصفح على http://localhost:5173. للتطوير، تأكد من إضافة localhost إلى allowedDomains.

---

📁 هيكل المشروع

```
src/
├── components/       # المكونات (حسب الصفحات)
│   ├── account/      # تسجيل الدخول، لوحة الحساب
│   ├── admin/        # لوحة الإدارة
│   ├── community/    # الأعضاء، الملف الشخصي
│   └── stats/        # مركز الإحصائيات
├── services/         # خدمات (تخزين، Google Auth، مجتمع)
├── stores/           # حالة التطبيق (SolidJS Signals)
├── config/           # إعدادات المشروع
├── types/            # تعريفات TypeScript
├── styles/           # ملفات CSS
├── App.tsx           # المكون الرئيسي
└── main.tsx          # نقطة الدخول
```

---

🛡️ حماية النطاقات

عند تحميل التطبيق، يتحقق من أن window.location.hostname موجود ضمن allowedDomains.
إذا لم يكن مسموحاً، سيتم عرض رسالة في console ولن يعمل التطبيق.
لتعديل النطاقات المسموحة دون إعادة بناء المشروع، استخدم window.__MOD_AUTH_CONFIG__.allowedDomains في قالب Blogger.

---

📄 الترخيص

هذا المشروع خاص بمدونة مود ويب. يمنع استخدامه دون إذن.
