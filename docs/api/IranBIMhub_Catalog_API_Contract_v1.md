# قرارداد API کاتالوگ و متادیتا — IranBIMhub v1

**مخاطب:** رضا / تیم بک‌اند و یکپارچه‌سازی  
**وضعیت:** قرارداد پیشنهادی برای اتصال فرانت‌اند مرحله‌های ۱ تا ۵؛ هنوز هیچ endpointی در این مرحله پیاده‌سازی نشده است.  
**Base URL:** `/api/v1`  
**Content type:** `application/json; charset=utf-8`  
**زمان‌ها:** ISO 8601 در UTC، مانند `2026-08-08T10:30:00Z`  
**شناسه‌ها:** UUID یا ULID پایدار. slugها فقط برای URL و دسته‌بندی‌اند و جای ID را نمی‌گیرند.

---

## ۱. اصول غیرقابل‌تغییر

1. دادهٔ عمومی فقط زمانی از `GET /catalog/products` برگردد که `publicationStatus = published` باشد.
2. آبجکت نمونه، پیش‌نویس، محصول حذف‌شده یا اطلاعات برند تأییدنشده هرگز وارد پاسخ عمومی نشوند.
3. مقدارهای Attribute فقط با `attributeKey`های رجیستری منتشرشده پذیرفته شوند؛ کلید جدید بدون نسخه‌بندی ایجاد نشود.
4. `unknown` با `not_applicable` فرق دارد. مقدار `0` نباید جای دادهٔ نامعلوم ثبت شود.
5. ویژگی‌های دارای منبع الزامی، بدون `sourceId` معتبر نباید امتیاز Badge دریافت یا به‌عنوان ادعای عملکردی عمومی نمایش داده شوند.
6. Badge سطح داده توسط سرور محاسبه و در پاسخ برگردانده شود؛ فرانت‌اند می‌تواند همان منطق را فقط برای Preview اجرا کند.
7. وضعیت BIM از Badge سطح داده مستقل است.
8. فایل BIM منتشرشده immutable است؛ فایل جدید باید نسخهٔ جدید بسازد، نه overwrite.

---

## ۲. Endpointهای عمومی

| Method | Path | کاربرد |
|---|---|---|
| `GET` | `/catalog/categories` | ۱۰ خانواده و ۱۰۰ زیر‌دستهٔ مصوب |
| `GET` | `/catalog/attributes` | رجیستری ویژگی‌ها و نسخهٔ آن |
| `GET` | `/catalog/products` | جست‌وجو و نتایج محصول منتشرشده |
| `GET` | `/catalog/products/{productId}` | صفحهٔ جزئیات محصول منتشرشده |

### نمونهٔ جست‌وجو

```http
GET /api/v1/catalog/products?category=windows&q=پنجره&formats=RFA&bimAvailability=published&attributes[frame_material]=aluminium&page=1&pageSize=24
```

قواعد query:

- `category` فقط slug سطح دوم است.
- `q` در عنوان، نام برند، کلیدواژه، دسته و مقدارهای قابل‌جست‌وجو بررسی می‌شود.
- `attributes[key]` فقط کلیدهای Attribute Registry است.
- بازهٔ عددی:

```text
attributes[power][min]=10
attributes[power][max]=30
```

- پاسخ شامل `items`, `page`, `pageSize`, `total` است. `total` فقط تعداد واقعی رکوردهای منتشرشده است.

---

## ۳. Endpointهای پنل برند

همهٔ endpointهای این بخش نیازمند نشست کاربر و کنترل مالکیت برند هستند.

| Method | Path | کاربرد |
|---|---|---|
| `POST` | `/brands/{brandId}/products` | ایجاد پیش‌نویس محصول |
| `PATCH` | `/catalog/products/{productId}` | ویرایش اطلاعات پایه |
| `PUT` | `/catalog/products/{productId}/variants` | جایگزینی مجموعهٔ واریانت‌ها با کنترل نسخه |
| `PUT` | `/catalog/products/{productId}/attribute-values` | ثبت گروهی مقدارهای متادیتا |
| `POST` | `/catalog/products/{productId}/documents` | اتصال مدرک پس از آپلود امن |
| `POST` | `/catalog/products/{productId}/bim-files` | ایجاد نسخهٔ جدید فایل BIM |
| `POST` | `/catalog/products/{productId}/review/submit` | ارسال برای بررسی |
| `GET` | `/catalog/products/{productId}/review` | وضعیت بررسی و پیام قابل‌نمایش برای برند |
| `GET` | `/catalog/products/{productId}/changes` | لاگ تغییرات قابل حسابرسی |

### کنترل دسترسی

- `brand` فقط محصول‌های برند خودش را می‌بیند یا ویرایش می‌کند.
- `reviewer` به صف بررسی، چک‌لیست و یادداشت داخلی دسترسی دارد.
- `admin` می‌تواند انتشار، آرشیو و اصلاح حاکمیت داده را انجام دهد.
- یادداشت داخلی بررسی هرگز در endpoint عمومی یا پاسخ پنل برند برنگردد.

---

## ۴. مدل‌های اصلی

### Product

```json
{
  "id": "prd_01J...",
  "title": { "fa": "پنجرهٔ ...", "en": "... window" },
  "manufacturer": { "id": "brand_...", "name": { "fa": "...", "en": "..." } },
  "categoryId": "windows",
  "family": "...",
  "modelNumber": "...",
  "productionStatus": "active",
  "publicationStatus": "published",
  "updatedAt": "2026-08-08T10:30:00Z",
  "attributes": [],
  "variants": [],
  "documents": [],
  "bimAvailability": "published",
  "bimFiles": [],
  "dataLevel": "DATA_2"
}
```

