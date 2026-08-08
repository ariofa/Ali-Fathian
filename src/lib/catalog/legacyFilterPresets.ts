/**
 * Filter presets ported only from the former `main` branch category filters.
 * They are mapped to the approved two-level taxonomy; they do not alter it.
 * Dynamic values from real objects are merged at runtime in CatalogLibraryView.
 */
export interface SpecialistFilterPreset {
  key: string;
  label: { fa: string; en: string };
  options: { value: string; fa: string; en: string }[];
}

const doorsWindows: SpecialistFilterPreset[] = [
  { key: 'frame_material', label: { fa: 'جنس فریم', en: 'Frame Material' }, options: [
    { value: 'aluminum', fa: 'آلومینیوم', en: 'Aluminium' }, { value: 'upvc', fa: 'uPVC', en: 'uPVC' }, { value: 'wood', fa: 'چوب', en: 'Wood' }, { value: 'steel', fa: 'فولاد', en: 'Steel' },
  ] },
  { key: 'glazing_type', label: { fa: 'نوع شیشه', en: 'Glazing Type' }, options: [
    { value: 'single', fa: 'تک‌جداره', en: 'Single' }, { value: 'double', fa: 'دوجداره', en: 'Double' }, { value: 'triple', fa: 'سه‌جداره', en: 'Triple' }, { value: 'low_e', fa: 'کم‌گسیل Low-E', en: 'Low-E' },
  ] },
  { key: 'fire_resistance', label: { fa: 'مقاومت حریق', en: 'Fire Rating' }, options: [
    { value: '30', fa: '۳۰ دقیقه', en: '30 min' }, { value: '60', fa: '۶۰ دقیقه', en: '60 min' }, { value: '90', fa: '۹۰ دقیقه', en: '90 min' }, { value: '120', fa: '۱۲۰ دقیقه', en: '120 min' },
  ] },
  { key: 'thermal_transmittance', label: { fa: 'ضریب انتقال حرارت', en: 'U-Value' }, options: [
    { value: 'high', fa: 'بسیار عایق', en: 'Highly insulated' }, { value: 'medium', fa: 'متوسط', en: 'Medium' }, { value: 'low', fa: 'معمولی', en: 'Standard' },
  ] },
];
const materialsFacade: SpecialistFilterPreset[] = [
  { key: 'material', label: { fa: 'نوع ماده', en: 'Material Type' }, options: [
    { value: 'brick', fa: 'آجر نسوز', en: 'Refractory brick' }, { value: 'stone', fa: 'سنگ طبیعی', en: 'Natural stone' }, { value: 'fiber_cement', fa: 'فایبر سمنت', en: 'Fibre cement' }, { value: 'rockwool', fa: 'پشم سنگ', en: 'Rockwool' },
  ] },
  { key: 'thermal_conductivity', label: { fa: 'رسانایی حرارتی', en: 'Thermal Conductivity' }, options: [
    { value: 'low', fa: 'پایین / عایق عالی', en: 'Low / high insulation' }, { value: 'standard', fa: 'استاندارد', en: 'Standard' },
  ] },
  { key: 'wind_resistance', label: { fa: 'مقاومت در برابر باد', en: 'Wind Load' }, options: [
    { value: 'low', fa: 'کم', en: 'Low' }, { value: 'medium', fa: 'متوسط', en: 'Medium' }, { value: 'high', fa: 'زیاد', en: 'High' },
  ] },
];
const sanitary: SpecialistFilterPreset[] = [
  { key: 'installation_type', label: { fa: 'نوع نصب', en: 'Mounting Type' }, options: [
    { value: 'wall_hung', fa: 'دیواری / وال‌هنگ', en: 'Wall-hung' }, { value: 'floor_standing', fa: 'زمینی', en: 'Floor-standing' },
  ] },
  { key: 'water_consumption', label: { fa: 'میزان مصرف آب', en: 'Water Flow Rate' }, options: [
    { value: 'eco', fa: 'کاهندهٔ مصرف', en: 'Eco' }, { value: 'standard', fa: 'استاندارد', en: 'Standard' },
  ] },
];
const finishes: SpecialistFilterPreset[] = [
  { key: 'slip_resistance', label: { fa: 'مقاومت به لغزش', en: 'Slip Resistance' }, options: [
    { value: 'r9', fa: 'R9', en: 'R9' }, { value: 'r10', fa: 'R10', en: 'R10' }, { value: 'r11', fa: 'R11', en: 'R11' },
  ] },
  { key: 'tile_finish', label: { fa: 'نوع لعاب یا پوشش', en: 'Finish Type' }, options: [
    { value: 'polish', fa: 'سوپر پولیش', en: 'Super polish' }, { value: 'matte', fa: 'مات', en: 'Matte' }, { value: 'semi_polished', fa: 'نیمه‌مات / لَپاتو', en: 'Lappato' },
  ] },
];
const lighting: SpecialistFilterPreset[] = [
  { key: 'colour_temperature', label: { fa: 'دمای رنگ', en: 'Colour Temperature' }, options: [
    { value: '3000', fa: 'آفتابی ۳۰۰۰K', en: 'Warm 3000K' }, { value: '4000', fa: 'طبیعی ۴۰۰۰K', en: 'Neutral 4000K' }, { value: '6500', fa: 'مهتابی ۶۵۰۰K', en: 'Daylight 6500K' },
  ] },
  { key: 'ip_rating', label: { fa: 'درجهٔ حفاظت IP', en: 'IP Rating' }, options: [
    { value: 'ip20', fa: 'IP20', en: 'IP20' }, { value: 'ip44', fa: 'IP44', en: 'IP44' }, { value: 'ip65', fa: 'IP65/IP66', en: 'IP65/IP66' },
  ] },
];
const hvac: SpecialistFilterPreset[] = [{ key: 'capacity', label: { fa: 'ظرفیت حرارتی یا برودتی', en: 'Heating/Cooling Capacity' }, options: [
  { value: '24k', fa: '۲۴٬۰۰۰ BTU / 24kW', en: '24,000 BTU / 24kW' }, { value: '32k', fa: '۳۲٬۰۰۰ BTU / 32kW', en: '32,000 BTU / 32kW' }, { value: 'large', fa: 'ظرفیت تجاری بالا', en: 'Large commercial' },
]}];
const plumbing: SpecialistFilterPreset[] = [{ key: 'material', label: { fa: 'جنس لوله یا اتصال', en: 'Pipe / Fitting Material' }, options: [
  { value: 'ppr', fa: 'PPR', en: 'PPR' }, { value: 'pex', fa: 'PEX', en: 'PEX' }, { value: 'copper', fa: 'مس', en: 'Copper' }, { value: 'steel', fa: 'فولاد', en: 'Steel' },
]}];
const structure: SpecialistFilterPreset[] = [{ key: 'steel_grade', label: { fa: 'گرید فولاد', en: 'Steel Grade' }, options: [
  { value: 'st37', fa: 'ST37', en: 'ST37' }, { value: 'st52', fa: 'ST52', en: 'ST52' }, { value: 'other', fa: 'سایر', en: 'Other' },
]}];
const kitchen: SpecialistFilterPreset[] = [{ key: 'countertop_material', label: { fa: 'جنس صفحه یا رویه', en: 'Countertop Material' }, options: [
  { value: 'quartz', fa: 'کوارتز', en: 'Quartz' }, { value: 'corian', fa: 'کورین', en: 'Corian' }, { value: 'granite', fa: 'گرانیت', en: 'Granite' },
]}];
const security: SpecialistFilterPreset[] = [{ key: 'power_supply', label: { fa: 'منبع تغذیه', en: 'Power Source' }, options: [
  { value: 'mains', fa: 'برق شهری', en: 'Mains' }, { value: 'battery', fa: 'باتری', en: 'Battery' }, { value: 'poe', fa: 'PoE', en: 'PoE' },
]}];

