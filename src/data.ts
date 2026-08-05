import { Category, Manufacturer, BIMObject } from './types';

export const MANUFACTURERS: Manufacturer[] = [
  {
    id: 'sample-facade', nameFa: 'پروفایل نمونهٔ سیستم‌های نما', nameEn: 'Facade Systems Profile Template', logo: 'FCD',
    descriptionFa: 'نمونه‌ای از ساختار معرفی برند برای تولیدکنندگان در و پنجره، نما و پوشش‌های ساختمانی.',
    descriptionEn: 'A brand-profile structure for façade, window, and building-envelope manufacturers.',
    website: '', email: '', phone: '', verified: false, isSample: true, tier: 'Free'
  },
  {
    id: 'sample-mechanical', nameFa: 'پروفایل نمونهٔ تأسیسات ساختمان', nameEn: 'Building Services Profile Template', logo: 'MEP',
    descriptionFa: 'نمونه‌ای از ساختار اطلاعات برند و محصول برای تجهیزات مکانیکی، برقی و تأسیساتی ساختمان.',
    descriptionEn: 'A brand and product-information structure for mechanical, electrical, and building-services equipment.',
    website: '', email: '', phone: '', verified: false, isSample: true, tier: 'Free'
  },
  {
    id: 'sample-finishes', nameFa: 'پروفایل نمونهٔ مصالح و تکمیل داخلی', nameEn: 'Materials & Finishes Profile Template', logo: 'MAT',
    descriptionFa: 'نمونه‌ای از ساختار معرفی برند برای مصالح، پوشش‌ها، تجهیزات داخلی و محصولات تکمیل ساختمان.',
    descriptionEn: 'A brand-profile structure for materials, finishes, interior equipment, and building-completion products.',
    website: '', email: '', phone: '', verified: false, isSample: true, tier: 'Free'
  }
];