`dataLevel` در DTO عمومی باید از سرور برگردد؛ این فیلد در مدل فرانت‌اند از `assessDataLevel` قابل نمایش است.

### AttributeValue

```json
{
  "attributeKey": "thermal_transmittance",
  "applicability": "applicable",
  "value": 2.1,
  "unit": "W/m²K",
  "sourceId": "doc_...",
  "updatedAt": "2026-08-08T10:30:00Z"
}
```

حالت‌های `applicability`:

- `applicable`: مقدار ثبت شده است؛
- `not_applicable`: ویژگی برای این محصول معنی ندارد؛
- `unknown`: داده اعلام نشده؛ امتیاز کامل نمی‌گیرد.

### Variant

واریانت محل ثبت رنگ، ابعاد، توان، ظرفیت، ولتاژ و سایر گزینه‌های قابل سفارش است؛ نه محصول مادر.

```json
{
  "id": "var_...",
  "sku": "...",
  "label": { "fa": "...", "en": "..." },
  "status": "active",
  "attributes": []
}
```

### BIM File Version

```json
{
  "id": "bimfile_...",
  "format": "RFA",
  "availability": "published",
  "reviewStatus": "published",
  "version": "1.2.0",
  "revision": 3,
  "checksumSha256": "...",
  "fileSizeBytes": 1843200,
  "uploadedAt": "2026-08-08T10:30:00Z",
  "supersedesFileId": "bimfile_previous",
  "releaseNotes": "..."
}
```

---

## ۵. وضعیت‌ها

### ProductionStatus

`active`, `made_to_order`, `discontinued`, `unknown`

### BimAvailability

`not_available`, `in_preparation`, `available`, `pending_review`, `published`, `archived`

### PublicationStatus / ReviewStatus

`draft`, `pending_review`, `needs_revision`, `publishable`, `published`, `archived`

### DataLevel

| کد | عنوان فارسی | مفهوم |
|---|---|---|
| `DATA_1` | اطلاعات پایه | شناسنامهٔ محصول |
| `DATA_2` | اطلاعات فنی | دادهٔ ساختاریافته برای جست‌وجو و مقایسهٔ اولیه |
| `DATA_3` | دادهٔ طراحی | اطلاعات و مدارک کامل‌تر برای بررسی در طراحی |

سطح DataLevel **تأیید فنی BIM، تضمین فروش، انطباق همه‌جانبه یا کیفیت محصول نیست**.

---

## ۶. نسخه‌بندی BIM و لاگ تغییرات

### سیاست فایل BIM

1. هر فایل منتشرشده با `id`، `version`، `revision` و `checksumSha256` ثبت می‌شود.
2. جایگزینی فایل منتشرشده ممنوع است؛ یک فایل جدید با `supersedesFileId` ساخته می‌شود.
3. نسخهٔ semantic (`major.minor.patch`) توصیه می‌شود:
   - `major`: تغییر ناسازگار در Family، پارامترهای کلیدی یا ساختار؛
   - `minor`: ویژگی/واریانت یا اطلاعات سازگار جدید؛
   - `patch`: اصلاح کوچک، لینک، پیش‌نمایش یا متادیتای بدون تغییر رفتار.
4. آخرین نسخهٔ منتشرشده در صفحهٔ محصول نمایش داده می‌شود؛ نسخهٔ قدیمی آرشیو می‌شود، اما برای Audit حفظ می‌شود.
5. هر انتشار فایل نیازمند یک Change Log و تصمیم بررسی مستقل است.

### Product Change Log

هر رویداد append-only است و حداقل این اطلاعات را دارد:

```json
{
  "id": "chg_...",
  "productId": "prd_...",
  "actorId": "usr_...",
  "actorRole": "brand",
  "action": "updated",
  "occurredAt": "2026-08-08T10:30:00Z",
  "summary": "...",
  "before": {},
  "after": {}
}
```

---

## ۷. خطا و اعتبارسنجی

فرمت خطا:

```json
{
  "error": {
    "code": "ATTRIBUTE_SOURCE_REQUIRED",
    "message": "A source is required for thermal_transmittance.",
    "field": "attributes[thermal_transmittance]"
  },
  "meta": { "requestId": "req_...", "generatedAt": "..." }
}
```

کدهای پایه:

- `UNAUTHENTICATED`
- `FORBIDDEN_BRAND_SCOPE`
- `CATEGORY_NOT_FOUND`
- `ATTRIBUTE_KEY_NOT_ALLOWED`
- `ATTRIBUTE_VALUE_INVALID`
- `ATTRIBUTE_SOURCE_REQUIRED`
- `PRODUCT_NOT_FOUND`
- `INVALID_STATUS_TRANSITION`
- `BIM_FILE_IMMUTABLE`
- `REVIEW_REQUIRED`
- `VERSION_CONFLICT`

---

## ۸. مسئولیت‌های یکپارچه‌سازی رضا

1. این سند و `src/lib/catalog/apiContract.ts` را مبنای endpointها قرار دهد.
2. قبل از اتصال UI، پاسخ `GET /catalog/categories` را با ۱۰/۱۰۰ ساختار موجود تطبیق دهد.
3. کنترل مالکیت برند، اعتبار Attribute key و وضعیت انتشار را در سرور اعمال کند؛ به UI اعتماد نکند.
4. لینک فایل را با ذخیره‌سازی امن یا URL امضاشده ارائه کند، نه مسیر فایل خام.
5. مهاجرت داده‌های قبلی/Mock را به دادهٔ عمومی خودکار انجام ندهد.
6. در اولین اتصال، فقط دادهٔ واقعی و مجاز یک یا دو برند را در محیط staging بررسی کند.
