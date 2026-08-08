import type { Product } from './types';

/**
 * Explicitly non-public sample. It validates the front-end contract without
 * suggesting that a real brand, product, BIM file or certification exists.
 */
export const SAMPLE_CATALOG_PRODUCTS: Product[] = [
  {
    id: 'sample-window-metadata-001',
    isSample: true,
    title: { fa: 'نمونهٔ ساختار داده — پنجرهٔ آلومینیومی', en: 'Metadata sample — aluminium window' },
    shortDescription: {
      fa: 'محصول نمونه برای آزمایش ساختار متادیتا، واریانت، مدرک و وضعیت BIM؛ این محصول برای انتشار عمومی یا دانلود نیست.',
      en: 'A non-public sample used to validate metadata, variants, documents and BIM status. It is not available for public download.'
    },
    manufacturer: { id: 'sample-brand-window', name: { fa: 'برند نمونهٔ ساختار داده', en: 'Metadata structure sample brand' }, isSample: true },
    categoryId: 'windows',
    family: 'نمونهٔ سری پنجره',
    modelNumber: 'SAMPLE-WIN-001',
    productionStatus: 'active',
    publicationStatus: 'draft',
    updatedAt: '2026-08-08',
    keywords: { fa: 'پنجره، آلومینیوم، نمونهٔ متادیتا', en: 'window, aluminium, metadata sample' },
    sources: [
      { id: 'sample-datasheet', kind: 'sample', title: 'دیتاشیت نمونهٔ داخلی — فقط برای آزمون مدل داده' }
    ],
    documents: [
      { id: 'sample-image', type: 'image', title: { fa: 'تصویر جای‌نگهدار نمونه', en: 'Sample placeholder image' }, isSample: true },
      { id: 'sample-datasheet-document', type: 'datasheet', title: { fa: 'دیتاشیت نمونهٔ داخلی', en: 'Internal sample datasheet' }, sourceId: 'sample-datasheet', isSample: true },
      { id: 'sample-installation-document', type: 'installation_guide', title: { fa: 'راهنمای نصب نمونهٔ داخلی', en: 'Internal sample installation guide' }, sourceId: 'sample-datasheet', isSample: true }
    ],
    bimAvailability: 'in_preparation',
    bimFiles: [],
    attributes: [
      { attributeKey: 'frame_material', applicability: 'applicable', value: 'aluminium', sourceId: 'sample-datasheet', updatedAt: '2026-08-08' },
      { attributeKey: 'opening_type', applicability: 'applicable', value: 'sliding', sourceId: 'sample-datasheet', updatedAt: '2026-08-08' },
      { attributeKey: 'glazing_type', applicability: 'applicable', value: 'double_glazing', sourceId: 'sample-datasheet', updatedAt: '2026-08-08' },
      { attributeKey: 'number_of_glazing_layers', applicability: 'applicable', value: 2, sourceId: 'sample-datasheet', updatedAt: '2026-08-08' },
      { attributeKey: 'thermal_transmittance', applicability: 'applicable', value: 2.1, unit: 'W/m²K', sourceId: 'sample-datasheet', updatedAt: '2026-08-08' },
      { attributeKey: 'acoustic_performance', applicability: 'unknown' }
    ],
    variants: [
      {
        id: 'sample-window-metadata-001-1800x1500',
        sku: 'SAMPLE-WIN-1800-1500',
        label: { fa: 'نمونهٔ ۱۸۰۰ × ۱۵۰۰ میلی‌متر', en: 'Sample 1800 × 1500 mm' },
        status: 'active',
        attributes: [
          { attributeKey: 'dimensions', applicability: 'applicable', value: 1800, unit: 'mm', sourceId: 'sample-datasheet' },
          { attributeKey: 'colour', applicability: 'applicable', value: 'sample-grey', sourceId: 'sample-datasheet' }
        ]
      }
    ]
  }
];