export const CATEGORIES: Category[] = [
  {
    id: 'doors_windows',
    nameFa: 'در و پنجره',
    nameEn: 'Doors & Windows',
    icon: 'DoorOpen',
    subcategories: [
      { id: 'interior_doors', nameFa: 'درهای داخلی', nameEn: 'Interior doors' },
      { id: 'exterior_doors', nameFa: 'درهای ورودی و خارجی', nameEn: 'Exterior/entry doors' },
      { id: 'fire_doors', nameFa: 'درهای ضد حریق', nameEn: 'Fire-rated doors' },
      { id: 'sliding_doors', nameFa: 'درهای کشویی', nameEn: 'Sliding doors' },
      { id: 'windows', nameFa: 'پنجره‌ها', nameEn: 'Windows' },
      { id: 'curtain_walls', nameFa: 'سیستم‌های کرتین‌وال', nameEn: 'Curtain wall systems' }
    ],
    specificFilters: [
      {
        id: 'frame_material',
        labelFa: 'جنس فریم',
        labelEn: 'Frame Material',
        type: 'select',
        options: [
          { value: 'aluminum', labelFa: 'آلومینیوم', labelEn: 'Aluminum' },
          { value: 'upvc', labelFa: 'uPVC', labelEn: 'uPVC' },
          { value: 'wood', labelFa: 'چوب', labelEn: 'Wood' },
          { value: 'steel', labelFa: 'فولاد', labelEn: 'Steel' }
        ]
      },
      {
        id: 'glazing_type',
        labelFa: 'نوع شیشه',
        labelEn: 'Glazing Type',
        type: 'select',
        options: [
          { value: 'single', labelFa: 'تک جداره', labelEn: 'Single' },
          { value: 'double', labelFa: 'دو جداره', labelEn: 'Double' },
          { value: 'triple', labelFa: 'سه جداره', labelEn: 'Triple' },
          { value: 'low_e', labelFa: 'کم‌گسیل Low-E', labelEn: 'Low-E' }
        ]
      },
      {
        id: 'fire_rating',
        labelFa: 'مقاومت در برابر حریق (دقیقه)',
        labelEn: 'Fire Rating (Minutes)',
        type: 'select',
        options: [
          { value: '30', labelFa: '۳۰ دقیقه', labelEn: '30 min' },
          { value: '60', labelFa: '۶۰ دقیقه', labelEn: '60 min' },
          { value: '90', labelFa: '۹۰ دقیقه', labelEn: '90 min' },
          { value: '120', labelFa: '۱۲۰ دقیقه', labelEn: '120 min' }
        ]
      },
      {
        id: 'u_value',
        labelFa: 'ضریب انتقال حرارت (U-Value)',
        labelEn: 'U-Value (Thermal Perf.)',
        type: 'select',
        options: [
          { value: 'high', labelFa: 'بسیار عایق (< 1.2)', labelEn: 'Highly Insulated (< 1.2)' },
          { value: 'medium', labelFa: 'متوسط (1.2 - 2.0)', labelEn: 'Medium (1.2 - 2.0)' },
          { value: 'low', labelFa: 'معمولی (> 2.0)', labelEn: 'Standard (> 2.0)' }
        ]
      }
    ]
  },
  {
    id: 'furniture',
    nameFa: 'مبلمان',
    nameEn: 'Furniture',
    icon: 'Armchair',
    subcategories: [
      { id: 'office_furniture', nameFa: 'مبلمان اداری', nameEn: 'Office furniture' },
      { id: 'residential_furniture', nameFa: 'مبلمان مسکونی', nameEn: 'Residential furniture' },
      { id: 'seating', nameFa: 'صندلی و نشیمن', nameEn: 'Seating' },
      { id: 'tables_desks', nameFa: 'میز و کانتر', nameEn: 'Tables & desks' }
    ],
    specificFilters: [
      {
        id: 'material',
        labelFa: 'جنس اصلی',
        labelEn: 'Material',
        type: 'select',
        options: [
          { value: 'wood', labelFa: 'چوب', labelEn: 'Wood' },
          { value: 'metal', labelFa: 'فلز', labelEn: 'Metal' },
          { value: 'fabric', labelFa: 'پارچه', labelEn: 'Fabric' },
          { value: 'leather', labelFa: 'چرم', labelEn: 'Leather' }
        ]
      },
      {
        id: 'style',
        labelFa: 'سبک طراحی',
        labelEn: 'Style',
        type: 'select',
        options: [
          { value: 'modern', labelFa: 'مدرن', labelEn: 'Modern' },
          { value: 'classic', labelFa: 'کلاسیک', labelEn: 'Classic' },
          { value: 'minimalist', labelFa: 'مینیمال', labelEn: 'Minimalist' }
        ]
      }
    ]
  },
  {
    id: 'materials_facades',
    nameFa: 'مصالح ساختمانی و نما',
    nameEn: 'Building Materials & Facades',
    icon: 'Layers',
    subcategories: [
      { id: 'cladding', nameFa: 'پنل‌های پوشش نما', nameEn: 'Cladding panels' },
      { id: 'insulation', nameFa: 'عایق‌ها', nameEn: 'Insulation' },
      { id: 'masonry', nameFa: 'آجر و بلوک', nameEn: 'Concrete & masonry' },
      { id: 'composite_panels', nameFa: 'کامپوزیت آلومینیوم (ACP)', nameEn: 'Composite panels (ACP)' }
    ],
    specificFilters: [
      {
        id: 'material_type',
        labelFa: 'نوع ماده',
        labelEn: 'Material Type',
        type: 'select',
        options: [
          { value: 'brick', labelFa: 'آجر نسوز', labelEn: 'Refractory Brick' },
          { value: 'stone', labelFa: 'سنگ طبیعی', labelEn: 'Natural Stone' },
          { value: 'fiber_cement', labelFa: 'فایبر سمنت', labelEn: 'Fiber Cement' },
          { value: 'rockwool', labelFa: 'پشم سنگ', labelEn: 'Rockwool' }
        ]
      },
      {
        id: 'thermal_conductivity',
        labelFa: 'رسانایی حرارتی (W/mK)',
        labelEn: 'Thermal Conductivity',
        type: 'select',
        options: [
          { value: 'low', labelFa: 'پایین (عایق عالی)', labelEn: 'Low (Excellent Insulation)' },
          { value: 'standard', labelFa: 'استاندارد', labelEn: 'Standard' }
        ]
      }
    ]
  },
  {
    id: 'bathroom',
    nameFa: 'سرویس بهداشتی و شیرآلات',
    nameEn: 'Bathroom & Sanitaryware',
    icon: 'Bath',
    subcategories: [
      { id: 'toilets', nameFa: 'توالت و فرنگی', nameEn: 'Toilets & bidets' },
      { id: 'sinks', nameFa: 'روشویی و سینک', nameEn: 'Sinks/basins' },
      { id: 'faucets', nameFa: 'شیرآلات و دوش', nameEn: 'Faucets & mixers' },
      { id: 'bathtubs', nameFa: 'وان و جکوزی', nameEn: 'Bathtubs & Jacuzzis' }
    ],
    specificFilters: [
      {
        id: 'mounting',
        labelFa: 'نوع نصب',
        labelEn: 'Mounting Type',
        type: 'select',
        options: [
          { value: 'wall_hung', labelFa: 'وال هنگ (توکار)', labelEn: 'Wall-Hung' },
          { value: 'floor_standing', labelFa: 'زمینی', labelEn: 'Floor-Standing' }
        ]
      },
      {
        id: 'water_flow',
        labelFa: 'میزان مصرف آب (لیتر/دقیقه)',
        labelEn: 'Water Flow Rate',
        type: 'select',
        options: [
          { value: 'eco', labelFa: 'کاهنده مصرف (< ۶ لیتر)', labelEn: 'Eco (< 6 L/min)' },
          { value: 'standard', labelFa: 'استاندارد (> ۶ لیتر)', labelEn: 'Standard (> 6 L/min)' }
        ]
      }
    ]
  },
  {
    id: 'kitchen',
    nameFa: 'آشپزخانه',
    nameEn: 'Kitchen',
    icon: 'Refrigerator',
    subcategories: [
      { id: 'cabinets', nameFa: 'کابینت‌ها', nameEn: 'Cabinets' },
      { id: 'countertops', nameFa: 'صفحات رویه کانتر', nameEn: 'Countertops' },
      { id: 'appliances', nameFa: 'تجهیزات و فر توکار', nameEn: 'Appliances (built-in)' }
    ],
    specificFilters: [
      {
        id: 'kitchen_material',
        labelFa: 'جنس صفحه',
        labelEn: 'Countertop Material',
        type: 'select',
        options: [
          { value: 'quartz', labelFa: 'کوارتز', labelEn: 'Quartz' },
          { value: 'corian', labelFa: 'کوریان', labelEn: 'Corian' },
          { value: 'granite', labelFa: 'گرانیت', labelEn: 'Granite' }
        ]
      }
    ]
  },
  {
    id: 'flooring',
    nameFa: 'کفپوش و دیوارپوش',
    nameEn: 'Flooring & Wall Finishes',
    icon: 'Grid3X3',
    subcategories: [
      { id: 'tile_ceramic', nameFa: 'کاشی و سرامیک پرسلان', nameEn: 'Tile & ceramic' },
      { id: 'parquet_wood', nameFa: 'پارکت و لمینت چوبی', nameEn: 'Wood/laminate flooring' },
      { id: 'stone_floor', nameFa: 'سنگ کف طبیعی', nameEn: 'Stone flooring' }
    ],
    specificFilters: [
      {
        id: 'slip_resistance',
        labelFa: 'کلاس مقاومت به لغزش (R-Rating)',
        labelEn: 'Slip Resistance (R-Rating)',
        type: 'select',
        options: [
          { value: 'r9', labelFa: 'R9 (فضای داخلی)', labelEn: 'R9 (Indoor)' },
          { value: 'r10', labelFa: 'R10 (سرویس/آشپزخانه)', labelEn: 'R10 (Bath/Kitchen)' },
          { value: 'r11', labelFa: 'R11 (نمای خارجی/استخر)', labelEn: 'R11 (Outdoor/Pool)' }
        ]
      },
      {
        id: 'tile_finish',
        labelFa: 'نوع لعاب/پوشش',
        labelEn: 'Finish type',
        type: 'select',
        options: [
          { value: 'polish', labelFa: 'سوپر پولیش (براق)', labelEn: 'Super Polish' },
          { value: 'matte', labelFa: 'مات', labelEn: 'Matte' },
          { value: 'semi_polished', labelFa: 'نیمه مات / سمی پولیش', labelEn: 'Lappato' }
        ]
      }
    ]
  },
  {
    id: 'lighting',
    nameFa: 'روشنایی و برق',
    nameEn: 'Lighting & Electrical',
    icon: 'Lightbulb',
    subcategories: [
      { id: 'indoor_lighting', nameFa: 'روشنایی داخلی', nameEn: 'Indoor lighting' },
      { id: 'outdoor_lighting', nameFa: 'چراغ‌های پارکی و محوطه', nameEn: 'Outdoor/landscape lighting' },
      { id: 'industrial_lighting', nameFa: 'روشنایی صنعتی', nameEn: 'Industrial lighting' }
    ],
    specificFilters: [
      {
        id: 'color_temp',
        labelFa: 'دمای رنگ (Kelvin)',
        labelEn: 'Color Temperature (Kelvin)',
        type: 'select',
        options: [
          { value: '3000', labelFa: 'آفتابی (3000K)', labelEn: 'Warm White (3000K)' },
          { value: '4000', labelFa: 'طبیعی / یخی (4000K)', labelEn: 'Neutral White (4000K)' },
          { value: '6500', labelFa: 'مهتابی (6500K)', labelEn: 'Cool Daylight (6500K)' }
        ]
      },
      {
        id: 'ip_rating',
        labelFa: 'درجه حفاظت محیطی (IP)',
        labelEn: 'IP Rating',
        type: 'select',
        options: [
          { value: 'ip20', labelFa: 'IP20 (اداری داخلی)', labelEn: 'IP20 (Indoor)' },
          { value: 'ip44', labelFa: 'IP44 (مقاوم در برابر رطوبت)', labelEn: 'IP44 (Damp Location)' },
          { value: 'ip65', labelFa: 'IP65/IP66 (کاملاً ضد باران)', labelEn: 'IP65/IP66 (Outdoor)' }
        ]
      }
    ]
  },
  {
    id: 'hvac',
    nameFa: 'تاسیسات مکانیکی و تهویه',
    nameEn: 'HVAC & Mechanical',
    icon: 'Wind',
    subcategories: [
      { id: 'boilers_packages', nameFa: 'پکیج و بویلر گرمایشی', nameEn: 'Chillers & boilers' },
      { id: 'radiators', nameFa: 'رادیاتور و فن‌کویل', nameEn: 'Radiators & Fan Coils' },
      { id: 'vrf_split', nameFa: 'داکت اسپلیت و VRF', nameEn: 'VRF/split systems' },
      { id: 'fans', nameFa: 'فن و تهویه مطبوع', nameEn: 'Ventilation fans' }
    ],
    specificFilters: [
      {
        id: 'hvac_capacity',
        labelFa: 'ظرفیت حرارتی/برودتی (BTU / kW)',
        labelEn: 'Capacity (BTU/kW)',
        type: 'select',
        options: [
          { value: '24k', labelFa: '24,000 BTU / 24kW', labelEn: '24,000 BTU / 24kW' },
          { value: '32k', labelFa: '32,000 BTU / 32kW', labelEn: '32,000 BTU / 32kW' },
          { value: 'large', labelFa: 'ظرفیت بالا تجاری (> 50kW)', labelEn: 'Large Commercial (> 50kW)' }
        ]
      }
    ]
  },
  {
    id: 'plumbing',
    nameFa: 'لوله‌کشی و شیرآلات تاسیساتی',
    nameEn: 'Plumbing & Fixtures',
    icon: 'Droplet',
    subcategories: [
      { id: 'pipes', nameFa: 'لوله‌ها و اتصالات', nameEn: 'Pipes & fittings' },
      { id: 'valves', nameFa: 'شیرآلات تاسیساتی', nameEn: 'Valves' },
      { id: 'pumps', nameFa: 'پمپ‌های آبرسانی', nameEn: 'Pumps' }
    ],
    specificFilters: [
      {
        id: 'pipe_material',
        labelFa: 'جنس لوله',
        labelEn: 'Pipe Material',
        type: 'select',
        options: [
          { value: 'five_layer', labelFa: 'پنج لایه (PEX-AL-PEX)', labelEn: '5-Layer composite' },
          { value: 'upvc', labelFa: 'uPVC فاضلابی', labelEn: 'uPVC' },
          { value: 'polyethylene', labelFa: 'پلی‌اتیلن سنگین', labelEn: 'HDPE Polyethylene' }
        ]
      }
    ]
  },
  {
    id: 'structural',
    nameFa: 'سازه و ساخت‌و‌ساز',
    nameEn: 'Structural & Construction',
    icon: 'Hammer',
    subcategories: [
      { id: 'steel_structures', nameFa: 'سازه‌های فلزی', nameEn: 'Steel structures' },
      { id: 'precast_concrete', nameFa: 'قطعات بتنی پیش‌ساخته', nameEn: 'Precast elements' },
      { id: 'rebar_systems', nameFa: 'اتصالات میلگرد و رولپلاک', nameEn: 'Rebar & concrete systems' }
    ],
    specificFilters: [
      {
        id: 'steel_grade',
        labelFa: 'گرید فولاد استاندارد',
        labelEn: 'Steel Grade',
        type: 'select',
        options: [
          { value: 'st37', labelFa: 'St37 (رایج ساختمانی)', labelEn: 'St37 structural' },
          { value: 'st52', labelFa: 'St52 (مقاومت بالا)', labelEn: 'St52 high tensile' }
        ]
      }
    ]
  },
  {
    id: 'facades_curtain',
    nameFa: 'نمای پیشرفته و کرتین‌وال',
    nameEn: 'Facades & Curtain Walls',
    icon: 'Wallpaper',
    subcategories: [
      { id: 'glass_curtain', nameFa: 'کرتین‌وال شیشه‌ای', nameEn: 'Glass curtain walls' },
      { id: 'ventilated_facade', nameFa: 'سیستم‌های نمای تهویه‌شونده', nameEn: 'Ventivated facades' },
      { id: 'louvers', nameFa: 'لوورها و آفتاب‌گیرها', nameEn: 'Sunshades/louvers' }
    ],
    specificFilters: [
      {
        id: 'wind_load',
        labelFa: 'تحمل بار باد (kPa)',
        labelEn: 'Wind Load Rating (kPa)',
        type: 'select',
        options: [
          { value: '1.5', labelFa: 'تا ۱.۵ کیلوپاسکال', labelEn: 'Up to 1.5 kPa' },
          { value: '3.0', labelFa: 'تا ۳.۰ کیلوپاسکال (پرتنش)', labelEn: 'Up to 3.0 kPa (High Wind)' }
        ]
      }
    ]
  },
  {
    id: 'landscape',
    nameFa: 'محوطه و فضای سبز',
    nameEn: 'Landscape & Outdoor',
    icon: 'TreePine',
    subcategories: [
      { id: 'paving', nameFa: 'کفپوش بتنی و پازلی', nameEn: 'Paving' },
      { id: 'outdoor_furn', nameFa: 'مبلمان پارک و آلاچیق', nameEn: 'Outdoor furniture' },
      { id: 'vegetation', nameFa: 'گیاهان و پوشش سبز', nameEn: 'Planters & vegetation' }
    ],
    specificFilters: [
      {
        id: 'landscape_material',
        labelFa: 'جنس متریال بیرونی',
        labelEn: 'Outdoor Material',
        type: 'select',
        options: [
          { value: 'wash_concrete', labelFa: 'واش بتن دکوراتیو', labelEn: 'Wash Concrete' },
          { value: 'thermo_wood', labelFa: 'ترموود فضای باز', labelEn: 'Thermowood' },
          { value: 'stone', labelFa: 'سنگ لاشه / تراورتن', labelEn: 'Travertine / Stone' }
        ]
      }
    ]
  },
  {
    id: 'security',
    nameFa: 'امنیت و کنترل تردد',
    nameEn: 'Security & Access Control',
    icon: 'ShieldAlert',
    subcategories: [
      { id: 'cctv', nameFa: 'دوربین‌های امنیتی تحت شبکه', nameEn: 'CCTV' },
      { id: 'access_control', nameFa: 'گیت و اکسس کنترل ورودی', nameEn: 'Access control/turnstiles' },
      { id: 'fire_safety', nameFa: 'سیستم اعلام و اطفای حریق', nameEn: 'Fire safety equipment' }
    ],
    specificFilters: [
      {
        id: 'power_source',
        labelFa: 'منبع تغذیه',
        labelEn: 'Power Requirements',
        type: 'select',
        options: [
          { value: 'poe', labelFa: 'PoE (کابل شبکه)', labelEn: 'PoE (Power over Ethernet)' },
          { value: '220v', labelFa: 'برق مستقیم شهری ۲۲۰ ولت', labelEn: 'Direct 220V AC' }
        ]
      }
    ]
  },
  {
    id: 'software',
    nameFa: 'نرم‌افزار و افزونه‌های BIM',
    nameEn: 'Software & Plugins',
    icon: 'Cpu',
    subcategories: [
      { id: 'plugins', nameFa: 'افزونه‌های Revit/ArchiCAD', nameEn: 'BIM plugins' },
      { id: 'configurators', nameFa: 'پیکربندی‌کننده‌های تعاملی', nameEn: 'Configurators' }
    ],
    specificFilters: [
      {
        id: 'compat_app',
        labelFa: 'نرم‌افزار سازگار',
        labelEn: 'Compatible Host App',
        type: 'select',
        options: [
          { value: 'revit', labelFa: 'اتودسک رویت (Autodesk Revit)', labelEn: 'Autodesk Revit' },
          { value: 'archicad', labelFa: 'آرشیکد (Graphisoft ArchiCAD)', labelEn: 'ArchiCAD' }
        ]
      }
    ]
  }
];

