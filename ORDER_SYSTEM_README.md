# نظام إدارة الطلبات - Order Management System

## المميزات الجديدة

### 1. نظام الطلبات الكامل

- ✅ إرسال طلبات الشراء من صفحة السلة
- ✅ التحقق من اكتمال بيانات المستخدم قبل الطلب
- ✅ مودال أخضر لتأكيد نجاح الطلب
- ✅ صفحة إدارة الطلبات في لوحة تحكم الأدمن

### 2. الإشعارات الأوتوماتيكية

#### إشعار البريد الإلكتروني للأدمن

- يتم إرسال بريد إلكتروني تلقائي إلى `abdallahhfares@gmail.com` عند استلام طلب جديد
- البريد يحتوي على:
  - معلومات العميل كاملة
  - تفاصيل المنتجات والكميات
  - المبلغ الإجمالي وطريقة الدفع
  - رابط مباشر لعرض الطلب في لوحة التحكم

#### إشعار WhatsApp للعميل (عند الموافقة)

- عندما يوافق الأدمن على الطلب، يتم إرسال رسالة WhatsApp تلقائية للعميل
- الرسالة تحتوي على:
  - تأكيد الموافقة على الطلب
  - رقم الطلب والمبلغ الإجمالي
  - إشعار بالتواصل القريب
- **الرسائل تُرسل من الرقم:** `01157961972`

## إعداد النظام

### 1. تثبيت المكتبات المطلوبة

```bash
cd backend
npm install
```

المكتبات المطلوبة موجودة مسبقاً في `package.json`:

- `nodemailer` - لإرسال البريد الإلكتروني
- `express` - الخادم
- `mongoose` - قاعدة البيانات

### 2. إعداد ملف .env

أنشئ ملف `.env` في مجلد `backend` ونسخ المحتوى من `.env.example`:

```env
# Email Configuration
EMAIL_USER=abdallahhfares@gmail.com
EMAIL_PASS=your-gmail-app-password-here
```

#### كيفية الحصول على Gmail App Password:

1. اذهب إلى: https://myaccount.google.com/security
2. فعّل Two-Factor Authentication إذا لم يكن مفعلاً
3. اذهب إلى: https://myaccount.google.com/apppasswords
4. اختر "Mail" و "Other (Custom name)"
5. أدخل اسم التطبيق (مثلاً: "Store Backend")
6. انسخ ال App Password (16 حرف) وضعه في `.env`

### 3. إعداد WhatsApp API (اختياري)

حالياً، الكود يحتوي على placeholder لـ WhatsApp. لتفعيله، اختر واحدة من الخدمات التالية:

#### أ) Ultramsg (الأسهل - مجاني لـ 100 رسالة شهرياً)

1. سجل في: https://ultramsg.com/
2. احصل على `instance_id` و `token`
3. أضف في `.env`:

```env
WHATSAPP_API_URL=https://api.ultramsg.com/{instance_id}/messages/chat
WHATSAPP_API_TOKEN=your_token_here
```

4. عدّل في `backend/routes/orders.js` السطر 17-32:

```javascript
async function sendWhatsAppNotification(phoneNumber, message) {
  try {
    const response = await fetch(process.env.WHATSAPP_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: process.env.WHATSAPP_API_TOKEN,
        to: phoneNumber,
        body: message,
      }),
    });
    const data = await response.json();
    console.log("WhatsApp sent:", data);
    return true;
  } catch (error) {
    console.error("WhatsApp error:", error);
    return false;
  }
}
```

#### ب) Twilio (أكثر احترافية - مدفوع)

1. سجل في: https://www.twilio.com/whatsapp
2. احصل على Account SID, Auth Token, WhatsApp Number
3. ثبت SDK:

```bash
npm install twilio
```

4. استخدم في الكود:

```javascript
const twilio = require("twilio");
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

async function sendWhatsAppNotification(phoneNumber, message) {
  try {
    await client.messages.create({
      from: "whatsapp:" + process.env.TWILIO_WHATSAPP_NUMBER,
      to: "whatsapp:" + phoneNumber,
      body: message,
    });
    return true;
  } catch (error) {
    console.error("WhatsApp error:", error);
    return false;
  }
}
```

### 4. تشغيل النظام

```bash
# Backend
cd backend
npm run dev

# Frontend (في terminal آخر)
cd frontend
npm start
```

## كيفية الاستخدام

### للمستخدمين:

1. **إضافة منتجات للسلة** من صفحة المنتجات
2. **الذهاب للسلة** من القائمة
3. **التأكد من اكتمال البيانات الشخصية** (سيتم التحويل للملف الشخصي إذا كانت ناقصة)
4. **اختيار طريقة الدفع** (نقدي عند الاستلام / إلكتروني)
5. **الضغط على "تأكيد الطلب"**
6. **ستظهر رسالة نجاح خضراء** تفيد بإرسال الطلب

### للأدمن:

1. **تسجيل الدخول للوحة التحكم**: `/admin/dashboard`
2. **الذهاب لصفحة الطلبات** من القائمة الجانبية
3. **عرض جميع الطلبات** مع إمكانية الفلترة والبحث:
   - حسب الحالة (قيد الانتظار، تمت الموافقة، مرفوض، مكتمل، ملغى)
   - البحث بالاسم، البريد، الهاتف، أو رقم الطلب
4. **عرض تفاصيل الطلب** بالضغط على أيقونة العين
5. **الموافقة على الطلب**:
   - يتم إرسال رسالة WhatsApp تلقائية للعميل
   - تتغير حالة الطلب إلى "تمت الموافقة"
6. **رفض الطلب** (مع إمكانية إضافة سبب)
7. **حذف الطلب** نهائياً

## حالات الطلب

- **قيد الانتظار (Pending)**: جديد ولم يتم اتخاذ إجراء
- **تمت الموافقة (Approved)**: تمت الموافقة وإرسال إشعار للعميل
- **مرفوض (Rejected)**: تم رفض الطلب
- **مكتمل (Completed)**: تم التوصيل والدفع
- **ملغى (Cancelled)**: ألغاه العميل أو الأدمن

## ملاحظات مهمة

### الأمان:

- ✅ التحقق من صلاحية الأدمن في جميع endpoints
- ✅ التحقق من اكتمال بيانات المستخدم
- ✅ استخدام HTTPS في الإنتاج
- ⚠️ لا تشارك `.env` على GitHub

### الأداء:

- البريد الإلكتروني يُرسل بشكل غير متزامن (لا يوقف الطلب)
- WhatsApp يُرسل فقط عند الموافقة (لتقليل التكلفة)

### التطوير المستقبلي:

- [ ] إضافة إشعارات push للمتصفح
- [ ] نظام تتبع الشحنات
- [ ] إحصائيات وتقارير مفصلة
- [ ] تصدير الطلبات لـ Excel/PDF

## الدعم الفني

في حالة وجود مشاكل:

1. تأكد من تشغيل MongoDB
2. تحقق من ملف `.env`
3. راجع console logs في Backend
4. تأكد من وجود اتصال بالإنترنت (للبريد و WhatsApp)

## API Endpoints

```
POST   /api/orders                     - إنشاء طلب جديد (User)
GET    /api/orders/my-orders           - طلبات المستخدم (User)
GET    /api/orders/admin/all           - جميع الطلبات (Admin)
PATCH  /api/orders/admin/:id/status    - تحديث حالة الطلب (Admin)
DELETE /api/orders/admin/:id           - حذف الطلب (Admin)
```

---

**تم التطوير بواسطة: GitHub Copilot**
**التاريخ: 12 ديسمبر 2025**
