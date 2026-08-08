# قرارداد فرانت‌اند تاکسونومی و متادیتای ایران‌بیم‌هاب

**وضعیت:** مرحلهٔ یک تکمیل شده — فقط فرانت‌اند و دادهٔ محلی  
**نسخه:** ۰٫۱  
**منبع حاکمیت داده:** `IranBIMhub_Metadata_Schema_Full_Taxonomy_v0.1.xlsx`

## خروجی‌های کد

| فایل | نقش |
|---|---|
| `src/lib/catalog/types.ts` | قرارداد TypeScript برای Category، Product، ProductVariant، AttributeDefinition، AttributeValue، BimFile و DataLevel |
| `src/lib/catalog/taxonomy.ts` | ۱۰ دستهٔ سطح اول و ۱۰۰ دستهٔ سطح دوم با slug پایدار |
| `src/lib/catalog/attributeRegistry.ts` | ۲۷۱ ویژگی تخصصی مرجع با کلید انگلیسی `snake_case` |
| `src/lib/catalog/categoryAttributeRules.ts` | ۹۲۲ نگاشت ویژگی به دسته؛ شامل اولویت، Scope، وزن، قابلیت فیلتر/مقایسه و الزام منبع |
| `src/lib/catalog/statuses.ts` | وضعیت‌های تولید، BIM، انتشار و Badge سطح داده |
| `src/lib/catalog/dataLevel.ts` | محاسبهٔ محلی و شفاف Badge، بدون ادعای بررسی فنی |
| `src/lib/catalog/sampleCatalog.ts` | یک محصول صرفاً نمونه و غیرعمومی؛ بدون برند، فایل یا ادعای واقعی |

## مرز قطعی مرحلهٔ یک

- هیچ API، دیتابیس، فرم ارسال، دانلود، کنترل دسترسی یا بک‌اند جدیدی ساخته نشده است.
- نمونهٔ محلی، محصول واقعی یا قابل‌دانلود نیست و `isSample: true` و `publicationStatus: 'draft'` دارد.
- تا مرحلهٔ دو، این پیکربندی جایگزین مستقیم داده‌ها و فیلترهای قدیمی صفحهٔ کتابخانه نشده است؛ این کار باید با بازطراحی کنترل‌شدهٔ UI انجام شود.
- وضعیت BIM مستقل از Badge سطح داده است. `DATA_3` به‌معنای تأیید فنی فایل BIM یا تأیید استاندارد نیست.

## الگوی استفاده

```ts
import {
  PRODUCT_CATEGORIES,
  CATEGORY_ATTRIBUTE_RULES,
  SAMPLE_CATALOG_PRODUCTS,
  assessDataLevel,
} from './lib/catalog';

const product = SAMPLE_CATALOG_PRODUCTS[0];
const assessment = assessDataLevel(product, CATEGORY_ATTRIBUTE_RULES);
```

## قواعد نگهداری

1. `attribute_key` منتشرشده تغییر نام نمی‌گیرد؛ در صورت نیاز Alias و نسخه‌بندی اضافه می‌شود.
2. مقدار عددی و واحد جدا ثبت می‌شوند؛ برای بازه از `min` و `max` استفاده می‌شود.
3. مقدار `unknown` با `not_applicable` متفاوت است.
4. ویژگی‌های عملکردی که در Rule آن‌ها `evidenceRequired: true` است، بدون منبع معتبر امتیاز کامل نمی‌گیرند.
5. پیش از فعال‌سازی فیلتر عمومی هر دسته، واژگان کنترل‌شده و واحدهای آن دسته باید توسط متخصص همان حوزه تأیید شوند.
