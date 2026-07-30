import { Category, Manufacturer, BIMObject } from './types';

export const MANUFACTURERS: Manufacturer[] = [
  {
    id: 'm1',
    nameFa: 'شرکت آلوپن',
    nameEn: 'Alupan Co.',
    logo: 'ALUPAN',
    descriptionFa: 'تولیدکننده پیشرو در زمینه در و پنجره‌های آلومینیومی دوجداره و سیستم‌های نمای کرتین‌وال در ایران با بیش از ۴۰ سال سابقه.',
    descriptionEn: 'The leading manufacturer of double-glazed aluminum doors, windows, and curtain wall systems in Iran with over 40 years of experience.',
    website: 'https://alupan.com',
    email: 'info@alupan.com',
    phone: '+98 21 8888 1234',
    verified: true,
    tier: 'VIP',
    addressFa: 'تهران، خیابان ولیعصر، برج آلوپن',
    addressEn: 'Alupan Tower, Valiasr St, Tehran, Iran',
    stats: { views: 4250, downloads: 1840, leads: 156 }
  },
  {
    id: 'm2',
    nameFa: 'گروه صنعتی بوتان',
    nameEn: 'Butane Industrial Group',
    logo: 'BUTANE',
    descriptionFa: 'تولیدکننده شناخته‌شده پکیج‌های گرمایشی دیواری، آبگرمکن و رادیاتورهای آلومینیومی در بازار ایران.',
    descriptionEn: 'A well-known manufacturer of wall-hung heating boilers, water heaters, and aluminum radiators in the Iranian market.',
    website: 'https://butane.ir',
    email: 'sales@butane.ir',
    phone: '+98 21 8890 5678',
    verified: true,
    tier: 'VIP',
    addressFa: 'تهران، خیابان سهروردی شمالی، پلاک ۶۴',
    addressEn: 'No. 64, North Sohrevardi St, Tehran, Iran',
    stats: { views: 5800, downloads: 2450, leads: 312 }
  },
  {
    id: 'm3',
    nameFa: 'صنایع شیشه کاوه',
    nameEn: 'Kaveh Glass Industrial Group',
    logo: 'KAVEH',
    descriptionFa: 'تولیدکننده انواع شیشه‌های تخت، دوجداره، لمینت و کم‌گسیل (Low-E) برای ساختمان‌های مدرن.',
    descriptionEn: 'Manufacturer of flat glass, double-glazed glass, laminated glass, and low-E energy-saving glass for modern buildings.',
    website: 'https://kavehglass.com',
    email: 'info@kavehglass.com',
    phone: '+98 21 2201 9000',
    verified: true,
    tier: 'Premium',
    addressFa: 'تهران، بزرگراه مدرس، بلوار نلسون ماندلا',
    addressEn: 'Nelson Mandela Blvd, Modarres Hwy, Tehran, Iran',
    stats: { views: 3100, downloads: 1210, leads: 95 }
  },
  {
    id: 'm4',
    nameFa: 'پنجره وین‌تک',
    nameEn: 'WinTech UPVC Windows',
    logo: 'WINTECH',
    descriptionFa: 'تولیدکننده پروفیل‌های UPVC مدرن در و پنجره دوجداره با استانداردهای روز دنیا و گارانتی معتبر.',
    descriptionEn: 'Manufacturer of modern UPVC profiles for double-glazed doors and windows with international standards and warranty.',
    website: 'https://wintech.co.ir',
    email: 'info@wintech.co.ir',
    phone: '+98 41 3300 0000',
    verified: true,
    tier: 'VIP',
    addressFa: 'تبریز، شهرک صنعتی عالی‌نسب، بلوار صنعت',
    addressEn: 'Sanat Blvd, Alinasab Industrial Zone, Tabriz, Iran',
    stats: { views: 4900, downloads: 2100, leads: 240 }
  },
  {
    id: 'm5',
    nameFa: 'صنایع بهسرام',
    nameEn: 'Behceram Porcelain Tiles',
    logo: 'BEHCERAM',
    descriptionFa: 'تولیدکننده کاشی و سرامیک پرسلانی سوپر پولیش و لعاب‌دار در ابعاد بزرگ در ایران.',
    descriptionEn: 'Manufacturer of super polished and glazed porcelain tiles and slabs in Iran.',
    website: 'https://behceram.ir',
    email: 'design@behceram.ir',
    phone: '+98 31 3266 1234',
    verified: true,
    tier: 'Premium',
    addressFa: 'اصفهان، خیابان شریف واقفی، مجتمع صدف',
    addressEn: 'Sadaf Complex, Sharif Vaqefi St, Isfahan, Iran',
    stats: { views: 2500, downloads: 930, leads: 62 }
  },
  {
    id: 'm6',
    nameFa: 'صنایع روشنایی مازی‌نور',
    nameEn: 'Mazinoor Lighting',
    logo: 'MAZINOOR',
    descriptionFa: 'تولیدکننده پیشرفته چراغ‌های اداری، تجاری و صنعتی با تکنولوژی روز LED و پخش نور بهینه.',
    descriptionEn: 'Advanced manufacturer of office, commercial, and industrial lighting fixtures with cutting-edge LED technology.',
    website: 'https://mazinoor.com',
    email: 'technical@mazinoor.ir',
    phone: '+98 21 8877 4433',
    verified: true,
    tier: 'VIP',
    addressFa: 'تهران، میدان ونک، خیابان برزیل غربی',
    addressEn: 'West Brazil St, Vanak Sq, Tehran, Iran',
    stats: { views: 3600, downloads: 1420, leads: 110 }
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
    id: 'obj1',
    titleFa: 'پنجره دوجداره آلومینیومی ترمال‌بریک سری آلو-۹۰',
    titleEn: 'Thermal-Break Aluminum Double Glazed Window - Alu-90 Series',
    manufacturerId: 'm1',
    category: 'doors_windows',
    subcategory: 'windows',
    tagsFa: ['پنجره دوجداره', 'ترمال‌بریک', 'آلومینیوم', 'آلوپن', 'نمای شیشه‌ای'],
    tagsEn: ['Double Glazed', 'Thermal-Break', 'Aluminum', 'Alupan', 'Window'],
    formats: ['Revit', 'ArchiCAD', 'IFC', 'Catalog (PDF)'],
    revitVersions: ['2023', '2024', '2025', '2026'],
    lod: 'LOD 350',
    priceType: 'Free',
    certification: ['INSO', 'ISO 9001', 'CE'],
    isImported: false,
    hasCutsheet: true,
    hasSample: true,
    fileSize: '14.2 MB',
    downloadCount: 420,
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
    descriptionFa: 'پروفیل فوق‌العاده باکیفیت آلومینیوم ترمال بریک سری Alu-90 تولید شرکت آلوپن. دارای پارامترهای فنی کامل شامل عایق صوتی و حرارتی، جهت بازشو قابل کنترل در نرم‌افزار، و متریال‌های از پیش تنظیم‌شده.',
    descriptionEn: 'High-quality thermal-break aluminum profile window Alu-90 series by Alupan. Loaded with full technical specifications including structural dimensions, U-value calculations, and adjustable opening parameters in Revit and ArchiCAD.',
    specs: {
      frame_material: 'aluminum',
      glazing_type: 'double',
      u_value: '1.2 W/m²K',
      fire_rating: '30 min',
      dimensions: '1200 x 1500 x 90 mm',
      acoustic_rating: '38 dB',
      profile_thickness: '2.0 mm',
      wind_resistance: 'Class 4',
      warranty: '5 Years'
    }
  },
  {
    id: 'obj2',
    titleFa: 'پکیج دیواری چگالشی دیجیتال پارما ۲۴',
    titleEn: 'Parma 24 Condensing Wall Boiler',
    manufacturerId: 'm2',
    category: 'hvac',
    subcategory: 'boilers_packages',
    tagsFa: ['پکیج دیواری', 'سیستم گرمایشی', 'مکانیکال', 'بوتان', 'چگالشی'],
    tagsEn: ['Wall Boiler', 'Condensing Boiler', 'HVAC', 'Butane', 'Heating'],
    formats: ['Revit', 'IFC', 'Catalog (PDF)'],
    revitVersions: ['2022', '2023', '2024', '2025'],
    lod: 'LOD 400',
    priceType: 'Free',
    certification: ['INSO', 'CE', 'ISO 9001'],
    isImported: false,
    hasCutsheet: true,
    hasSample: false,
    fileSize: '22.8 MB',
    downloadCount: 890,
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=600&q=80',
    descriptionFa: 'مدل سه بعدی هوشمند تاسیسات (MEP) پکیج گازسوز دیواری چگالشی پارما ۲۴ از گروه صنعتی بوتان. به همراه کانکتورهای دقیق ورودی/خروجی گاز، آب سرد و گرم، و دودکش با سایزبندی استاندارد.',
    descriptionEn: 'Parametric MEP model for Parma 24 wall-hung gas condensing heating boiler by Butane Industrial Group. Includes precisely placed pipe connections for water inflow, outflow, gas line, and flue outlet according to real product sizes.',
    specs: {
      hvac_capacity: '24k BTU/h',
      efficiency: '108%',
      dimensions: '740x400x340 mm',
      noise_level: '32 dB',
      connector_type: '1/2" & 3/4" BSP',
      operating_pressure: '3 Bar',
      electrical_needs: '220V / 50Hz',
      dry_weight: '28 kg',
      warranty: '24 Months'
    }
  },
  {
    id: 'obj3',
    titleFa: 'شیشه کنترل انرژی دو جداره اکواستار کم‌گسیل',
    titleEn: 'EcoStar Double Glazed Low-E Glass',
    manufacturerId: 'm3',
    category: 'doors_windows',
    subcategory: 'curtain_walls',
    tagsFa: ['شیشه دو جداره', 'شیشه کاوه', 'شیشه کم گسیل', 'نما ساختمان', 'پوشش مدرن'],
    tagsEn: ['Double Glazing', 'Kaveh Glass', 'Low-E Glass', 'Curtain Wall', 'Energy Saving'],
    formats: ['Revit', 'ArchiCAD', 'IFC', 'Catalog (PDF)'],
    revitVersions: ['2024', '2025', '2026'],
    lod: 'LOD 300',
    priceType: 'Free',
    certification: ['INSO', 'ISO 9001'],
    isImported: false,
    hasCutsheet: true,
    hasSample: true,
    fileSize: '8.1 MB',
    downloadCount: 310,
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
    descriptionFa: 'بلوک‌های متریال شیشه‌های کم‌گسیل و عایق حرارتی اکواستار صنایع شیشه کاوه. مناسب برای شبیه‌سازی دقیق اتلاف انرژی خورشیدی و پارامترهای عبور نور مرئی (VLT) و ضریب کسب حرارت خورشید (SHGC) در ساختمان.',
    descriptionEn: 'High performance Low-E double glazing material and system catalog from Kaveh Glass. Essential for environmental simulations and energy performance assessment, preconfigured with exact visible light transmission (VLT) and solar heat gain coefficients (SHGC).',
    specs: {
      frame_material: 'aluminum',
      glazing_type: 'low_e',
      u_value: '1.4 W/m²K',
      vlt: '72%',
      shgc: '0.41',
      dimensions: '6mm Low-E + 12mm Argon + 6mm Clear',
      light_reflection: '12% Outer',
      acoustic_insulation: '36 dB',
      warranty: '10 Years'
    }
  },
  {
    id: 'obj4',
    titleFa: 'سرامیک پرسلانی سوپر پولیش سری آریا ۱۲۰x۱۲۰',
    titleEn: 'Arya Series Super Polished Porcelain Slabs (120x120)',
    manufacturerId: 'm5',
    category: 'flooring',
    subcategory: 'tile_ceramic',
    tagsFa: ['پرسلان', 'سرامیک کف', 'کاشی بهسرام', 'سوپر پولیش', 'مات و براق'],
    tagsEn: ['Porcelain Tile', 'Flooring Tile', 'Behceram', 'Super Polish', 'Large Slab'],
    formats: ['Revit', 'ArchiCAD', 'AutoCAD', 'Catalog (PDF)'],
    revitVersions: ['2023', '2024', '2025', '2026'],
    lod: 'LOD 300',
    priceType: 'Free',
    certification: ['INSO', 'CE'],
    isImported: false,
    hasCutsheet: true,
    hasSample: true,
    fileSize: '11.5 MB',
    downloadCount: 520,
    rating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=600&q=80',
    descriptionFa: 'کدهای متریال و پنل‌های کف‌پوش سرامیک پرسلانی ۱۲۰ در ۱۲۰ سانتی‌متر طرح سنگ طبیعی سری آریا، با لعاب سوپرپولیش نانو ساخت صنایع بهسرام اصفهان. دارای بافت‌های بسیار باکیفیت و بازتاب طبیعی نور برای رندرینگ حرفه‌ای.',
    descriptionEn: 'Parametric porcelain ceramic flooring slabs (120x120 cm) Arya series by Behceram. Features advanced tiling pattern generator for Revit/ArchiCAD with exact joint widths, high-resolution textures, and calibrated reflectiveness properties.',
    specs: {
      slip_resistance: 'R9 Rating',
      tile_finish: 'super polish',
      dimensions: '1200x1200x12 mm',
      water_absorption: '< 0.1% (Super Low)',
      wear_layer: 'Grade 4 (Heavy Traffic)',
      breaking_strength: '1500 N',
      chemical_resistance: 'Class GA',
      frost_resistance: 'Fully Resistant',
      warranty: '15 Years'
    }
  },
  {
    id: 'obj5',
    titleFa: 'چراغ ال‌ای‌دی توکار اداری سری تارانا ۶۰x۶۰',
    titleEn: 'Tarana Recessed LED 60x60 Panel',
    manufacturerId: 'm6',
    category: 'lighting',
    subcategory: 'indoor_lighting',
    tagsFa: ['چراغ توکار', 'روشنایی اداری', 'پنل سقفی', 'مازی‌نور', 'چراغ LED'],
    tagsEn: ['Recessed Light', 'Office Lighting', 'LED Panel', 'Mazinoor', 'Ceiling Luminaire'],
    formats: ['Revit', 'ArchiCAD', 'IFC', 'Catalog (PDF)'],
    revitVersions: ['2024', '2025', '2026'],
    lod: 'LOD 350',
    priceType: 'Free',
    certification: ['CE', 'INSO', 'ISO 9001'],
    isImported: false,
    hasCutsheet: true,
    hasSample: false,
    fileSize: '6.5 MB',
    downloadCount: 610,
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=600&q=80',
    descriptionFa: 'چراغ پنل ۶۰ در ۶۰ سانتی‌متری توکار ال‌ای‌دی تارانا ساخت روشنایی پیشرفته مازی‌نور. دارای فایل الحاقی پخش فوتومتریک (IES File) جهت محاسبات واقعی شدت روشنایی در نرم‌افزارهای دیالوکس و افزونه‌های شبیه‌ساز نور رویت.',
    descriptionEn: 'Recessed 60x60 cm LED panel Tarana series from Mazinoor. Embedded with correct photometric profiles (IES files) to facilitate real-world light intensity simulations and render exact lux distribution in Revit, Dialux, or ElumTools.',
    specs: {
      color_temp: '4000 K (Natural White)',
      ip_rating: 'IP44 Rated',
      lumens: '4500 lm',
      wattage: '40 W',
      ies_included: 'Yes (IES Included)',
      dimmable: 'No',
      operating_hours: '50,000 Hours (L70)',
      cri_rating: '> 80 Ra',
      warranty: '3 Years'
    }
  },
  {
    id: 'obj6',
    titleFa: 'پنجره یوپی‌وی‌سی کشویی سری وین‌تک دبلیو۷۰۰',
    titleEn: 'WinTech UPVC Sliding Window - W700 Series',
    manufacturerId: 'm4',
    category: 'doors_windows',
    subcategory: 'windows',
    tagsFa: ['پنجره یوپی‌وی‌سی', 'وین تک', 'پنجره دوجداره', 'درب کشویی', 'پروفیل مدرن'],
    tagsEn: ['UPVC Window', 'WinTech', 'Double Glazed', 'Sliding Window', 'UPVC Profile'],
    formats: ['Revit', 'ArchiCAD', 'IFC', 'Catalog (PDF)'],
    revitVersions: ['2023', '2024', '2025'],
    lod: 'LOD 300',
    priceType: 'Free',
    certification: ['INSO', 'ISO 9001'],
    isImported: false,
    hasCutsheet: true,
    hasSample: true,
    fileSize: '15.1 MB',
    downloadCount: 380,
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=600&q=80',
    descriptionFa: 'سیستم درب و پنجره یوپی‌وی‌سی دوجداره کشویی سری W700 وین‌تک. طراحی پروفیل سه محفظه‌ای با عایق استثنایی صدا و حرارت، همراه با متغیرهای هوشمند پهنا و ارتفاع بازشو در مدل‌های سه‌بعدی.',
    descriptionEn: 'WinTech UPVC sliding window double glazed model based on the W700 3-chamber profile standard. Delivers excellent sound insulation, featuring fully flexible architectural parameters for custom width/height adjustments.',
    specs: {
      frame_material: 'upvc',
      glazing_type: 'double',
      u_value: '1.6 W/m²K',
      fire_rating: '30 min',
      dimensions: '1800 x 1400 x 70 mm',
      chambers_count: '3 Chambers',
      acoustic_insulation: '34 dB',
      warranty: '10 Years'
    }
  },
  {
    id: 'obj7',
    titleFa: 'میز اداری ارگونومیک مدیریتی نیلپر سری اف-۹۸',
    titleEn: 'Nilper F-98 Ergonomic Executive Desk',
    manufacturerId: 'm5',
    category: 'furniture',
    subcategory: 'tables_desks',
    tagsFa: ['میز اداری', 'نیلپر', 'مبلمان مدرن', 'میز مدیریتی', 'طراحی ارگونومیک'],
    tagsEn: ['Office Desk', 'Executive Desk', 'Nilper', 'Modern Furniture', 'Ergonomic Desk'],
    formats: ['Revit', 'AutoCAD', 'Catalog (PDF)'],
    revitVersions: ['2022', '2023', '2024'],
    lod: 'LOD 200',
    priceType: 'Free',
    certification: ['ISO 9001'],
    isImported: false,
    hasCutsheet: false,
    hasSample: false,
    fileSize: '9.2 MB',
    downloadCount: 150,
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=600&q=80',
    descriptionFa: 'میز مدرن اداری ارگونومیک طرح نیلپر ویژه چیدمان فضاهای مدیریتی با متریال با کیفیت چوب ام‌دی‌اف و پایه‌های فلزی مشکی مات.',
    descriptionEn: 'Modern ergonomic executive office desk reminiscent of top Nilper designs, complete with built-in cable grommets, wooden veneer finishes, and stylish dark metal legs.',
    specs: {
      material: 'MDF Wood & Steel',
      style: 'modern ergonomic',
      dimensions: '2000x900x750 mm',
      color_finish: 'Walnut & Black Matte',
      cable_management: 'Yes (Grommets Included)',
      scratch_resistant: 'Yes (Melamine Overlay)',
      warranty: '3 Years'
    }
  },
  {
    id: 'obj8',
    titleFa: 'آبگرمکن برقی ایستاده لورچ ۲۰۰ لیتری',
    titleEn: 'Lorch 200L Standing Electric Water Heater',
    manufacturerId: 'm2',
    category: 'plumbing',
    subcategory: 'pumps',
    tagsFa: ['آبگرمکن برقی', 'تاسیسات لورچ', 'لورچ', 'مکانیکال آب', 'پمپ گرمایشی'],
    tagsEn: ['Electric Water Heater', 'Plumbing Fixture', 'Lorch', 'Water Storage', 'MEP Family'],
    formats: ['Revit', 'IFC', 'Catalog (PDF)'],
    revitVersions: ['2023', '2024', '2025'],
    lod: 'LOD 350',
    priceType: 'Free',
    certification: ['INSO'],
    isImported: false,
    hasCutsheet: true,
    hasSample: false,
    fileSize: '16.7 MB',
    downloadCount: 220,
    rating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
    descriptionFa: 'مدل پارامتریک آبگرمکن ایستاده برقی ۲۰۰ لیتری با راندمان مصرف انرژی عالی. شامل اتصالات الکتریکی و هیدرولیکی ورودی آب سرد و خروجی آب گرم.',
    descriptionEn: 'Standing 200-liter storage electric water heater MEP family. Incorporates mechanical connectors for cold water inlet, warm water outlet, relief valve drainage, and electrical power load parameter configuration.',
    specs: {
      pipe_material: '5-Layer Composite',
      capacity: '200 Liters',
      power_source: 'Electric (220V AC)',
      energy_efficiency: 'Class A',
      dimensions: 'Diameter 500 mm x Height 1500 mm',
      heating_time: '120 Minutes to 60°C',
      dry_weight: '45 kg',
      tank_coating: 'Titanium Glasslined Steel',
      warranty: '36 Months'
    }
  }
];

