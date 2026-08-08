# یکپارچه‌سازی فیلتر، متادیتا و جست‌وجوی کتابخانه

## منبع واحد داده

تمام مسیرهای زیر اکنون از قرارداد مشترک فرانت‌اند استفاده می‌کنند:

- Taxonomy دو‌سطحی؛
- رجیستری Attribute؛
- Filterهای عمومی و تخصصی؛
- جست‌وجوی Header و جست‌وجوی داخل کتابخانه؛
- کارت آبجکت؛
- صفحهٔ جزئیات و دانلود آبجکت؛
- صفحهٔ محصول مبتنی بر Product metadata.

## سازگاری با دادهٔ قدیمی

`src/lib/catalog/unifiedSearch.ts` داده‌های فعلی `BIMObject.specs` را با کلیدهای متادیتای استاندارد یکسان می‌کند. مثال‌ها:

| کلید قدیمی | کلید متادیتای مرجع |
|---|---|
| `fire_rating` | `fire_resistance` |
| `u_value` | `thermal_transmittance` |
| `color_temp` | `colour_temperature` |
| `wattage` | `power` |
| `lumens` | `luminous_flux` |
| `mounting` | `installation_type` |
| `water_flow` | `water_consumption` |
| `wind_load` | `wind_resistance` |

مقدارهایی مانند «در حال تکمیل»، «اعلام نشده» و `unknown` در Index قابل فیلتر ثبت نمی‌شوند؛ اما در صفحهٔ جزئیات به‌شکل شفاف «اعلام نشده» دیده می‌شوند.

## Filterهای واردشده از Main

فقط منطق و گزینه‌های Filter از شاخهٔ `main` به این نسخه منتقل شده‌اند. این گزینه‌ها در `legacyFilterPresets.ts` قرار دارند و به کلیدهای استاندارد متادیتا نگاشت شده‌اند. هیچ صفحه یا دادهٔ غیرمرتبطی از main منتقل نشده است.

## شرط انتشار دادهٔ واقعی

- Product نمونه با `isSample` وارد جست‌وجوی عمومی نمی‌شود.
- Product با `publicationStatus !== published` وارد نتایج عمومی نمی‌شود.
- Filter با دادهٔ واقعی نتایج واقعی نشان می‌دهد؛ Optionهای پیش‌تنظیم‌شده فقط معیار انتخاب‌اند و تعداد یا محصول ساختگی ایجاد نمی‌کنند.

## تست

```bash
npx tsx scripts/verify-unified-catalog-search.ts
```

این تست نگاشت دادهٔ قدیمی، متادیتای Product، فیلترهای Main، حذف مقدارهای نامشخص و جست‌وجوی فارسی/انگلیسی را بررسی می‌کند.