export const LEGACY_MAIN_FILTER_PRESETS: Record<string, SpecialistFilterPreset[]> = {
  windows: doorsWindows, 'interior-doors': doorsWindows, 'external-doors': doorsWindows, 'fire-security-doors': doorsWindows, 'opening-glazing': doorsWindows,
  'facade-cladding-systems': materialsFacade, 'curtain-wall-glazing': materialsFacade, 'external-wall-systems': materialsFacade,
  sanitaryware: sanitary, 'faucets-mixers': sanitary, 'showers-baths': sanitary, 'sinks-accessories': sanitary,
  flooring: finishes, 'tiles-ceramics-mosaic': finishes, 'wood-laminate-flooring': finishes, 'wall-finishes': finishes,
  'recessed-lighting': lighting, 'surface-mounted-lighting': lighting, 'linear-lighting': lighting, 'pendant-lighting': lighting, 'outdoor-landscape-lighting': lighting, 'industrial-lighting': lighting,
  'boilers-heating': hvac, 'radiators-underfloor-heating': hvac, 'chillers-heat-pumps': hvac, 'fan-coils-ahus-vrf': hvac, 'ventilation-exhaust-fans': hvac,
  'pipes-fittings': plumbing, 'valves-controls': plumbing, 'pumps-booster-pumps': plumbing,
  'steel-structure': structure, 'beams-columns': structure, 'concrete-structure': structure,
  'kitchen-casework': kitchen, 'kitchen-appliances': kitchen, 'tables-counters': kitchen,
  'security-access-control': security, 'fire-alarm': security, 'fire-suppression': security,
};

export function legacyMainFilterPresetsForCategory(categoryId?: string): SpecialistFilterPreset[] {
  return categoryId ? LEGACY_MAIN_FILTER_PRESETS[categoryId] || [] : [];
}
