import React, { useMemo } from 'react';
import {
  ArrowLeft, ArrowRight, ArrowUpDown, Bath, Boxes, Building2, ChevronLeft,
  ChevronRight, DoorOpen, Layers3, Lightbulb, Paintbrush, Sofa, Wind, Zap,
  SearchX,
} from 'lucide-react';
import { EmptyState } from '../ui/EmptyState';
import { CatalogSearchPanel } from './CatalogSearchPanel';
import { PRODUCT_CATEGORIES } from '../../lib/catalog';
import type { Category } from '../../lib/catalog';
import { useLanguage } from '../LanguageContext';

interface CatalogLibraryViewProps {
  categorySlug?: string;
  subcategorySlug?: string;
  onNavigateLibrary: (categorySlug?: string, subcategorySlug?: string) => void;
  onNavigate: (view: string) => void;
}

const iconByCategory: Record<string, React.ComponentType<{ className?: string }>> = {
  'doors-windows-openings': DoorOpen,
  'facade-envelope-materials': Layers3,
  'floors-walls-ceilings-finishes': Paintbrush,
  'sanitary-plumbing': Bath,
  'heating-cooling-ventilation': Wind,
  'electrical-safety-smart-building': Zap,
  lighting: Lightbulb,
  'kitchen-furniture-interior-equipment': Sofa,
  'structure-building-elements': Building2,
  'vertical-transportation-circulation': ArrowUpDown,
};

const l1Categories = PRODUCT_CATEGORIES.filter((category) => category.level === 1);
const getChildren = (parentId: string) => PRODUCT_CATEGORIES.filter((category) => category.parentId === parentId);

const CategoryIcon: React.FC<{ categoryId: string; className?: string }> = ({ categoryId, className }) => {
  const Icon = iconByCategory[categoryId] || Boxes;
  return <Icon className={className} />;
};

