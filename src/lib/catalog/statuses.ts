import type { BimAvailability, DataLevel, DataLevelLabel, ProductionStatus, PublicationStatus } from './types';

export const DATA_LEVELS: Record<DataLevel, { label: DataLevelLabel; titleFa: string; titleEn: string; color: string }> = {
  DATA_1: { label: 'basic_information', titleFa: 'اطلاعات پایه', titleEn: 'Basic information', color: '#64748B' },
  DATA_2: { label: 'technical_information', titleFa: 'اطلاعات فنی', titleEn: 'Technical information', color: '#0F3D5E' },
  DATA_3: { label: 'design_data', titleFa: 'دادهٔ طراحی', titleEn: 'Design data', color: '#087F7A' },
};

export const PRODUCTION_STATUSES: Record<ProductionStatus, string> = {
  active: 'فعال', made_to_order: 'سفارشی', discontinued: 'متوقف‌شده', unknown: 'اعلام نشده',
};
export const BIM_AVAILABILITY_STATUSES: Record<BimAvailability, string> = {
  not_available: 'فایل BIM موجود نیست', in_preparation: 'فایل BIM در حال آماده‌سازی است', available: 'فایل BIM موجود است', pending_review: 'فایل BIM در انتظار بررسی است', published: 'فایل BIM منتشرشده است', archived: 'فایل BIM آرشیو شده است',
};
export const PUBLICATION_STATUSES: Record<PublicationStatus, string> = {
  draft: 'پیش‌نویس', pending_review: 'در انتظار بررسی', needs_revision: 'نیازمند اصلاح', publishable: 'قابل انتشار', published: 'منتشرشده', archived: 'آرشیو',
};