export const BIM_OBJECTS: BIMObject[] = [
  {
    id: 'initial-window', titleFa: 'پنجرهٔ آلومینیومی ترمال‌بریک', titleEn: 'Thermal-Break Aluminum Window',
    manufacturerId: 'sample-facade', category: 'doors_windows', subcategory: 'windows',
    tagsFa: ['پنجره', 'آلومینیوم', 'ترمال‌بریک', 'کتابخانهٔ اولیه'], tagsEn: ['Window', 'Aluminum', 'Thermal Break', 'Initial Library'],
    formats: [], lod: 'LOD 300', priceType: 'Free', certification: [], isImported: false, hasCutsheet: false, hasSample: false,
    fileSize: '—', downloadCount: 0, rating: 0,
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80',
    descriptionFa: 'ساختار اولیهٔ اطلاعات برای یک پنجرهٔ آلومینیومی؛ اطلاعات فنی و فایل‌های قابل انتشار پس از تکمیل منبع محصول درج می‌شوند.',
    descriptionEn: 'An initial information structure for an aluminum window. Technical data and publishable files will be listed once the product source is complete.',
    specs: { frame_material: 'aluminum', glazing_type: 'double', dimensions: 'در حال تکمیل' }
  },
  {
    id: 'initial-fire-door', titleFa: 'درِ ضدحریق', titleEn: 'Fire-Rated Door',
    manufacturerId: 'sample-facade', category: 'doors_windows', subcategory: 'fire_doors',
    tagsFa: ['درِ ضدحریق', 'معماری', 'کتابخانهٔ اولیه'], tagsEn: ['Fire Door', 'Architecture', 'Initial Library'],
    formats: [], lod: 'LOD 300', priceType: 'Free', certification: [], isImported: false, hasCutsheet: false, hasSample: false,
    fileSize: '—', downloadCount: 0, rating: 0,
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=900&q=80',
    descriptionFa: 'ساختار اولیهٔ اطلاعات و پارامترهای موردنیاز برای آبجکت درِ ضدحریق در جریان طراحی.',
    descriptionEn: 'An initial product-information structure for a fire-rated door used in a design workflow.',
    specs: { fire_rating: 'در حال تکمیل', dimensions: 'در حال تکمیل' }
  },
  {
    id: 'initial-lighting', titleFa: 'چراغ توکار سقفی', titleEn: 'Recessed Ceiling Luminaire',
    manufacturerId: 'sample-mechanical', category: 'lighting', subcategory: 'indoor_lighting',
    tagsFa: ['روشنایی', 'چراغ توکار', 'کتابخانهٔ اولیه'], tagsEn: ['Lighting', 'Recessed Luminaire', 'Initial Library'],
    formats: [], lod: 'LOD 300', priceType: 'Free', certification: [], isImported: false, hasCutsheet: false, hasSample: false,
    fileSize: '—', downloadCount: 0, rating: 0,
    imageUrl: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=900&q=80',
    descriptionFa: 'ساختار اولیهٔ دادهٔ محصول برای تجهیزات روشنایی؛ فرمت و مشخصات نهایی بر اساس منبع محصول اعلام می‌شود.',
    descriptionEn: 'An initial product-data structure for lighting equipment. Final formats and specifications depend on the product source.',
    specs: { dimensions: 'در حال تکمیل', wattage: 'در حال تکمیل' }
  },
  {
    id: 'initial-facade-panel', titleFa: 'پنل پوشش نما', titleEn: 'Facade Cladding Panel',
    manufacturerId: 'sample-finishes', category: 'materials_facades', subcategory: 'cladding',
    tagsFa: ['نما', 'پنل', 'مصالح ساختمانی', 'کتابخانهٔ اولیه'], tagsEn: ['Facade', 'Cladding', 'Building Materials', 'Initial Library'],
    formats: [], lod: 'LOD 300', priceType: 'Free', certification: [], isImported: false, hasCutsheet: false, hasSample: false,
    fileSize: '—', downloadCount: 0, rating: 0,
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80',
    descriptionFa: 'ساختار اولیهٔ اطلاعات محصول برای پنل‌های پوشش نما و بررسی نیازهای فنی آن در مدل ساختمان.',
    descriptionEn: 'An initial product-information structure for facade cladding panels and their technical requirements in a building model.',
    specs: { material_type: 'در حال تکمیل', dimensions: 'در حال تکمیل' }
  }
];