export const CatalogLibraryView: React.FC<CatalogLibraryViewProps> = ({
  categorySlug,
  subcategorySlug,
  onNavigateLibrary,
  onNavigate,
}) => {
  const { isRtl } = useLanguage();
  const selectedCategory = useMemo(
    () => l1Categories.find((category) => category.slug === categorySlug),
    [categorySlug],
  );
  const selectedSubcategory = useMemo(
    () => selectedCategory && getChildren(selectedCategory.id).find((category) => category.slug === subcategorySlug),
    [selectedCategory, subcategorySlug],
  );
  const Arrow = isRtl ? ArrowLeft : ArrowRight;
  const Back = isRtl ? ChevronRight : ChevronLeft;

  const breadcrumb = (
    <nav aria-label={isRtl ? 'مسیر صفحه' : 'Breadcrumb'} className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
      <button type="button" onClick={() => onNavigate('home')} className="hover:text-[#087F7A] transition-colors cursor-pointer">
        {isRtl ? 'صفحهٔ اصلی' : 'Home'}
      </button>
      <span className="text-slate-300">/</span>
      <button type="button" onClick={() => onNavigateLibrary()} className="hover:text-[#087F7A] transition-colors cursor-pointer">
        {isRtl ? 'کتابخانهٔ محصولات' : 'Product library'}
      </button>
      {selectedCategory && <><span className="text-slate-300">/</span><button type="button" onClick={() => onNavigateLibrary(selectedCategory.slug)} className="hover:text-[#087F7A] transition-colors cursor-pointer">{isRtl ? selectedCategory.label.fa : selectedCategory.label.en}</button></>}
      {selectedSubcategory && <><span className="text-slate-300">/</span><span className="font-bold text-slate-700 dark:text-slate-200">{isRtl ? selectedSubcategory.label.fa : selectedSubcategory.label.en}</span></>}
    </nav>
  );

  if (categorySlug && !selectedCategory) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {breadcrumb}
        <div className="mt-6"><EmptyState icon={SearchX} title={isRtl ? 'دستهٔ درخواستی پیدا نشد' : 'Category not found'} description={isRtl ? 'مسیر این دسته در کتابخانهٔ فعلی ایران‌بیم‌هاب وجود ندارد.' : 'This category path is not available in the current IranBIMhub library.'} actionLabel={isRtl ? 'مشاهدهٔ کتابخانه' : 'Browse library'} onAction={() => onNavigateLibrary()} /></div>
      </div>
    );
  }

  if (selectedSubcategory) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {breadcrumb}
        <section className="mt-7 overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-[#F8FAFC] via-white to-[#EAF7F6] dark:from-slate-950 dark:via-slate-900 dark:to-[#064E4B]/20 p-6 sm:p-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#0FB9B1]/25 bg-[#0FB9B1]/10 px-3 py-1.5 text-[11px] font-extrabold text-[#087F7A] dark:text-[#5EEAD4]">
              <CategoryIcon categoryId={selectedCategory.id} className="w-3.5 h-3.5" />
              <span>{isRtl ? selectedCategory.label.fa : selectedCategory.label.en}</span>
            </div>
            <h1 className="mt-5 text-2xl sm:text-4xl font-black tracking-tight text-[#0F3D5E] dark:text-white">{isRtl ? selectedSubcategory.label.fa : selectedSubcategory.label.en}</h1>
            <p className="mt-4 max-w-2xl text-sm sm:text-base leading-8 text-slate-600 dark:text-slate-300">
              {isRtl ? 'این صفحه مسیر تخصصی این خانوادهٔ محصول در کتابخانهٔ ایران‌بیم‌هاب است. با ورود اطلاعات و محصولات واقعی، مشخصات ساختاریافته و فایل‌های مرتبط همین‌جا نمایش داده می‌شوند.' : 'This is the specialist library path for this product family. Structured product information and related files will appear here as real products are published.'}
            </p>
            <button type="button" onClick={() => onNavigateLibrary(selectedCategory.slug)} className="mt-6 inline-flex items-center gap-1.5 text-xs font-extrabold text-[#087F7A] hover:text-[#064E4B] transition-colors cursor-pointer">
              <Back className="w-4 h-4" />
              {isRtl ? `بازگشت به ${selectedCategory.label.fa}` : `Back to ${selectedCategory.label.en}`}
            </button>
          </div>
        </section>
        <section className="mt-8">
          <CatalogSearchPanel
            categoryId={selectedSubcategory.id}
            categoryLabels={[selectedCategory.label, selectedSubcategory.label]}
            onRequest={() => onNavigate('modeler-dashboard')}
          />
        </section>
      </div>
    );
  }

  if (selectedCategory) {
    const children = getChildren(selectedCategory.id);
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {breadcrumb}
        <section className="mt-7 rounded-3xl bg-[#0F3D5E] p-6 sm:p-10 text-white overflow-hidden relative">
          <div className="absolute -top-20 -left-16 h-52 w-52 rounded-full bg-[#0FB9B1]/20 blur-3xl" />
          <div className="relative max-w-3xl">
            <div className="flex items-center gap-3 text-[#99F6E4]"><CategoryIcon categoryId={selectedCategory.id} className="w-6 h-6" /><span className="text-xs font-extrabold tracking-wide">{isRtl ? 'خانوادهٔ محصول' : 'Product family'}</span></div>
            <h1 className="mt-4 text-2xl sm:text-4xl font-black">{isRtl ? selectedCategory.label.fa : selectedCategory.label.en}</h1>
            <p className="mt-4 text-sm sm:text-base leading-8 text-slate-200">{isRtl ? 'یک زیر‌دسته را انتخاب کنید. جزئیات محصول در مرحلهٔ بعد با فیلترهای تخصصی ارائه می‌شود؛ این منو بیش از دو سطح ندارد.' : 'Choose a subcategory. Product detail will be refined with specialist filters in the next step; this navigation has no third level.'}</p>
          </div>
        </section>
        <section className="mt-8" aria-label={isRtl ? 'زیر‌دسته‌ها' : 'Subcategories'}>
          <div className="mb-4 flex items-center justify-between"><h2 className="text-base font-black text-slate-800 dark:text-white">{isRtl ? 'زیر‌دسته‌ها' : 'Subcategories'}</h2><span className="text-xs text-slate-500">{children.length} {isRtl ? 'مسیر تخصصی' : 'specialist paths'}</span></div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {children.map((child) => <SubcategoryCard key={child.id} category={child} onClick={() => onNavigateLibrary(selectedCategory.slug, child.slug)} isRtl={isRtl} />)}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {breadcrumb}
      <section className="mt-7 rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-[#F8FAFC] via-white to-[#E8F7F5] dark:from-slate-950 dark:via-slate-900 dark:to-[#064E4B]/20 p-6 sm:p-10">
        <div className="max-w-3xl"><span className="inline-flex items-center gap-2 rounded-full bg-[#0F3D5E] px-3 py-1.5 text-[11px] font-extrabold text-white"><Boxes className="w-3.5 h-3.5" />{isRtl ? 'کتابخانهٔ ساختاریافتهٔ محصول' : 'Structured product library'}</span><h1 className="mt-5 text-3xl sm:text-5xl font-black tracking-tight text-[#0F3D5E] dark:text-white">{isRtl ? 'دسته‌بندی محصولات ساختمانی' : 'Building product categories'}</h1><p className="mt-4 max-w-2xl text-sm sm:text-base leading-8 text-slate-600 dark:text-slate-300">{isRtl ? 'برای شروع، خانوادهٔ محصول را انتخاب کنید. سپس با یک انتخاب دیگر به مسیر تخصصی محصول می‌رسید. جزئیات هر محصول در ادامه با داده‌های واقعی، مستندات و فیلترهای مرتبط تکمیل می‌شود.' : 'Start by choosing a product family. One further choice takes you to its specialist path. Product details will be added with real data, documents and relevant filters.'}</p></div>
      </section>
      <section className="mt-9"><div className="mb-5"><h2 className="text-lg font-black text-slate-800 dark:text-white">{isRtl ? 'خانواده‌های اصلی' : 'Main product families'}</h2><p className="mt-1 text-xs leading-6 text-slate-500 dark:text-slate-400">{isRtl ? '۱۰ خانوادهٔ اصلی؛ هر خانواده فقط یک سطح زیر‌دسته دارد.' : 'Ten main families; each has only one subcategory level.'}</p></div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{l1Categories.map((category) => <FamilyCard key={category.id} category={category} onClick={() => onNavigateLibrary(category.slug)} isRtl={isRtl} />)}</div></section>
    </div>
  );
};