export const MOCK_REVIEWS = [
  { 
    id: '1', 
    nameFa: 'مهندس آرش علوی', 
    nameEn: 'Eng. Arash Alavi', 
    roleFa: 'معمار ارشد، آتلیه معماری آرک', 
    roleEn: 'Senior Architect, Arch Design Studio', 
    textFa: 'پیدا کردن فایل‌های بیم استاندارد ایرانی همیشه یک چالش بود. IranBIMhub با ارائه مدل‌های دقیق آلوپن و بوتان روند فاز دو پروژه‌های ما را به شدت تسریع کرده است.', 
    textEn: 'Finding standard Iranian BIM objects has always been a major bottleneck. IranBIMhub has dramatically optimized our phase-2 detail design workflow with verified files.' 
  },
  { 
    id: '2', 
    nameFa: 'دکتر مریم سهرابی', 
    nameEn: 'Dr. Maryam Sohrabi', 
    roleFa: 'مدیر BIM، هلدینگ ساختمانی مهرگان', 
    roleEn: 'BIM Director, Mehregan Construction Holding', 
    textFa: 'امکان مقایسه فنی و پارامتریک در این سایت بی‌نظیر است. ما توانستیم مدل‌های چراغ مازی‌نور را با جزئیات کامل فنی فیلتر و مستقیم وارد مدل رویت پروژه کنیم.', 
    textEn: 'The parametric comparison feature is revolutionary. We could filter Mazinoor lighting luminaires based on actual technical attributes and inject them directly into our active Revit models.' 
  },
  { 
    id: '3', 
    nameFa: 'مهندس پوریا کریمی', 
    nameEn: 'Eng. Pouria Karimi', 
    roleFa: 'طراح مکانیکال و هیدرولیک، شرکت مهندسین مشاور سازه', 
    roleEn: 'Mechanical & Hydraulic Designer, Sazeh Consulting Engineers', 
    textFa: 'برای مهندسان تاسیسات، صحت پورت‌ها و کانکتورهای فمیلی‌های رویت حیاتی است. مدل‌های شیرآلات و پکیج‌های موجود در این پلتفرم از نظر اتصالات پایپینگ کاملاً استاندارد و مهندسی شده هستند.', 
    textEn: 'For MEP engineers, the accuracy of connectors in Revit families is critical. The valves and boiler models on this platform have perfect, fully-functional piping connectors.' 
  },
  { 
    id: '4', 
    nameFa: 'مهندس نیلوفر راد', 
    nameEn: 'Eng. Niloofar Rad', 
    roleFa: 'سرپرست بخش مدلسازی و مستندسازی، گروه نقشه و طرح', 
    roleEn: 'BIM Modeling & Documentation Lead, Map & Plan Group', 
    textFa: 'مستندات دو بعدی خودکار استخراج شده از این فمیلی‌ها بدون نقص است. جزئیات LOD 350 در پروژه‌های شاپ‌دراوینگ کمک شایانی به رفع تداخلات سازه و معماری می‌کند.', 
    textEn: 'The 2D drawings generated from these families are flawless. The LOD 350 details are incredibly helpful for clash detection between structural and architectural elements.' 
  },
  { 
    id: '5', 
    nameFa: 'مهندس بهزاد یوسفی', 
    nameEn: 'Eng. Behzad Yousefi', 
    roleFa: 'مدیر تولید و توسعه محصول، صنایع آلومینیوم آلپیکو', 
    roleEn: 'Product Development Director, Alpico Aluminum Industries', 
    textFa: 'ارائه محصولاتمان به صورت آبجکت‌های هوشمند در ایران‌بیم‌هاب، کانال بازاریابی نوین و بی‌نظیری ایجاد کرده است. حالا طراحان پروژه‌ها قبل از خرید، مدل دقیق ما را در طرح‌های خود بکار می‌برند.', 
    textEn: 'Publishing our products as intelligent BIM objects on IranBIMhub has created an innovative marketing channel. Architects now specify our exact models in their designs before purchasing.' 
  },
  { 
    id: '6', 
    nameFa: 'مهندس غزال فرهمند', 
    nameEn: 'Eng. Ghazal Farahmand', 
    roleFa: 'طراح داخلی و معمار فاز دو، دکو آرکی‌تک', 
    roleEn: 'Interior & Phase-2 Designer, Deco Architech', 
    textFa: 'تنوع مدل‌های مبلمان، درب و پنجره مطابق با ابعاد و استانداردهای بازار داخلی کار ما را در ارائه نقشه‌های اجرایی دوچندان آسان کرده است. از این بابت صمیمانه سپاسگزارم.', 
    textEn: 'The variety of doors, windows, and custom furniture fitting local dimensions makes detailed construction documents much easier to deliver. Thank you so much for this platform.' 
  }
];

