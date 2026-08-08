import type { Category } from './types';

export const PRODUCT_CATEGORIES = [
  {
    "id": "doors-windows-openings",
    "slug": "doors-windows-openings",
    "level": 1,
    "label": {
      "fa": "در، پنجره و بازشوها",
      "en": "Doors, Windows & Openings"
    },
    "childIds": [
      "interior-doors",
      "external-doors",
      "fire-security-doors",
      "automatic-revolving-doors",
      "industrial-garage-doors",
      "windows",
      "skylights-rooflights",
      "opening-glazing",
      "door-window-hardware",
      "louvers-blinds-shading"
    ]
  },
  {
    "id": "facade-envelope-materials",
    "slug": "facade-envelope-materials",
    "level": 1,
    "label": {
      "fa": "نما، پوسته و مصالح ساختمان",
      "en": "Facade, Envelope & Building Materials"
    },
    "childIds": [
      "facade-cladding-systems",
      "curtain-wall-glazing",
      "external-wall-systems",
      "bricks-blocks-masonry",
      "concrete-precast",
      "thermal-acoustic-insulation",
      "waterproofing-membranes",
      "roofing-systems",
      "sheets-panels-composites",
      "external-coatings"
    ]
  },
  {
    "id": "floors-walls-ceilings-finishes",
    "slug": "floors-walls-ceilings-finishes",
    "level": 1,
    "label": {
      "fa": "کف، دیوار، سقف و نازک‌کاری",
      "en": "Floors, Walls, Ceilings & Finishes"
    },
    "childIds": [
      "flooring",
      "tiles-ceramics-mosaic",
      "wood-laminate-flooring",
      "raised-technical-flooring",
      "wall-finishes",
      "partitions-drywall",
      "suspended-ceilings",
      "acoustic-panels",
      "paint-wallcoverings",
      "trim-mouldings"
    ]
  },
  {
    "id": "sanitary-plumbing",
    "slug": "sanitary-plumbing",
    "level": 1,
    "label": {
      "fa": "تجهیزات بهداشتی و لوله‌کشی",
      "en": "Sanitary & Plumbing"
    },
    "childIds": [
      "sanitaryware",
      "faucets-mixers",
      "showers-baths",
      "sinks-accessories",
      "pipes-fittings",
      "valves-controls",
      "pumps-booster-pumps",
      "tanks-water-storage",
      "water-treatment",
      "drainage-rainwater"
    ]
  },
  {
    "id": "heating-cooling-ventilation",
    "slug": "heating-cooling-ventilation",
    "level": 1,
    "label": {
      "fa": "سرمایش، گرمایش و تهویه",
      "en": "Heating, Cooling & Ventilation"
    },
    "childIds": [
      "boilers-heating",
      "radiators-underfloor-heating",
      "chillers-heat-pumps",
      "fan-coils-ahus-vrf",
      "ventilation-exhaust-fans",
      "ductwork-fittings",
      "diffusers-grilles",
      "dampers-air-controls",
      "mechanical-pumps-compressors",
      "hvac-controls-thermostats"
    ]
  },
  {
    "id": "electrical-safety-smart-building",
    "slug": "electrical-safety-smart-building",
    "level": 1,
    "label": {
      "fa": "برق، ایمنی و هوشمندسازی",
      "en": "Electrical, Safety & Smart Building"
    },
    "childIds": [
      "switches-sockets",
      "power-distribution",
      "cable-management",
      "backup-power",
      "fire-alarm",
      "fire-suppression",
      "security-access-control",
      "smart-building-bms",
      "network-telecom-ict",
      "ev-charging"
    ]
  },
  {
    "id": "lighting",
    "slug": "lighting",
    "level": 1,
    "label": {
      "fa": "روشنایی",
      "en": "Lighting"
    },
    "childIds": [
      "recessed-lighting",
      "surface-mounted-lighting",
      "linear-lighting",
      "pendant-lighting",
      "chandeliers",
      "spot-halogens",
      "decorative-lamps",
      "outdoor-landscape-lighting",
      "inground-facade-floodlights",
      "emergency-exit-lighting"
    ]
  },
  {
    "id": "kitchen-furniture-interior-equipment",
    "slug": "kitchen-furniture-interior-equipment",
    "level": 1,
    "label": {
      "fa": "آشپزخانه، مبلمان و تجهیزات داخلی",
      "en": "Kitchen, Furniture & Interior Equipment"
    },
    "childIds": [
      "kitchen-casework",
      "kitchen-appliances",
      "kitchen-sinks",
      "tables-counters",
      "seating-lounge",
      "office-furniture",
      "storage-shelving",
      "beds-bedroom",
      "special-interior-equipment",
      "outdoor-furniture"
    ]
  },
  {
    "id": "structure-building-elements",
    "slug": "structure-building-elements",
    "level": 1,
    "label": {
      "fa": "سازه و اجزای ساختمانی",
      "en": "Structure & Building Elements"
    },
    "childIds": [
      "beams-columns",
      "steel-structure",
      "concrete-structure",
      "foundations-substructure",
      "slabs-decks",
      "load-bearing-shear-walls",
      "lightweight-structural-systems",
      "stairs-ramps",
      "handrails-balustrades",
      "prefabricated-modular-elements"
    ]
  },
  {
    "id": "vertical-transportation-circulation",
    "slug": "vertical-transportation-circulation",
    "level": 1,
    "label": {
      "fa": "آسانسور، پله‌برقی و تجهیزات جابه‌جایی",
      "en": "Vertical Transportation & Circulation"
    },
    "childIds": [
      "passenger-elevators",
      "freight-service-elevators",
      "hospital-elevators",
      "panoramic-home-elevators",
      "escalators",
      "moving-walks",
      "accessibility-platform-lifts",
      "industrial-vehicle-lifts",
      "elevator-doors-entrances",
      "elevator-cab-controls"
    ]
  },
  {
    "id": "interior-doors",
    "slug": "interior-doors",
    "level": 2,
    "parentId": "doors-windows-openings",
    "label": {
      "fa": "درب‌های داخلی",
      "en": "Interior Doors"
    },
    "childIds": []
  },
  {
    "id": "external-doors",
    "slug": "external-doors",
    "level": 2,
    "parentId": "doors-windows-openings",
    "label": {
      "fa": "درب‌های ورودی و خارجی",
      "en": "External Doors"
    },
    "childIds": []
  },
  {
    "id": "fire-security-doors",
    "slug": "fire-security-doors",
    "level": 2,
    "parentId": "doors-windows-openings",
    "label": {
      "fa": "درب‌های ضدحریق و امنیتی",
      "en": "Fire & Security Doors"
    },
    "childIds": []
  },
  {
    "id": "automatic-revolving-doors",
    "slug": "automatic-revolving-doors",
    "level": 2,
    "parentId": "doors-windows-openings",
    "label": {
      "fa": "درب‌های اتوماتیک و گردان",
      "en": "Automatic & Revolving Doors"
    },
    "childIds": []
  },
  {
    "id": "industrial-garage-doors",
    "slug": "industrial-garage-doors",
    "level": 2,
    "parentId": "doors-windows-openings",
    "label": {
      "fa": "درب‌های صنعتی، کرکره‌ای و پارکینگی",
      "en": "Industrial, Garage & Shutter Doors"
    },
    "childIds": []
  },
  {
    "id": "windows",
    "slug": "windows",
    "level": 2,
    "parentId": "doors-windows-openings",
    "label": {
      "fa": "پنجره‌ها",
      "en": "Windows"
    },
    "childIds": []
  },
  {
    "id": "skylights-rooflights",
    "slug": "skylights-rooflights",
    "level": 2,
    "parentId": "doors-windows-openings",
    "label": {
      "fa": "نورگیرها و پنجره‌های سقفی",
      "en": "Skylights & Rooflights"
    },
    "childIds": []
  },
  {
    "id": "opening-glazing",
    "slug": "opening-glazing",
    "level": 2,
    "parentId": "doors-windows-openings",
    "label": {
      "fa": "شیشه و سیستم‌های شیشه‌ای بازشو",
      "en": "Opening Glazing"
    },
    "childIds": []
  },
  {
    "id": "door-window-hardware",
    "slug": "door-window-hardware",
    "level": 2,
    "parentId": "doors-windows-openings",
    "label": {
      "fa": "یراق‌آلات در و پنجره",
      "en": "Door & Window Hardware"
    },
    "childIds": []
  },
  {
    "id": "louvers-blinds-shading",
    "slug": "louvers-blinds-shading",
    "level": 2,
    "parentId": "doors-windows-openings",
    "label": {
      "fa": "لوور، کرکره و سایه‌بان",
      "en": "Louvers, Blinds & Shading"
    },
    "childIds": []
  },
  {
    "id": "facade-cladding-systems",
    "slug": "facade-cladding-systems",
    "level": 2,
    "parentId": "facade-envelope-materials",
    "label": {
      "fa": "سیستم‌های نما و Cladding",
      "en": "Facade Cladding Systems"
    },
    "childIds": []
  },
  {
    "id": "curtain-wall-glazing",
    "slug": "curtain-wall-glazing",
    "level": 2,
    "parentId": "facade-envelope-materials",
    "label": {
      "fa": "کرتین‌وال و نمای شیشه‌ای",
      "en": "Curtain Wall & Glazing"
    },
    "childIds": []
  },
  {
    "id": "external-wall-systems",
    "slug": "external-wall-systems",
    "level": 2,
    "parentId": "facade-envelope-materials",
    "label": {
      "fa": "دیوارهای خارجی و پوسته ساختمان",
      "en": "External Wall Systems"
    },
    "childIds": []
  },
  {
    "id": "bricks-blocks-masonry",
    "slug": "bricks-blocks-masonry",
    "level": 2,
    "parentId": "facade-envelope-materials",
    "label": {
      "fa": "آجر، بلوک و مصالح بنایی",
      "en": "Bricks, Blocks & Masonry"
    },
    "childIds": []
  },
  {
    "id": "concrete-precast",
    "slug": "concrete-precast",
    "level": 2,
    "parentId": "facade-envelope-materials",
    "label": {
      "fa": "قطعات بتنی و پیش‌ساخته",
      "en": "Concrete & Precast"
    },
    "childIds": []
  },
  {
    "id": "thermal-acoustic-insulation",
    "slug": "thermal-acoustic-insulation",
    "level": 2,
    "parentId": "facade-envelope-materials",
    "label": {
      "fa": "عایق‌های حرارتی و صوتی",
      "en": "Thermal & Acoustic Insulation"
    },
    "childIds": []
  },
  {
    "id": "waterproofing-membranes",
    "slug": "waterproofing-membranes",
    "level": 2,
    "parentId": "facade-envelope-materials",
    "label": {
      "fa": "آب‌بندی و غشاهای رطوبتی",
      "en": "Waterproofing & Membranes"
    },
    "childIds": []
  },
  {
    "id": "roofing-systems",
    "slug": "roofing-systems",
    "level": 2,
    "parentId": "facade-envelope-materials",
    "label": {
      "fa": "سیستم‌های بام و پوشش سقف",
      "en": "Roofing Systems"
    },
    "childIds": []
  },
  {
    "id": "sheets-panels-composites",
    "slug": "sheets-panels-composites",
    "level": 2,
    "parentId": "facade-envelope-materials",
    "label": {
      "fa": "ورق، پنل و کامپوزیت",
      "en": "Sheets, Panels & Composites"
    },
    "childIds": []
  },
  {
    "id": "external-coatings",
    "slug": "external-coatings",
    "level": 2,
    "parentId": "facade-envelope-materials",
    "label": {
      "fa": "رنگ و پوشش‌های محافظتی خارجی",
      "en": "External Coatings"
    },
    "childIds": []
  },
  {
    "id": "flooring",
    "slug": "flooring",
    "level": 2,
    "parentId": "floors-walls-ceilings-finishes",
    "label": {
      "fa": "کف‌پوش‌ها",
      "en": "Flooring"
    },
    "childIds": []
  },
  {
    "id": "tiles-ceramics-mosaic",
    "slug": "tiles-ceramics-mosaic",
    "level": 2,
    "parentId": "floors-walls-ceilings-finishes",
    "label": {
      "fa": "کاشی، سرامیک و موزاییک",
      "en": "Tiles, Ceramics & Mosaic"
    },
    "childIds": []
  },
  {
    "id": "wood-laminate-flooring",
    "slug": "wood-laminate-flooring",
    "level": 2,
    "parentId": "floors-walls-ceilings-finishes",
    "label": {
      "fa": "پارکت، لمینت و کف‌پوش چوبی",
      "en": "Wood & Laminate Flooring"
    },
    "childIds": []
  },
  {
    "id": "raised-technical-flooring",
    "slug": "raised-technical-flooring",
    "level": 2,
    "parentId": "floors-walls-ceilings-finishes",
    "label": {
      "fa": "کف کاذب و کف‌پوش‌های فنی",
      "en": "Raised & Technical Flooring"
    },
    "childIds": []
  },
  {
    "id": "wall-finishes",
    "slug": "wall-finishes",
    "level": 2,
    "parentId": "floors-walls-ceilings-finishes",
    "label": {
      "fa": "دیوارپوش و پوشش داخلی دیوار",
      "en": "Wall Finishes"
    },
    "childIds": []
  },
  {
    "id": "partitions-drywall",
    "slug": "partitions-drywall",
    "level": 2,
    "parentId": "floors-walls-ceilings-finishes",
    "label": {
      "fa": "پارتیشن و درای‌وال",
      "en": "Partitions & Drywall"
    },
    "childIds": []
  },
  {
    "id": "suspended-ceilings",
    "slug": "suspended-ceilings",
    "level": 2,
    "parentId": "floors-walls-ceilings-finishes",
    "label": {
      "fa": "سیستم‌های سقف کاذب",
      "en": "Suspended Ceilings"
    },
    "childIds": []
  },
  {
    "id": "acoustic-panels",
    "slug": "acoustic-panels",
    "level": 2,
    "parentId": "floors-walls-ceilings-finishes",
    "label": {
      "fa": "پنل‌های آکوستیک",
      "en": "Acoustic Panels"
    },
    "childIds": []
  },
  {
    "id": "paint-wallcoverings",
    "slug": "paint-wallcoverings",
    "level": 2,
    "parentId": "floors-walls-ceilings-finishes",
    "label": {
      "fa": "رنگ، پوشش و کاغذ دیواری",
      "en": "Paint & Wallcoverings"
    },
    "childIds": []
  },
  {
    "id": "trim-mouldings",
    "slug": "trim-mouldings",
    "level": 2,
    "parentId": "floors-walls-ceilings-finishes",
    "label": {
      "fa": "ابزار، قرنیز و جزئیات نازک‌کاری",
      "en": "Trim & Mouldings"
    },
    "childIds": []
  },
  {
    "id": "sanitaryware",
    "slug": "sanitaryware",
    "level": 2,
    "parentId": "sanitary-plumbing",
    "label": {
      "fa": "چینی‌آلات بهداشتی",
      "en": "Sanitaryware"
    },
    "childIds": []
  },
  {
    "id": "faucets-mixers",
    "slug": "faucets-mixers",
    "level": 2,
    "parentId": "sanitary-plumbing",
    "label": {
      "fa": "شیرآلات و میکسرها",
      "en": "Faucets & Mixers"
    },
    "childIds": []
  },
  {
    "id": "showers-baths",
    "slug": "showers-baths",
    "level": 2,
    "parentId": "sanitary-plumbing",
    "label": {
      "fa": "دوش، وان و جکوزی",
      "en": "Showers, Baths & Jacuzzis"
    },
    "childIds": []
  },
  {
    "id": "sinks-accessories",
    "slug": "sinks-accessories",
    "level": 2,
    "parentId": "sanitary-plumbing",
    "label": {
      "fa": "سینک و متعلقات",
      "en": "Sinks & Accessories"
    },
    "childIds": []
  },
  {
    "id": "pipes-fittings",
    "slug": "pipes-fittings",
    "level": 2,
    "parentId": "sanitary-plumbing",
    "label": {
      "fa": "لوله و اتصالات",
      "en": "Pipes & Fittings"
    },
    "childIds": []
  },
  {
    "id": "valves-controls",
    "slug": "valves-controls",
    "level": 2,
    "parentId": "sanitary-plumbing",
    "label": {
      "fa": "شیرآلات صنعتی و کنترلی",
      "en": "Valves & Controls"
    },
    "childIds": []
  },
  {
    "id": "pumps-booster-pumps",
    "slug": "pumps-booster-pumps",
    "level": 2,
    "parentId": "sanitary-plumbing",
    "label": {
      "fa": "پمپ و بوستر پمپ",
      "en": "Pumps & Booster Pumps"
    },
    "childIds": []
  },
  {
    "id": "tanks-water-storage",
    "slug": "tanks-water-storage",
    "level": 2,
    "parentId": "sanitary-plumbing",
    "label": {
      "fa": "مخازن و تجهیزات ذخیره آب",
      "en": "Tanks & Water Storage"
    },
    "childIds": []
  },
  {
    "id": "water-treatment",
    "slug": "water-treatment",
    "level": 2,
    "parentId": "sanitary-plumbing",
    "label": {
      "fa": "تصفیه و کنترل کیفیت آب",
      "en": "Water Treatment"
    },
    "childIds": []
  },
  {
    "id": "drainage-rainwater",
    "slug": "drainage-rainwater",
    "level": 2,
    "parentId": "sanitary-plumbing",
    "label": {
      "fa": "فاضلاب، کف‌شور و آب باران",
      "en": "Drainage & Rainwater"
    },
    "childIds": []
  },
  {
    "id": "boilers-heating",
    "slug": "boilers-heating",
    "level": 2,
    "parentId": "heating-cooling-ventilation",
    "label": {
      "fa": "بویلر، پکیج و تجهیزات گرمایشی",
      "en": "Boilers & Heating"
    },
    "childIds": []
  },
  {
    "id": "radiators-underfloor-heating",
    "slug": "radiators-underfloor-heating",
    "level": 2,
    "parentId": "heating-cooling-ventilation",
    "label": {
      "fa": "رادیاتور و گرمایش از کف",
      "en": "Radiators & Underfloor Heating"
    },
    "childIds": []
  },
  {
    "id": "chillers-heat-pumps",
    "slug": "chillers-heat-pumps",
    "level": 2,
    "parentId": "heating-cooling-ventilation",
    "label": {
      "fa": "چیلر، هیت‌پمپ و تجهیزات سرمایشی",
      "en": "Chillers & Heat Pumps"
    },
    "childIds": []
  },
  {
    "id": "fan-coils-ahus-vrf",
    "slug": "fan-coils-ahus-vrf",
    "level": 2,
    "parentId": "heating-cooling-ventilation",
    "label": {
      "fa": "فن‌کویل، هواساز و VRF",
      "en": "Fan Coils, AHUs & VRF"
    },
    "childIds": []
  },
  {
    "id": "ventilation-exhaust-fans",
    "slug": "ventilation-exhaust-fans",
    "level": 2,
    "parentId": "heating-cooling-ventilation",
    "label": {
      "fa": "تهویه، اگزاست و فن",
      "en": "Ventilation & Exhaust Fans"
    },
    "childIds": []
  },
  {
    "id": "ductwork-fittings",
    "slug": "ductwork-fittings",
    "level": 2,
    "parentId": "heating-cooling-ventilation",
    "label": {
      "fa": "کانال هوا و اتصالات",
      "en": "Ductwork & Fittings"
    },
    "childIds": []
  },
  {
    "id": "diffusers-grilles",
    "slug": "diffusers-grilles",
    "level": 2,
    "parentId": "heating-cooling-ventilation",
    "label": {
      "fa": "دریچه، گریل و دیفیوزر",
      "en": "Diffusers & Grilles"
    },
    "childIds": []
  },
  {
    "id": "dampers-air-controls",
    "slug": "dampers-air-controls",
    "level": 2,
    "parentId": "heating-cooling-ventilation",
    "label": {
      "fa": "دمپر و تجهیزات کنترل هوا",
      "en": "Dampers & Air Controls"
    },
    "childIds": []
  },
  {
    "id": "mechanical-pumps-compressors",
    "slug": "mechanical-pumps-compressors",
    "level": 2,
    "parentId": "heating-cooling-ventilation",
    "label": {
      "fa": "پمپ، کمپرسور و تجهیزات مکانیکی",
      "en": "Mechanical Pumps & Compressors"
    },
    "childIds": []
  },
  {
    "id": "hvac-controls-thermostats",
    "slug": "hvac-controls-thermostats",
    "level": 2,
    "parentId": "heating-cooling-ventilation",
    "label": {
      "fa": "ترموستات و کنترل‌های HVAC",
      "en": "HVAC Controls & Thermostats"
    },
    "childIds": []
  },
  {
    "id": "switches-sockets",
    "slug": "switches-sockets",
    "level": 2,
    "parentId": "electrical-safety-smart-building",
    "label": {
      "fa": "کلید، پریز و تجهیزات دیواری",
      "en": "Switches, Sockets & Wall Devices"
    },
    "childIds": []
  },
  {
    "id": "power-distribution",
    "slug": "power-distribution",
    "level": 2,
    "parentId": "electrical-safety-smart-building",
    "label": {
      "fa": "تابلو برق و توزیع برق",
      "en": "Power Distribution"
    },
    "childIds": []
  },
  {
    "id": "cable-management",
    "slug": "cable-management",
    "level": 2,
    "parentId": "electrical-safety-smart-building",
    "label": {
      "fa": "کابل، سینی کابل و مدیریت کابل",
      "en": "Cable Management"
    },
    "childIds": []
  },
  {
    "id": "backup-power",
    "slug": "backup-power",
    "level": 2,
    "parentId": "electrical-safety-smart-building",
    "label": {
      "fa": "ژنراتور، UPS و برق اضطراری",
      "en": "Backup Power"
    },
    "childIds": []
  },
  {
    "id": "fire-alarm",
    "slug": "fire-alarm",
    "level": 2,
    "parentId": "electrical-safety-smart-building",
    "label": {
      "fa": "تجهیزات اعلام حریق",
      "en": "Fire Alarm"
    },
    "childIds": []
  },
  {
    "id": "fire-suppression",
    "slug": "fire-suppression",
    "level": 2,
    "parentId": "electrical-safety-smart-building",
    "label": {
      "fa": "تجهیزات اطفای حریق",
      "en": "Fire Suppression"
    },
    "childIds": []
  },
  {
    "id": "security-access-control",
    "slug": "security-access-control",
    "level": 2,
    "parentId": "electrical-safety-smart-building",
    "label": {
      "fa": "امنیت، دوربین و کنترل تردد",
      "en": "Security & Access Control"
    },
    "childIds": []
  },
  {
    "id": "smart-building-bms",
    "slug": "smart-building-bms",
    "level": 2,
    "parentId": "electrical-safety-smart-building",
    "label": {
      "fa": "خانه هوشمند و BMS",
      "en": "Smart Building & BMS"
    },
    "childIds": []
  },
  {
    "id": "network-telecom-ict",
    "slug": "network-telecom-ict",
    "level": 2,
    "parentId": "electrical-safety-smart-building",
    "label": {
      "fa": "شبکه، مخابرات و تجهیزات ICT",
      "en": "Network, Telecom & ICT"
    },
    "childIds": []
  },
  {
    "id": "ev-charging",
    "slug": "ev-charging",
    "level": 2,
    "parentId": "electrical-safety-smart-building",
    "label": {
      "fa": "شارژر خودروهای برقی",
      "en": "EV Charging"
    },
    "childIds": []
  },
  {
    "id": "recessed-lighting",
    "slug": "recessed-lighting",
    "level": 2,
    "parentId": "lighting",
    "label": {
      "fa": "چراغ‌های توکار",
      "en": "Recessed Lighting"
    },
    "childIds": []
  },
  {
    "id": "surface-mounted-lighting",
    "slug": "surface-mounted-lighting",
    "level": 2,
    "parentId": "lighting",
    "label": {
      "fa": "چراغ‌های روکار",
      "en": "Surface Mounted Lighting"
    },
    "childIds": []
  },
  {
    "id": "linear-lighting",
    "slug": "linear-lighting",
    "level": 2,
    "parentId": "lighting",
    "label": {
      "fa": "چراغ‌های خطی",
      "en": "Linear Lighting"
    },
    "childIds": []
  },
  {
    "id": "pendant-lighting",
    "slug": "pendant-lighting",
    "level": 2,
    "parentId": "lighting",
    "label": {
      "fa": "چراغ‌های آویز",
      "en": "Pendant Lighting"
    },
    "childIds": []
  },
  {
    "id": "chandeliers",
    "slug": "chandeliers",
    "level": 2,
    "parentId": "lighting",
    "label": {
      "fa": "لوسترها",
      "en": "Chandeliers"
    },
    "childIds": []
  },
  {
    "id": "spot-halogens",
    "slug": "spot-halogens",
    "level": 2,
    "parentId": "lighting",
    "label": {
      "fa": "هالوژن، اسپات و چراغ‌های نقطه‌ای",
      "en": "Spot & Halogen Lighting"
    },
    "childIds": []
  },
  {
    "id": "decorative-lamps",
    "slug": "decorative-lamps",
    "level": 2,
    "parentId": "lighting",
    "label": {
      "fa": "آباژور و چراغ‌های دکوراتیو",
      "en": "Decorative Lamps"
    },
    "childIds": []
  },
  {
    "id": "outdoor-landscape-lighting",
    "slug": "outdoor-landscape-lighting",
    "level": 2,
    "parentId": "lighting",
    "label": {
      "fa": "روشنایی خارجی و محوطه",
      "en": "Outdoor & Landscape Lighting"
    },
    "childIds": []
  },
  {
    "id": "inground-facade-floodlights",
    "slug": "inground-facade-floodlights",
    "level": 2,
    "parentId": "lighting",
    "label": {
      "fa": "چراغ‌های دفنی، نما و پروژکتور",
      "en": "Inground, Facade & Floodlights"
    },
    "childIds": []
  },
  {
    "id": "emergency-exit-lighting",
    "slug": "emergency-exit-lighting",
    "level": 2,
    "parentId": "lighting",
    "label": {
      "fa": "روشنایی اضطراری و علائم خروج",
      "en": "Emergency & Exit Lighting"
    },
    "childIds": []
  },
  {
    "id": "kitchen-casework",
    "slug": "kitchen-casework",
    "level": 2,
    "parentId": "kitchen-furniture-interior-equipment",
    "label": {
      "fa": "کابینت و تجهیزات ثابت آشپزخانه",
      "en": "Kitchen Casework"
    },
    "childIds": []
  },
  {
    "id": "kitchen-appliances",
    "slug": "kitchen-appliances",
    "level": 2,
    "parentId": "kitchen-furniture-interior-equipment",
    "label": {
      "fa": "لوازم آشپزخانه",
      "en": "Kitchen Appliances"
    },
    "childIds": []
  },
  {
    "id": "kitchen-sinks",
    "slug": "kitchen-sinks",
    "level": 2,
    "parentId": "kitchen-furniture-interior-equipment",
    "label": {
      "fa": "سینک آشپزخانه و متعلقات",
      "en": "Kitchen Sinks"
    },
    "childIds": []
  },
  {
    "id": "tables-counters",
    "slug": "tables-counters",
    "level": 2,
    "parentId": "kitchen-furniture-interior-equipment",
    "label": {
      "fa": "میز و کانتر",
      "en": "Tables & Counters"
    },
    "childIds": []
  },
  {
    "id": "seating-lounge",
    "slug": "seating-lounge",
    "level": 2,
    "parentId": "kitchen-furniture-interior-equipment",
    "label": {
      "fa": "صندلی و مبلمان نشیمن",
      "en": "Seating & Lounge"
    },
    "childIds": []
  },
  {
    "id": "office-furniture",
    "slug": "office-furniture",
    "level": 2,
    "parentId": "kitchen-furniture-interior-equipment",
    "label": {
      "fa": "مبلمان اداری",
      "en": "Office Furniture"
    },
    "childIds": []
  },
  {
    "id": "storage-shelving",
    "slug": "storage-shelving",
    "level": 2,
    "parentId": "kitchen-furniture-interior-equipment",
    "label": {
      "fa": "کمد، قفسه و سیستم‌های نگهداری",
      "en": "Storage & Shelving"
    },
    "childIds": []
  },
  {
    "id": "beds-bedroom",
    "slug": "beds-bedroom",
    "level": 2,
    "parentId": "kitchen-furniture-interior-equipment",
    "label": {
      "fa": "تخت و تجهیزات اتاق خواب",
      "en": "Beds & Bedroom"
    },
    "childIds": []
  },
  {
    "id": "special-interior-equipment",
    "slug": "special-interior-equipment",
    "level": 2,
    "parentId": "kitchen-furniture-interior-equipment",
    "label": {
      "fa": "تجهیزات داخلی تخصصی",
      "en": "Special Interior Equipment"
    },
    "childIds": []
  },
  {
    "id": "outdoor-furniture",
    "slug": "outdoor-furniture",
    "level": 2,
    "parentId": "kitchen-furniture-interior-equipment",
    "label": {
      "fa": "مبلمان فضای باز",
      "en": "Outdoor Furniture"
    },
    "childIds": []
  },
  {
    "id": "beams-columns",
    "slug": "beams-columns",
    "level": 2,
    "parentId": "structure-building-elements",
    "label": {
      "fa": "تیر و ستون",
      "en": "Beams & Columns"
    },
    "childIds": []
  },
  {
    "id": "steel-structure",
    "slug": "steel-structure",
    "level": 2,
    "parentId": "structure-building-elements",
    "label": {
      "fa": "اجزای سازه فلزی",
      "en": "Steel Structure"
    },
    "childIds": []
  },
  {
    "id": "concrete-structure",
    "slug": "concrete-structure",
    "level": 2,
    "parentId": "structure-building-elements",
    "label": {
      "fa": "اجزای سازه بتنی",
      "en": "Concrete Structure"
    },
    "childIds": []
  },
  {
    "id": "foundations-substructure",
    "slug": "foundations-substructure",
    "level": 2,
    "parentId": "structure-building-elements",
    "label": {
      "fa": "فونداسیون و زیرسازه",
      "en": "Foundations & Substructure"
    },
    "childIds": []
  },
  {
    "id": "slabs-decks",
    "slug": "slabs-decks",
    "level": 2,
    "parentId": "structure-building-elements",
    "label": {
      "fa": "دال، سقف سازه‌ای و Deck",
      "en": "Slabs, Decks & Structural Floors"
    },
    "childIds": []
  },
  {
    "id": "load-bearing-shear-walls",
    "slug": "load-bearing-shear-walls",
    "level": 2,
    "parentId": "structure-building-elements",
    "label": {
      "fa": "دیوارهای باربر و برشی",
      "en": "Load-Bearing & Shear Walls"
    },
    "childIds": []
  },
  {
    "id": "lightweight-structural-systems",
    "slug": "lightweight-structural-systems",
    "level": 2,
    "parentId": "structure-building-elements",
    "label": {
      "fa": "سیستم‌های سازه‌ای سبک",
      "en": "Lightweight Structural Systems"
    },
    "childIds": []
  },
  {
    "id": "stairs-ramps",
    "slug": "stairs-ramps",
    "level": 2,
    "parentId": "structure-building-elements",
    "label": {
      "fa": "پله و رمپ",
      "en": "Stairs & Ramps"
    },
    "childIds": []
  },
  {
    "id": "handrails-balustrades",
    "slug": "handrails-balustrades",
    "level": 2,
    "parentId": "structure-building-elements",
    "label": {
      "fa": "نرده، دست‌انداز و حفاظ",
      "en": "Handrails, Balustrades & Guards"
    },
    "childIds": []
  },
  {
    "id": "prefabricated-modular-elements",
    "slug": "prefabricated-modular-elements",
    "level": 2,
    "parentId": "structure-building-elements",
    "label": {
      "fa": "اجزای پیش‌ساخته و مدولار",
      "en": "Prefabricated & Modular Elements"
    },
    "childIds": []
  },
  {
    "id": "passenger-elevators",
    "slug": "passenger-elevators",
    "level": 2,
    "parentId": "vertical-transportation-circulation",
    "label": {
      "fa": "آسانسورهای مسافری",
      "en": "Passenger Elevators"
    },
    "childIds": []
  },
  {
    "id": "freight-service-elevators",
    "slug": "freight-service-elevators",
    "level": 2,
    "parentId": "vertical-transportation-circulation",
    "label": {
      "fa": "آسانسورهای باری و خدماتی",
      "en": "Freight & Service Elevators"
    },
    "childIds": []
  },
  {
    "id": "hospital-elevators",
    "slug": "hospital-elevators",
    "level": 2,
    "parentId": "vertical-transportation-circulation",
    "label": {
      "fa": "آسانسورهای بیمارستانی",
      "en": "Hospital Elevators"
    },
    "childIds": []
  },
  {
    "id": "panoramic-home-elevators",
    "slug": "panoramic-home-elevators",
    "level": 2,
    "parentId": "vertical-transportation-circulation",
    "label": {
      "fa": "آسانسورهای پانوراما و خانگی",
      "en": "Panoramic & Home Elevators"
    },
    "childIds": []
  },
  {
    "id": "escalators",
    "slug": "escalators",
    "level": 2,
    "parentId": "vertical-transportation-circulation",
    "label": {
      "fa": "پله‌برقی",
      "en": "Escalators"
    },
    "childIds": []
  },
  {
    "id": "moving-walks",
    "slug": "moving-walks",
    "level": 2,
    "parentId": "vertical-transportation-circulation",
    "label": {
      "fa": "پیاده‌رو متحرک",
      "en": "Moving Walks"
    },
    "childIds": []
  },
  {
    "id": "accessibility-platform-lifts",
    "slug": "accessibility-platform-lifts",
    "level": 2,
    "parentId": "vertical-transportation-circulation",
    "label": {
      "fa": "بالابرهای دسترسی و معلولین",
      "en": "Accessibility Platform Lifts"
    },
    "childIds": []
  },
  {
    "id": "industrial-vehicle-lifts",
    "slug": "industrial-vehicle-lifts",
    "level": 2,
    "parentId": "vertical-transportation-circulation",
    "label": {
      "fa": "بالابرهای صنعتی و خودروبر",
      "en": "Industrial & Vehicle Lifts"
    },
    "childIds": []
  },
  {
    "id": "elevator-doors-entrances",
    "slug": "elevator-doors-entrances",
    "level": 2,
    "parentId": "vertical-transportation-circulation",
    "label": {
      "fa": "درب و ورودی آسانسور",
      "en": "Elevator Doors & Entrances"
    },
    "childIds": []
  },
  {
    "id": "elevator-cab-controls",
    "slug": "elevator-cab-controls",
    "level": 2,
    "parentId": "vertical-transportation-circulation",
    "label": {
      "fa": "کنترل، کابین و متعلقات آسانسور",
      "en": "Elevator Cabs, Controls & Accessories"
    },
    "childIds": []
  }
] satisfies Category[];