const FamilyCard: React.FC<{ category: Category; onClick: () => void; isRtl: boolean }> = ({ category, onClick, isRtl }) => {
  const Arrow = isRtl ? ArrowLeft : ArrowRight;
  return <button type="button" onClick={onClick} className="group min-h-45 rounded-2xl border border-slate-200 bg-white p-5 text-start shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#0FB9B1]/50 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 cursor-pointer"><div className="flex items-start justify-between gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0F3D5E]/8 text-[#0F3D5E] dark:bg-[#0FB9B1]/10 dark:text-[#5EEAD4]"><CategoryIcon categoryId={category.id} className="w-5 h-5" /></div><Arrow className="mt-1 w-4 h-4 text-slate-300 transition-transform group-hover:-translate-x-1 group-hover:text-[#087F7A] rtl:group-hover:translate-x-1" /></div><h3 className="mt-5 text-sm font-black leading-7 text-slate-800 dark:text-white">{isRtl ? category.label.fa : category.label.en}</h3><p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">{category.childIds.length} {isRtl ? 'زیر‌دستهٔ تخصصی' : 'specialist subcategories'}</p></button>;
};
const SubcategoryCard: React.FC<{ category: Category; onClick: () => void; isRtl: boolean }> = ({ category, onClick, isRtl }) => { const Arrow = isRtl ? ArrowLeft : ArrowRight; return <button type="button" onClick={onClick} className="group flex min-h-20 items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 text-start transition-all hover:border-[#0FB9B1]/45 hover:bg-[#0FB9B1]/4 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-[#0FB9B1]/8 cursor-pointer"><span className="text-sm font-bold leading-6 text-slate-700 dark:text-slate-100">{isRtl ? category.label.fa : category.label.en}</span><Arrow className="w-4 h-4 shrink-0 text-slate-300 transition-transform group-hover:-translate-x-1 group-hover:text-[#087F7A] rtl:group-hover:translate-x-1" /></button>; };