export const FAQ_ITEMS = [
  {
    qFa: 'چگونه می‌توانم فایل‌های بیم را دانلود کنم؟',
    qEn: 'How can I download the BIM files?',
    aFa: 'شما می‌توانید با ثبت نام به عنوان مدل‌ساز (کاملاً رایگان)، وارد صفحه هر محصول شده و فرمت‌های مورد نظر خود مانند Revit، AutoCAD یا ArchiCAD یا IFC را با یک کلیک دانلود کنید.',
    aEn: 'You can register as a Modeler (completely free), visit any product page, and download your preferred format like Revit, AutoCAD, ArchiCAD, or IFC in just one click.'
  },
  {
    qFa: 'مزیت عضویت برای تولیدکنندگان چیست؟',
    qEn: 'What is the benefit of joining for manufacturers?',
     aFa: 'با قرار دادن محصولات خود در IranBIMhub، مسیر معرفی فنی و قابل ارزیابی محصول برای معماران، طراحان و مهندسان ایرانی فراهم می‌شود. حضور درست در مدل BIM می‌تواند شانس دیده‌شدن و انتخاب محصول در مراحل طراحی و اجرا را افزایش دهد.',
     aEn: 'By listing products on IranBIMhub, manufacturers create a clearer technical path for architects and engineers to evaluate and use real product data in BIM workflows, increasing the chance of specification during design and construction.'
  },
  {
    qFa: 'منظور از سطح توسعه (LOD) در مدل‌های بیم چیست؟',
    qEn: 'What does LOD (Level of Development) mean in BIM models?',
    aFa: 'سطح توسعه یا LOD نشان‌دهنده دقت هندسی و میزان اطلاعات فنی پیوست شده به مدل سه‌بعدی است. ما در IranBIMhub مدل‌های باکیفیت استاندارد از سطح LOD 200 تا LOD 400 (بسیار دقیق و اجرایی همراه با کانکتورهای تاسیساتی) ارائه می‌دهیم.',
    aEn: 'Level of Development (LOD) defines the geometrical accuracy and technical detail depth of the 3D object. IranBIMhub hosts validated files ranging from LOD 200 up to MEP-functional LOD 400 with physical connectors.'
  }
];
