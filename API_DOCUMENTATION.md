# Page Editor API Endpoints

## Base URL

```
http://localhost:3000/api/admin
```

## Endpoints

### 1. Get All Page Content

**الطلب:**

```http
GET /api/admin/page-content
```

**الرد الناجح (200):**

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "hero": {
    "title": "Artisan Craftsmanship Meets Modern Elegance",
    "subtitle": "Handcrafted apparel from local artisans. Every stitch tells a story.",
    "backgroundColor": "#0f0f0f",
    "textColor": "#ffffff",
    "backgroundImage": "",
    "primaryButton": {
      "text": "Explore Collection",
      "link": "/products"
    },
    "secondaryButton": {
      "text": "Book Consultation",
      "link": "/tailoring"
    }
  },
  "features": [
    {
      "icon": "fa-shirt",
      "title": "Premium Quality",
      "description": "Crafted with the finest materials"
    }
  ],
  "reviews": [],
  "promotions": [
    {
      "text": "Free Shipping on Orders Over $50",
      "icon": "fa-truck"
    }
  ],
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

---

### 2. Update Entire Page Content

**الطلب:**

```http
PUT /api/admin/page-content
Content-Type: application/json

{
  "hero": {
    "title": "New Title",
    "subtitle": "New Subtitle",
    ...
  },
  "features": [...],
  "reviews": [...]
}
```

**الرد الناجح (200):**

```json
{
  "message": "Page content updated successfully",
  "pageContent": { ... }
}
```

---

### 3. Update Specific Section

**الطلب:**

```http
PUT /api/admin/page-content/:section
Content-Type: application/json

{
  "title": "New Title",
  "subtitle": "New Subtitle",
  "backgroundColor": "#ffffff"
}
```

**المعاملات:**

- `section` - اسم القسم: `hero`, `features`, `reviews`, `promotions`, `about`, `cta`, `footer`

**مثال عملي:**

```http
PUT /api/admin/page-content/hero
Content-Type: application/json

{
  "title": "Welcome to Local Craft",
  "subtitle": "Experience Artisan Excellence"
}
```

**الرد الناجح (200):**

```json
{
  "message": "hero updated successfully",
  "hero": {
    "title": "Welcome to Local Craft",
    "subtitle": "Experience Artisan Excellence",
    ...
  }
}
```

---

### 4. Add Item to Array Section

**الطلب:**

```http
POST /api/admin/page-content/:section/add
Content-Type: application/json

{
  "field1": "value1",
  "field2": "value2"
}
```

**مثال لإضافة Feature:**

```http
POST /api/admin/page-content/features/add
Content-Type: application/json

{
  "icon": "fa-needle",
  "title": "Expert Tailoring",
  "description": "Custom fitting by master craftsmen"
}
```

**الرد الناجح (201):**

```json
{
  "message": "Item added to features",
  "features": [
    {
      "icon": "fa-needle",
      "title": "Expert Tailoring",
      "description": "Custom fitting by master craftsmen"
    }
  ]
}
```

**مثال لإضافة Review:**

```http
POST /api/admin/page-content/reviews/add
Content-Type: application/json

{
  "name": "أحمد محمد",
  "role": "عميل VIP",
  "rating": 5,
  "comment": "منتجات رائعة وخدمة ممتازة",
  "date": "2024-01-15",
  "image": "https://example.com/user.jpg"
}
```

**مثال لإضافة Promotion:**

```http
POST /api/admin/page-content/promotions/add
Content-Type: application/json

{
  "text": "Buy 2 Get 1 Free",
  "icon": "fa-gift"
}
```

---

### 5. Delete Item from Array Section

**الطلب:**

```http
DELETE /api/admin/page-content/:section/:index
```

**مثال - حذف Feature #0:**

```http
DELETE /api/admin/page-content/features/0
```

**الرد الناجح (200):**

```json
{
  "message": "Item deleted from features",
  "features": [
    { ... remaining items ... }
  ]
}
```

---

## Data Structure Reference

### Hero Section

```javascript
{
  title: String,                    // الافتتاحية الرئيسية
  subtitle: String,                 // الوصف التفصيلي
  backgroundImage: String,          // رابط الصورة
  backgroundColor: String,          // لون الخلفية (Hex)
  textColor: String,                // لون النص (Hex)
  primaryButton: {
    text: String,                   // نص الزر الأول
    link: String                    // رابط الزر الأول
  },
  secondaryButton: {
    text: String,                   // نص الزر الثاني
    link: String                    // رابط الزر الثاني
  }
}
```

### Features Array Item

```javascript
{
  icon: String,         // Font Awesome icon (مثل: fa-shirt)
  title: String,        // اسم المميزة
  description: String   // وصف المميزة
}
```

### Reviews Array Item

```javascript
{
  name: String,         // اسم المُقيّم
  role: String,         // الوظيفة أو الدور
  rating: Number,       // التقييم (1-5)
  comment: String,      // التعليق
  date: String,         // التاريخ (YYYY-MM-DD)
  image: String         // رابط الصورة (URL)
}
```

### Promotions Array Item

```javascript
{
  text: String,         // نص العرض
  icon: String          // Font Awesome icon
}
```

---

## HTTP Status Codes

| Code | المعنى                      |
| ---- | --------------------------- |
| 200  | نجح الطلب                   |
| 201  | تم الإنشاء بنجاح            |
| 400  | طلب خاطئ (بيانات غير صحيحة) |
| 404  | المورد غير موجود            |
| 500  | خطأ في الخادم               |

---

## Error Responses

### مثال على رسالة خطأ:

```json
{
  "error": "Failed to update page content"
}
```

### مثال على طلب خاطئ:

```json
{
  "error": "Invalid section: invalid_section_name"
}
```

---

## Testing with cURL

### Get Page Content:

```bash
curl -X GET http://localhost:3000/api/admin/page-content
```

### Update Hero:

```bash
curl -X PUT http://localhost:3000/api/admin/page-content/hero \
  -H "Content-Type: application/json" \
  -d '{"title":"New Title"}'
```

### Add Feature:

```bash
curl -X POST http://localhost:3000/api/admin/page-content/features/add \
  -H "Content-Type: application/json" \
  -d '{
    "icon":"fa-shirt",
    "title":"Quality",
    "description":"Premium materials"
  }'
```

### Delete Feature #0:

```bash
curl -X DELETE http://localhost:3000/api/admin/page-content/features/0
```

---

**Version:** 1.0
**Last Updated:** 2024
