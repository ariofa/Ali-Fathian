import React, { useMemo } from 'react';
import { ArrowLeft, ArrowRight, BadgeInfo, CheckCircle2, CircleDashed, FileCheck2, FileText, Layers3, ListChecks, ShieldCheck, Sparkles } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { assessDataLevel, CATEGORY_ATTRIBUTE_RULES, DATA_LEVELS, getCompletionTasks, PRODUCT_CATEGORIES } from '../../lib/catalog';
import type { CompletionTaskGroup, DataLevel, Product } from '../../lib/catalog';

interface ProductDataCompletionPanelProps {
  product: Product;
  preview?: boolean;
  onBack: () => void;
}

export const ProductDataCompletionPanel: React.FC<ProductDataCompletionPanelProps> = ({ product, preview = false, onBack }) => {
  const { isRtl } = useLanguage();
  const assessment = useMemo(() => assessDataLevel(product, CATEGORY_ATTRIBUTE_RULES), [product]);
  const rules = useMemo(() => CATEGORY_ATTRIBUTE_RULES.filter(rule => rule.categoryId === product.categoryId), [product.categoryId]);
  const tasks = useMemo(() => getCompletionTasks(product), [product]);
  const incomplete = tasks.filter(task => !task.complete);
  const level = DATA_LEVELS[assessment.level];
  const nextLevel: DataLevel | null = assessment.level === 'DATA_1' ? 'DATA_2' : assessment.level === 'DATA_2' ? 'DATA_3' : null;
  const Arrow = isRtl ? ArrowLeft : ArrowRight;
  const groups: { id: CompletionTaskGroup; titleFa: string; titleEn: string; descriptionFa: string }[] = [
    { id: 'required', titleFa: 'موارد ضروری', titleEn: 'Required items', descriptionFa: 'برای رسیدن به سطح بعد، این موارد باید تکمیل شوند.' },
    { id: 'supplementary', titleFa: 'موارد تکمیلی', titleEn: 'Supporting items', descriptionFa: 'این موارد کیفیت و قابلیت استفادهٔ اطلاعات را بالاتر می‌برند.' },
    { id: 'category', titleFa: 'ویژگی‌های وابسته به دسته', titleEn: 'Category-specific properties', descriptionFa: 'این موارد فقط به خانوادهٔ محصول شما مربوط‌اند.' },
  ];
  const category = PRODUCT_CATEGORIES.find(item => item.id === product.categoryId);

  return <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
    <button type="button" onClick={onBack} className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#087F7A] transition-colors cursor-pointer"><Arrow className="h-4 w-4" />{isRtl ? 'بازگشت به پیش‌نمایش محصول' : 'Back to product preview'}</button>
    {preview && <div className="mt-5 rounded-xl border border-[#D6A01D]/40 bg-[#FFF8E6] px-4 py-3 text-xs leading-6 text-[#5C4610]"><strong>نمایش داخلی پنل برند:</strong> این صفحه یک نمونهٔ صریح و غیرعمومی از مسیر تکمیل داده است؛ هیچ محصول یا برند واقعی را نشان نمی‌دهد.</div>}

    <header className="mt-6 rounded-3xl bg-[#0F3D5E] p-6 sm:p-9 text-white overflow-hidden relative"><div className="absolute -top-20 -left-16 h-56 w-56 rounded-full bg-[#0FB9B1]/20 blur-3xl" /><div className="relative max-w-3xl"><div className="flex items-center gap-2 text-[#99F6E4]"><Sparkles className="w-4 h-4" /><span className="text-xs font-black">{isRtl ? 'مسیر تکمیل اطلاعات محصول' : 'Product information completion path'}</span></div><h1 className="mt-4 text-2xl sm:text-4xl font-black">{isRtl ? product.title.fa : product.title.en}</h1><p className="mt-3 text-sm leading-7 text-slate-200">{isRtl ? `${category?.label.fa || 'این دسته'} · ${product.modelNumber ? `مدل ${product.modelNumber}` : 'مدل اعلام نشده'}` : `${category?.label.en || 'This category'} · ${product.modelNumber ? `Model ${product.modelNumber}` : 'Model not declared'}`}</p></div></header>

    <section className="mt-7 grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-bold text-slate-500">{isRtl ? 'سطح فعلی محصول' : 'Current product level'}</p><div className="mt-2 flex items-center gap-2" style={{ color: level.color }}><Layers3 className="w-5 h-5" /><h2 className="text-lg font-black">{isRtl ? level.titleFa : level.titleEn}</h2></div><p className="mt-2 max-w-xl text-xs leading-6 text-slate-500 dark:text-slate-400">{assessment.level === 'DATA_1' ? (isRtl ? 'محصول معرفی شده است و برای دیده‌شدن در مسیر جست‌وجوی اولیه آماده است.' : 'The product is identified and ready for initial discovery.') : assessment.level === 'DATA_2' ? (isRtl ? 'مشخصات کلیدی ثبت شده‌اند و محصول می‌تواند در فیلترها و مقایسهٔ اولیه دیده شود.' : 'Key properties are structured for filtering and initial comparison.') : (isRtl ? 'اطلاعات و مستندات محصول برای بررسی آگاهانه‌تر در طراحی کامل‌تر شده‌اند.' : 'Product information and documents are more complete for informed design review.')}</p></div><div className="rounded-xl bg-slate-50 px-4 py-3 text-center dark:bg-slate-950"><p className="text-2xl font-black text-[#0F3D5E] dark:text-[#5EEAD4]">{assessment.completionPercent}٪</p><p className="mt-1 text-[10px] font-bold text-slate-500">{isRtl ? 'پوشش دادهٔ مرتبط' : 'Relevant data coverage'}</p></div></div></div>
      <aside className="rounded-2xl border border-[#0FB9B1]/25 bg-[#EAF7F6] p-5 dark:bg-[#064E4B]/20"><p className="text-xs font-black text-[#064E4B] dark:text-[#99F6E4]">{nextLevel ? (isRtl ? 'هدف بعدی' : 'Next target') : (isRtl ? 'وضعیت تکمیل' : 'Completion status')}</p><h2 className="mt-2 text-base font-black text-[#0F3D5E] dark:text-white">{nextLevel ? (isRtl ? DATA_LEVELS[nextLevel].titleFa : DATA_LEVELS[nextLevel].titleEn) : (isRtl ? 'دادهٔ طراحی تکمیل شده' : 'Design data completed')}</h2><p className="mt-2 text-xs leading-6 text-slate-600 dark:text-slate-300">{nextLevel ? (isRtl ? `${incomplete.length} مورد برای رسیدن به سطح بعد باقی مانده است.` : `${incomplete.length} items remain before the next level.`) : (isRtl ? 'در صورت تغییر محصول یا مستندات، اطلاعات را به‌روزرسانی کنید.' : 'Update the information when the product or documents change.')}</p></aside>
    </section>

    <section className="mt-8 space-y-5">{groups.map(group => { const entries = tasks.filter(task => task.group === group.id); if (!entries.length) return null; return <div key={group.id} className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900"><div className="flex items-start gap-3"><ListChecks className="mt-0.5 h-5 w-5 text-[#087F7A]" /><div><h2 className="text-base font-black text-slate-800 dark:text-white">{isRtl ? group.titleFa : group.titleEn}</h2><p className="mt-1 text-xs leading-6 text-slate-500 dark:text-slate-400">{group.descriptionFa}</p></div></div><div className="mt-5 space-y-2">{entries.map(task => <div key={task.id} className={`flex items-start gap-3 rounded-xl border p-3.5 ${task.complete ? 'border-[#0FB9B1]/20 bg-[#0FB9B1]/5' : 'border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950/50'}`} >{task.complete ? <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-[#087F7A]" /> : <CircleDashed className="mt-0.5 h-4.5 w-4.5 shrink-0 text-[#D6A01D]" />}<div className="min-w-0 flex-1"><p className="text-xs font-black text-slate-700 dark:text-slate-200">{isRtl ? task.titleFa : task.titleEn}</p><p className="mt-1 text-[11px] leading-5 text-slate-500 dark:text-slate-400">{task.complete ? (isRtl ? 'ثبت شده است.' : 'Recorded.') : task.descriptionFa}</p></div><span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold ${task.complete ? 'bg-[#087F7A] text-white' : 'bg-[#D6A01D]/15 text-[#6B5010]'}`}>{task.complete ? (isRtl ? 'تکمیل' : 'Done') : (isRtl ? 'نیازمند تکمیل' : 'To do')}</span></div>)}</div></div>})}</section>

    <section className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950"><div className="flex items-start gap-3"><BadgeInfo className="mt-0.5 h-5 w-5 text-[#0F3D5E] dark:text-[#5EEAD4]" /><div><h2 className="text-sm font-black text-slate-800 dark:text-white">{isRtl ? 'این سطح چه معنایی دارد؟' : 'What this level means'}</h2><p className="mt-2 text-xs leading-6 text-slate-600 dark:text-slate-300">{isRtl ? 'سطح داده فقط میزان کامل‌بودن و ساختاریافتگی اطلاعات محصول را بیان می‌کند. این سطح فروش، انتخاب در پروژه، تأیید فنی BIM، انطباق با همهٔ ضوابط یا کیفیت محصول را تضمین نمی‌کند.' : 'The data level only describes the completeness and structure of product information. It does not guarantee sales, project selection, BIM technical approval, code compliance, or product quality.'}</p></div></div></section>
  </div>;
};