export const MOCK_REVIEWS: { id: string; nameFa: string; nameEn: string; roleFa: string; roleEn: string; textFa: string; textEn: string }[] = [];

export const FAQ_ITEMS = [
  {
    qFa: 'دسترسی به فایل‌های BIM چگونه است؟', qEn: 'How can I access BIM files?',
    aFa: 'کتابخانهٔ اولیه در حال تکمیل است. با فعال‌شدن حساب‌های کاربری و انتشار فایل‌های مجاز، دسترسی پایه برای طراحان تا پنج دانلود در روز در نظر گرفته می‌شود.',
    aEn: 'The initial library is being completed. Once accounts and authorized files are available, the base access is planned for up to five downloads per day.'
  },
  {
    qFa: 'تولیدکنندگان چگونه می‌توانند همکاری را آغاز کنند؟', qEn: 'How can manufacturers begin collaborating?',
    aFa: 'با معرفی اولیهٔ برند و محصول شروع کنید. پس از بررسی کاتالوگ و اطلاعات موجود، مسیر مناسب آماده‌سازی، ارزیابی فایل یا انتشار با شما هماهنگ می‌شود.',
    aEn: 'Start by introducing your brand and product. After reviewing the catalog and available information, the suitable preparation, file-evaluation, or publication path will be coordinated with you.'
  },
  {
    qFa: 'فرمت و سطح اطلاعات هر آبجکت چگونه مشخص می‌شود؟', qEn: 'How are each object’s formats and information level defined?',
    aFa: 'فرمت‌ها و سطح اطلاعات بر اساس نوع محصول، فایل‌های منبع و نتیجهٔ بررسی فنی همان محصول اعلام می‌شوند؛ ایران‌بیم‌هاب دربارهٔ همهٔ محصولات یک سطح یا فرمت ثابت وعده نمی‌دهد.',
    aEn: 'Formats and information level are listed per product based on its type, source files, and technical review. IranBIMhub does not promise one fixed format or level for all products.'
  }
];
