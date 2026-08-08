import type { AttributeDefinition } from './types';

export const ATTRIBUTE_REGISTRY = [
  {
    "key": "abrasion_class",
    "label": {
      "fa": "کلاس سایش",
      "en": "Abrasion Class"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "abrasion_resistance",
    "label": {
      "fa": "مقاومت سایش",
      "en": "Abrasion Resistance"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "access",
    "label": {
      "fa": "دسترسی",
      "en": "Access"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "access_control",
    "label": {
      "fa": "کنترل دسترسی",
      "en": "Access Control"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "accessibility",
    "label": {
      "fa": "دسترسی‌پذیری",
      "en": "Accessibility"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "accessories",
    "label": {
      "fa": "متعلقات",
      "en": "Accessories"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "acoustic_insulation",
    "label": {
      "fa": "عایق صوتی",
      "en": "Acoustic Insulation"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "acoustic_performance",
    "label": {
      "fa": "آکوستیک",
      "en": "Acoustic Performance"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "air_outlet_type",
    "label": {
      "fa": "نوع خروجی هوا",
      "en": "Air Outlet Type"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "airflow_rate",
    "label": {
      "fa": "دبی هوا",
      "en": "Airflow Rate"
    },
    "dataType": "number_or_range",
    "unit": "m³/h یا L/min",
    "inputHint": "عدد یا بازه + واحد",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "angle",
    "label": {
      "fa": "زاویه",
      "en": "Angle"
    },
    "dataType": "number_or_range",
    "unit": "°",
    "inputHint": "عدد یا بازه + واحد",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "anti_corrosion_coating",
    "label": {
      "fa": "پوشش ضدخوردگی",
      "en": "Anti Corrosion Coating"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "application",
    "label": {
      "fa": "کاربرد",
      "en": "Application"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب چندگانه از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "application_location",
    "label": {
      "fa": "محل کاربرد",
      "en": "Application Location"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب چندگانه از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "application_surface",
    "label": {
      "fa": "سطح کاربرد",
      "en": "Application Surface"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب چندگانه از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "application_type",
    "label": {
      "fa": "نوع کاربرد",
      "en": "Application Type"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب چندگانه از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "backup_time",
    "label": {
      "fa": "زمان پشتیبانی",
      "en": "Backup Time"
    },
    "dataType": "number_or_range",
    "unit": "min یا h",
    "inputHint": "عدد یا بازه + واحد",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "base",
    "label": {
      "fa": "پایه",
      "en": "Base"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "battery_type",
    "label": {
      "fa": "نوع باتری",
      "en": "Battery Type"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "beam_angle",
    "label": {
      "fa": "زاویه پخش",
      "en": "Beam Angle"
    },
    "dataType": "number_or_range",
    "unit": "°",
    "inputHint": "عدد یا بازه + واحد",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "blade_direction",
    "label": {
      "fa": "جهت تیغه",
      "en": "Blade Direction"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "bms_compatibility",
    "label": {
      "fa": "سازگاری BMS",
      "en": "BMS Compatibility"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "cabin_dimensions",
    "label": {
      "fa": "ابعاد کابین",
      "en": "Cabin Dimensions"
    },
    "dataType": "number_or_range",
    "unit": "mm",
    "inputHint": "عدد یا بازه + واحد",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "cabinet_compatibility",
    "label": {
      "fa": "سازگاری با کابینت",
      "en": "Cabinet Compatibility"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "cable_access",
    "label": {
      "fa": "دسترسی کابل",
      "en": "Cable Access"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "cable_management",
    "label": {
      "fa": "کابل‌مدیریت",
      "en": "Cable Management"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "capacity",
    "label": {
      "fa": "ظرفیت",
      "en": "Capacity"
    },
    "dataType": "number_or_range",
    "unit": "وابسته به نوع محصول",
    "inputHint": "عدد یا بازه + واحد",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "cartridge",
    "label": {
      "fa": "کارتریج",
      "en": "Cartridge"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "ceiling_type",
    "label": {
      "fa": "نوع سقف",
      "en": "Ceiling Type"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "charger_type",
    "label": {
      "fa": "نوع شارژر",
      "en": "Charger Type"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "عدد یا بازه + واحد",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "chemical_resistance",
    "label": {
      "fa": "مقاومت شیمیایی",
      "en": "Chemical Resistance"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "click_system",
    "label": {
      "fa": "سیستم کلیک",
      "en": "Click System"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "coating",
    "label": {
      "fa": "پوشش",
      "en": "Coating"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "coating_material",
    "label": {
      "fa": "جنس پوشش",
      "en": "Coating Material"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "coating_process",
    "label": {
      "fa": "پوشش‌دهی",
      "en": "Coating Process"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "coating_type",
    "label": {
      "fa": "نوع پوشش",
      "en": "Coating Type"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "colour",
    "label": {
      "fa": "رنگ",
      "en": "Colour"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "colour_and_finish",
    "label": {
      "fa": "رنگ و فینیش",
      "en": "Colour And Finish"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "colour_or_finish",
    "label": {
      "fa": "رنگ یا فینیش",
      "en": "Colour Or Finish"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "colour_or_transparency",
    "label": {
      "fa": "رنگ یا شفافیت",
      "en": "Colour Or Transparency"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "colour_rendering_index",
    "label": {
      "fa": "CRI",
      "en": "Colour Rendering Index"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "colour_temperature",
    "label": {
      "fa": "دمای رنگ",
      "en": "Colour Temperature"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "عدد یا بازه + واحد",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "component_type",
    "label": {
      "fa": "نوع قطعه",
      "en": "Component Type"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "compressive_strength",
    "label": {
      "fa": "مقاومت فشاری",
      "en": "Compressive Strength"
    },
    "dataType": "number_or_range",
    "unit": "lm",
    "inputHint": "عدد یا بازه + واحد",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "concrete_strength",
    "label": {
      "fa": "مقاومت بتن",
      "en": "Concrete Strength"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "concrete_type",
    "label": {
      "fa": "نوع بتن",
      "en": "Concrete Type"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "condenser_type",
    "label": {
      "fa": "نوع کندانسور",
      "en": "Condenser Type"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "connection",
    "label": {
      "fa": "اتصال",
      "en": "Connection"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "connection_details",
    "label": {
      "fa": "جزئیات اتصال",
      "en": "Connection Details"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "connection_method",
    "label": {
      "fa": "روش اتصال",
      "en": "Connection Method"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "connection_type",
    "label": {
      "fa": "نوع اتصال",
      "en": "Connection Type"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "construction_method",
    "label": {
      "fa": "روش اجرا",
      "en": "Construction Method"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "construction_system",
    "label": {
      "fa": "سیستم ساخت",
      "en": "Construction System"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "control",
    "label": {
      "fa": "کنترل",
      "en": "Control"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "control_method",
    "label": {
      "fa": "روش کنترل",
      "en": "Control Method"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "control_type",
    "label": {
      "fa": "نوع کنترل",
      "en": "Control Type"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "cop_eer",
    "label": {
      "fa": "COP/EER",
      "en": "COP / EER"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "current",
    "label": {
      "fa": "جریان",
      "en": "Current"
    },
    "dataType": "number_or_range",
    "unit": "A",
    "inputHint": "عدد یا بازه + واحد",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "dali_compatibility",
    "label": {
      "fa": "DALI",
      "en": "DALI Compatibility"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "damper_type",
    "label": {
      "fa": "نوع دمپر",
      "en": "Damper Type"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "declared_standard",
    "label": {
      "fa": "استاندارد اعلامی",
      "en": "Declared Standard"
    },
    "dataType": "reference_or_url",
    "unit": null,
    "inputHint": "متن + لینک/فایل منبع",
    "searchable": true,
    "comparable": false,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "declared_standards",
    "label": {
      "fa": "استانداردهای اعلام‌شده",
      "en": "Declared Standards"
    },
    "dataType": "reference_or_url",
    "unit": null,
    "inputHint": "متن + لینک/فایل منبع",
    "searchable": true,
    "comparable": false,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "density",
    "label": {
      "fa": "چگالی",
      "en": "Density"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "depth",
    "label": {
      "fa": "عمق",
      "en": "Depth"
    },
    "dataType": "number_or_range",
    "unit": "mm",
    "inputHint": "عدد یا بازه + واحد",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "diameter",
    "label": {
      "fa": "قطر",
      "en": "Diameter"
    },
    "dataType": "number_or_range",
    "unit": "mm",
    "inputHint": "عدد یا بازه + واحد",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "diameter_or_dimensions",
    "label": {
      "fa": "قطر یا ابعاد",
      "en": "Diameter Or Dimensions"
    },
    "dataType": "number_or_range",
    "unit": "mm",
    "inputHint": "عدد یا بازه + واحد",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "dimensions",
    "label": {
      "fa": "ابعاد",
      "en": "Dimensions"
    },
    "dataType": "number_or_range",
    "unit": "mm",
    "inputHint": "عدد یا بازه + واحد",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "dimmable",
    "label": {
      "fa": "Dimmable",
      "en": "Dimmable"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "display",
    "label": {
      "fa": "نمایشگر",
      "en": "Display"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "door",
    "label": {
      "fa": "درب",
      "en": "Door"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "door_closer",
    "label": {
      "fa": "آرام‌بند",
      "en": "Door Closer"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "door_material",
    "label": {
      "fa": "جنس درب",
      "en": "Door Material"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "door_type",
    "label": {
      "fa": "نوع درب",
      "en": "Door Type"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "door_window_compatibility",
    "label": {
      "fa": "سازگاری با در یا پنجره",
      "en": "Door Window Compatibility"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "drain_outlet",
    "label": {
      "fa": "خروجی فاضلاب",
      "en": "Drain Outlet"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "drainage",
    "label": {
      "fa": "زهکشی",
      "en": "Drainage"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "duct_type",
    "label": {
      "fa": "نوع کانال",
      "en": "Duct Type"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "efficiency",
    "label": {
      "fa": "راندمان",
      "en": "Efficiency"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "electrical_supply",
    "label": {
      "fa": "برق",
      "en": "Electrical Supply"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "elevator_type",
    "label": {
      "fa": "نوع آسانسور",
      "en": "Elevator Type"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "emergency_mode",
    "label": {
      "fa": "حالت اضطراری",
      "en": "Emergency Mode"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "energy",
    "label": {
      "fa": "انرژی",
      "en": "Energy"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "equipment_type",
    "label": {
      "fa": "نوع تجهیز",
      "en": "Equipment Type"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "ergonomics",
    "label": {
      "fa": "ارگونومی",
      "en": "Ergonomics"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "facade_type",
    "label": {
      "fa": "نوع نما",
      "en": "Facade Type"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "fan_type",
    "label": {
      "fa": "نوع فن",
      "en": "Fan Type"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "faucet_type",
    "label": {
      "fa": "نوع شیر",
      "en": "Faucet Type"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "filter",
    "label": {
      "fa": "فیلتر",
      "en": "Filter"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "finish",
    "label": {
      "fa": "فینیش",
      "en": "Finish"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "finish_or_colour",
    "label": {
      "fa": "روکش یا رنگ",
      "en": "Finish Or Colour"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "fire_resistance",
    "label": {
      "fa": "مقاومت حریق",
      "en": "Fire Resistance"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "fire_suppression_system",
    "label": {
      "fa": "سیستم اطفا",
      "en": "Fire Suppression System"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "flexibility",
    "label": {
      "fa": "انعطاف‌پذیری",
      "en": "Flexibility"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "floor_wall_compatibility",
    "label": {
      "fa": "سازگاری با کف/دیوار",
      "en": "Floor Wall Compatibility"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "flooring_type",
    "label": {
      "fa": "نوع کف‌پوش",
      "en": "Flooring Type"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "flow_rate",
    "label": {
      "fa": "دبی",
      "en": "Flow Rate"
    },
    "dataType": "number_or_range",
    "unit": "m³/h یا L/min",
    "inputHint": "عدد یا بازه + واحد",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "foundation_type",
    "label": {
      "fa": "نوع فونداسیون",
      "en": "Foundation Type"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "frame_material",
    "label": {
      "fa": "جنس فریم",
      "en": "Frame Material"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "frame_structure",
    "label": {
      "fa": "ساختار فریم",
      "en": "Frame Structure"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "fuel",
    "label": {
      "fa": "سوخت",
      "en": "Fuel"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "fuel_or_battery",
    "label": {
      "fa": "سوخت یا باتری",
      "en": "Fuel Or Battery"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "glazing",
    "label": {
      "fa": "شیشه",
      "en": "Glazing"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "glazing_type",
    "label": {
      "fa": "نوع شیشه",
      "en": "Glazing Type"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "hardware",
    "label": {
      "fa": "یراق",
      "en": "Hardware"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "hardware_type",
    "label": {
      "fa": "نوع یراق",
      "en": "Hardware Type"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "head",
    "label": {
      "fa": "هد",
      "en": "Head"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "height",
    "label": {
      "fa": "ارتفاع",
      "en": "Height"
    },
    "dataType": "number_or_range",
    "unit": "mm",
    "inputHint": "عدد یا بازه + واحد",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "ik_impact_rating",
    "label": {
      "fa": "IK",
      "en": "IK Impact Rating"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "impact_resistance",
    "label": {
      "fa": "مقاومت ضربه",
      "en": "Impact Resistance"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "indoor_outdoor",
    "label": {
      "fa": "داخلی یا خارجی",
      "en": "Indoor Outdoor"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "inlet_water_quality",
    "label": {
      "fa": "کیفیت آب ورودی",
      "en": "Inlet Water Quality"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "installation",
    "label": {
      "fa": "نصب",
      "en": "Installation"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "installation_details",
    "label": {
      "fa": "جزئیات نصب",
      "en": "Installation Details"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "installation_height",
    "label": {
      "fa": "ارتفاع نصب",
      "en": "Installation Height"
    },
    "dataType": "number_or_range",
    "unit": "mm",
    "inputHint": "عدد یا بازه + واحد",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "installation_location",
    "label": {
      "fa": "محل نصب",
      "en": "Installation Location"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب چندگانه از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "installation_method",
    "label": {
      "fa": "روش نصب",
      "en": "Installation Method"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "installation_pattern",
    "label": {
      "fa": "الگوی نصب",
      "en": "Installation Pattern"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "installation_slope",
    "label": {
      "fa": "شیب نصب",
      "en": "Installation Slope"
    },
    "dataType": "number_or_range",
    "unit": "° یا %",
    "inputHint": "عدد یا بازه + واحد",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "installation_temperature",
    "label": {
      "fa": "دمای اجرا",
      "en": "Installation Temperature"
    },
    "dataType": "number_or_range",
    "unit": "°C یا K",
    "inputHint": "عدد یا بازه + واحد",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "installation_type",
    "label": {
      "fa": "نوع نصب",
      "en": "Installation Type"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب چندگانه از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "insulation",
    "label": {
      "fa": "عایق",
      "en": "Insulation"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "insulation_type",
    "label": {
      "fa": "نوع عایق",
      "en": "Insulation Type"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "internal_equipment",
    "label": {
      "fa": "تجهیزات داخلی",
      "en": "Internal Equipment"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "ip_rating",
    "label": {
      "fa": "IP",
      "en": "IP Rating"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "layer_thickness",
    "label": {
      "fa": "ضخامت لایه",
      "en": "Layer Thickness"
    },
    "dataType": "number_or_range",
    "unit": "mm",
    "inputHint": "عدد یا بازه + واحد",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "layering",
    "label": {
      "fa": "لایه‌بندی",
      "en": "Layering"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "layout_pattern",
    "label": {
      "fa": "الگوی چیدمان",
      "en": "Layout Pattern"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "length",
    "label": {
      "fa": "طول",
      "en": "Length"
    },
    "dataType": "number_or_range",
    "unit": "mm",
    "inputHint": "عدد یا بازه + واحد",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "lift_type",
    "label": {
      "fa": "نوع بالابر",
      "en": "Lift Type"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "load_bearing_capacity",
    "label": {
      "fa": "باربری",
      "en": "Load Bearing Capacity"
    },
    "dataType": "number_or_range",
    "unit": "kN یا kg/m²",
    "inputHint": "عدد یا بازه + واحد",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "load_capacity",
    "label": {
      "fa": "ظرفیت بار",
      "en": "Load Capacity"
    },
    "dataType": "number_or_range",
    "unit": "وابسته به نوع محصول",
    "inputHint": "عدد یا بازه + واحد",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "load_resistance",
    "label": {
      "fa": "مقاومت بار",
      "en": "Load Resistance"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "loading",
    "label": {
      "fa": "بارگذاری",
      "en": "Loading"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "lock",
    "label": {
      "fa": "قفل",
      "en": "Lock"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "lock_type",
    "label": {
      "fa": "نوع قفل",
      "en": "Lock Type"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "low_e_coating",
    "label": {
      "fa": "پوشش Low-E",
      "en": "Low E Coating"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "luminaire_type",
    "label": {
      "fa": "نوع چراغ",
      "en": "Luminaire Type"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "luminous_flux",
    "label": {
      "fa": "لومن",
      "en": "Luminous Flux"
    },
    "dataType": "number_or_range",
    "unit": "lm",
    "inputHint": "عدد یا بازه + واحد",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "luminous_flux_per_metre",
    "label": {
      "fa": "لومن بر متر",
      "en": "Luminous Flux Per Metre"
    },
    "dataType": "number_or_range",
    "unit": "lm",
    "inputHint": "عدد یا بازه + واحد",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "maintenance",
    "label": {
      "fa": "نگهداری",
      "en": "Maintenance"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "manual_motorized_control",
    "label": {
      "fa": "کنترل دستی/موتوری",
      "en": "Manual Motorized Control"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "manufacturing_method",
    "label": {
      "fa": "روش ساخت",
      "en": "Manufacturing Method"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "material",
    "label": {
      "fa": "جنس",
      "en": "Material"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "material_type",
    "label": {
      "fa": "نوع مصالح",
      "en": "Material Type"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "member_type",
    "label": {
      "fa": "نوع عضو",
      "en": "Member Type"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "module",
    "label": {
      "fa": "ماژول",
      "en": "Module"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "module_type",
    "label": {
      "fa": "نوع ماژول",
      "en": "Module Type"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "moisture_resistance",
    "label": {
      "fa": "مقاومت رطوبت",
      "en": "Moisture Resistance"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "motor",
    "label": {
      "fa": "موتور",
      "en": "Motor"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "motor_or_operator",
    "label": {
      "fa": "موتور یا اپراتور",
      "en": "Motor Or Operator"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "motorized_or_manual",
    "label": {
      "fa": "موتوری یا دستی",
      "en": "Motorized Or Manual"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "network",
    "label": {
      "fa": "شبکه",
      "en": "Network"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "network_connection",
    "label": {
      "fa": "اتصال شبکه",
      "en": "Network Connection"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "network_speed",
    "label": {
      "fa": "سرعت شبکه",
      "en": "Network Speed"
    },
    "dataType": "number_or_range",
    "unit": "m/s یا m/min",
    "inputHint": "عدد یا بازه + واحد",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "noise_reduction_coefficient",
    "label": {
      "fa": "NRC",
      "en": "Noise Reduction Coefficient"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "number_of_bowls",
    "label": {
      "fa": "تعداد لگن",
      "en": "Number Of Bowls"
    },
    "dataType": "number_or_range",
    "unit": "عدد",
    "inputHint": "عدد یا بازه + واحد",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "number_of_glazing_layers",
    "label": {
      "fa": "تعداد جداره",
      "en": "Number Of Glazing Layers"
    },
    "dataType": "number_or_range",
    "unit": "عدد",
    "inputHint": "عدد یا بازه + واحد",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "number_of_layers",
    "label": {
      "fa": "تعداد لایه",
      "en": "Number Of Layers"
    },
    "dataType": "number_or_range",
    "unit": "عدد",
    "inputHint": "عدد یا بازه + واحد",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "number_of_leaves",
    "label": {
      "fa": "تعداد لنگه",
      "en": "Number Of Leaves"
    },
    "dataType": "number_or_range",
    "unit": "عدد",
    "inputHint": "عدد یا بازه + واحد",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "number_of_light_sources",
    "label": {
      "fa": "تعداد منبع نور",
      "en": "Number Of Light Sources"
    },
    "dataType": "number_or_range",
    "unit": "عدد",
    "inputHint": "عدد یا بازه + واحد",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "number_of_modules",
    "label": {
      "fa": "تعداد ماژول",
      "en": "Number Of Modules"
    },
    "dataType": "number_or_range",
    "unit": "عدد",
    "inputHint": "عدد یا بازه + واحد",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "number_of_nozzles",
    "label": {
      "fa": "تعداد نازل",
      "en": "Number Of Nozzles"
    },
    "dataType": "number_or_range",
    "unit": "عدد",
    "inputHint": "عدد یا بازه + واحد",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "number_of_stops",
    "label": {
      "fa": "تعداد توقف",
      "en": "Number Of Stops"
    },
    "dataType": "number_or_range",
    "unit": "عدد",
    "inputHint": "عدد یا بازه + واحد",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "opening_control",
    "label": {
      "fa": "کنترل بازشو",
      "en": "Opening Control"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "opening_dimensions",
    "label": {
      "fa": "ابعاد بازشو",
      "en": "Opening Dimensions"
    },
    "dataType": "number_or_range",
    "unit": "mm",
    "inputHint": "عدد یا بازه + واحد",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "opening_mechanism",
    "label": {
      "fa": "مکانیزم بازشو",
      "en": "Opening Mechanism"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "opening_span",
    "label": {
      "fa": "دهانه",
      "en": "Opening Span"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "opening_speed",
    "label": {
      "fa": "سرعت بازشو",
      "en": "Opening Speed"
    },
    "dataType": "number_or_range",
    "unit": "m/s یا m/min",
    "inputHint": "عدد یا بازه + واحد",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "opening_type",
    "label": {
      "fa": "نوع بازشو",
      "en": "Opening Type"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "opening_width",
    "label": {
      "fa": "عرض بازشو",
      "en": "Opening Width"
    },
    "dataType": "number_or_range",
    "unit": "mm",
    "inputHint": "عدد یا بازه + واحد",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "operating_temperature",
    "label": {
      "fa": "دمای کار",
      "en": "Operating Temperature"
    },
    "dataType": "number_or_range",
    "unit": "°C یا K",
    "inputHint": "عدد یا بازه + واحد",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "operation_type",
    "label": {
      "fa": "نوع عملکرد",
      "en": "Operation Type"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "orientation",
    "label": {
      "fa": "جهت‌پذیری",
      "en": "Orientation"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "outlet",
    "label": {
      "fa": "خروجی",
      "en": "Outlet"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "outlet_type",
    "label": {
      "fa": "نوع خروجی",
      "en": "Outlet Type"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "panel_dimensions",
    "label": {
      "fa": "ابعاد پنل",
      "en": "Panel Dimensions"
    },
    "dataType": "number_or_range",
    "unit": "mm",
    "inputHint": "عدد یا بازه + واحد",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "panel_material",
    "label": {
      "fa": "جنس پنل",
      "en": "Panel Material"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "panel_type",
    "label": {
      "fa": "نوع تابلو",
      "en": "Panel Type"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "piping_system",
    "label": {
      "fa": "سیستم لوله‌کشی",
      "en": "Piping System"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "port",
    "label": {
      "fa": "پورت",
      "en": "Port"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "power",
    "label": {
      "fa": "توان",
      "en": "Power"
    },
    "dataType": "number_or_range",
    "unit": "W یا kW",
    "inputHint": "عدد یا بازه + واحد",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "power_source",
    "label": {
      "fa": "برق یا گاز",
      "en": "Power Source"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "power_supply",
    "label": {
      "fa": "منبع تغذیه",
      "en": "Power Supply"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "precast_or_cast_in_situ",
    "label": {
      "fa": "پیش‌ساخته/درجا",
      "en": "Precast Or Cast In Situ"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "pressure",
    "label": {
      "fa": "فشار",
      "en": "Pressure"
    },
    "dataType": "number_or_range",
    "unit": "lm",
    "inputHint": "عدد یا بازه + واحد",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "product_type",
    "label": {
      "fa": "نوع محصول",
      "en": "Product Type"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "profile_material",
    "label": {
      "fa": "جنس پروفیل",
      "en": "Profile Material"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "protective_layer",
    "label": {
      "fa": "لایه محافظ",
      "en": "Protective Layer"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "protocol",
    "label": {
      "fa": "پروتکل",
      "en": "Protocol"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "pump_type",
    "label": {
      "fa": "نوع پمپ",
      "en": "Pump Type"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "rack_mount",
    "label": {
      "fa": "رک‌مونت",
      "en": "Rack Mount"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "railing",
    "label": {
      "fa": "نرده",
      "en": "Railing"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "refrigerant",
    "label": {
      "fa": "مبرد",
      "en": "Refrigerant"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "reinforcement",
    "label": {
      "fa": "آرماتور",
      "en": "Reinforcement"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "remote_control",
    "label": {
      "fa": "کنترل از راه دور",
      "en": "Remote Control"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "required_clearance",
    "label": {
      "fa": "فضای موردنیاز",
      "en": "Required Clearance"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "required_electrical_supply",
    "label": {
      "fa": "برق موردنیاز",
      "en": "Required Electrical Supply"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "resistance",
    "label": {
      "fa": "مقاومت",
      "en": "Resistance"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "resolution",
    "label": {
      "fa": "رزولوشن",
      "en": "Resolution"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "roof_type",
    "label": {
      "fa": "نوع بام",
      "en": "Roof Type"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "route_type",
    "label": {
      "fa": "نوع مسیر",
      "en": "Route Type"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "safety",
    "label": {
      "fa": "ایمنی",
      "en": "Safety"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "seat_height",
    "label": {
      "fa": "ارتفاع نشیمن",
      "en": "Seat Height"
    },
    "dataType": "number_or_range",
    "unit": "mm",
    "inputHint": "عدد یا بازه + واحد",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "section_dimensions",
    "label": {
      "fa": "ابعاد مقطع",
      "en": "Section Dimensions"
    },
    "dataType": "number_or_range",
    "unit": "mm",
    "inputHint": "عدد یا بازه + واحد",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "section_profile",
    "label": {
      "fa": "مقطع",
      "en": "Section Profile"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "section_shape",
    "label": {
      "fa": "شکل مقطع",
      "en": "Section Shape"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "security",
    "label": {
      "fa": "امنیت",
      "en": "Security"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "security_rating",
    "label": {
      "fa": "سطح امنیت",
      "en": "Security Rating"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "self_test",
    "label": {
      "fa": "تست خودکار",
      "en": "Self Test"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "sensor",
    "label": {
      "fa": "حسگر",
      "en": "Sensor"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "sensors",
    "label": {
      "fa": "سنسورها",
      "en": "Sensors"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "services_access",
    "label": {
      "fa": "دسترسی تأسیسات",
      "en": "Services Access"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "shading",
    "label": {
      "fa": "سایه‌بان",
      "en": "Shading"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "shape",
    "label": {
      "fa": "شکل",
      "en": "Shape"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "sink_type",
    "label": {
      "fa": "نوع سینک",
      "en": "Sink Type"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "skylight_type",
    "label": {
      "fa": "نوع نورگیر",
      "en": "Skylight Type"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "slip_resistance",
    "label": {
      "fa": "مقاومت لغزش",
      "en": "Slip Resistance"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "slope",
    "label": {
      "fa": "شیب",
      "en": "Slope"
    },
    "dataType": "number_or_range",
    "unit": "° یا %",
    "inputHint": "عدد یا بازه + واحد",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "sloped_or_flat",
    "label": {
      "fa": "شیب یا مسطح",
      "en": "Sloped Or Flat"
    },
    "dataType": "number_or_range",
    "unit": "° یا %",
    "inputHint": "عدد یا بازه + واحد",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "smart_building_scenario",
    "label": {
      "fa": "سناریوی هوشمندسازی",
      "en": "Smart Building Scenario"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "smoke_extraction",
    "label": {
      "fa": "تخلیه دود",
      "en": "Smoke Extraction"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "smoke_rating",
    "label": {
      "fa": "Smoke rating",
      "en": "Smoke Rating"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "soil",
    "label": {
      "fa": "خاک",
      "en": "Soil"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "solar_heat_gain_coefficient",
    "label": {
      "fa": "SHGC",
      "en": "Solar Heat Gain Coefficient"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "sound_absorption",
    "label": {
      "fa": "جذب صوت",
      "en": "Sound Absorption"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "sound_level",
    "label": {
      "fa": "صدا",
      "en": "Sound Level"
    },
    "dataType": "enum",
    "unit": "dB",
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "speed",
    "label": {
      "fa": "سرعت",
      "en": "Speed"
    },
    "dataType": "number_or_range",
    "unit": "m/s یا m/min",
    "inputHint": "عدد یا بازه + واحد",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "stair_width",
    "label": {
      "fa": "عرض پله",
      "en": "Stair Width"
    },
    "dataType": "number_or_range",
    "unit": "mm",
    "inputHint": "عدد یا بازه + واحد",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "standard",
    "label": {
      "fa": "استاندارد",
      "en": "Standard"
    },
    "dataType": "reference_or_url",
    "unit": null,
    "inputHint": "متن + لینک/فایل منبع",
    "searchable": true,
    "comparable": false,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "static_pressure",
    "label": {
      "fa": "فشار استاتیک",
      "en": "Static Pressure"
    },
    "dataType": "number_or_range",
    "unit": "lm",
    "inputHint": "عدد یا بازه + واحد",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "steel",
    "label": {
      "fa": "فولاد",
      "en": "Steel"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "stretcher_compatibility",
    "label": {
      "fa": "برانکارد",
      "en": "Stretcher Compatibility"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "style",
    "label": {
      "fa": "سبک",
      "en": "Style"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "substrate",
    "label": {
      "fa": "سطح زیرکار",
      "en": "Substrate"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "substructure",
    "label": {
      "fa": "زیرسازی",
      "en": "Substructure"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "surface_class",
    "label": {
      "fa": "کلاس سطح",
      "en": "Surface Class"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "surface_coating",
    "label": {
      "fa": "پوشش سطح",
      "en": "Surface Coating"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "suspension_length",
    "label": {
      "fa": "طول آویز",
      "en": "Suspension Length"
    },
    "dataType": "number_or_range",
    "unit": "mm",
    "inputHint": "عدد یا بازه + واحد",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "suspension_system",
    "label": {
      "fa": "سیستم آویز",
      "en": "Suspension System"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "system",
    "label": {
      "fa": "سیستم",
      "en": "System"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "system_height",
    "label": {
      "fa": "ارتفاع سیستم",
      "en": "System Height"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "عدد یا بازه + واحد",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "system_type",
    "label": {
      "fa": "نوع سیستم",
      "en": "System Type"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "tank_type",
    "label": {
      "fa": "نوع مخزن",
      "en": "Tank Type"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "temperature",
    "label": {
      "fa": "دما",
      "en": "Temperature"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "thermal_insulation",
    "label": {
      "fa": "عایق حرارتی",
      "en": "Thermal Insulation"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "thermal_resistance",
    "label": {
      "fa": "مقاومت حرارتی",
      "en": "Thermal Resistance"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "thermal_transmittance",
    "label": {
      "fa": "ضریب انتقال حرارت",
      "en": "Thermal Transmittance"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "thickness",
    "label": {
      "fa": "ضخامت",
      "en": "Thickness"
    },
    "dataType": "number_or_range",
    "unit": "mm",
    "inputHint": "عدد یا بازه + واحد",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "throw_direction",
    "label": {
      "fa": "جهت پرتاب",
      "en": "Throw Direction"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "tile_dimensions",
    "label": {
      "fa": "ابعاد تایل",
      "en": "Tile Dimensions"
    },
    "dataType": "number_or_range",
    "unit": "mm",
    "inputHint": "عدد یا بازه + واحد",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "traffic_rating",
    "label": {
      "fa": "ترافیک مجاز",
      "en": "Traffic Rating"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "transport",
    "label": {
      "fa": "حمل",
      "en": "Transport"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "travel_direction",
    "label": {
      "fa": "جهت حرکت",
      "en": "Travel Direction"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "travel_height",
    "label": {
      "fa": "ارتفاع حرکت",
      "en": "Travel Height"
    },
    "dataType": "number_or_range",
    "unit": "mm",
    "inputHint": "عدد یا بازه + واحد",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "travel_path_height",
    "label": {
      "fa": "ارتفاع مسیر",
      "en": "Travel Path Height"
    },
    "dataType": "number_or_range",
    "unit": "mm",
    "inputHint": "عدد یا بازه + واحد",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "uv_resistance",
    "label": {
      "fa": "مقاومت UV",
      "en": "Uv Resistance"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "vertical_travel",
    "label": {
      "fa": "سفر عمودی",
      "en": "Vertical Travel"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "visible_light_transmittance",
    "label": {
      "fa": "VLT",
      "en": "Visible Light Transmittance"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "volatile_organic_compounds",
    "label": {
      "fa": "VOC",
      "en": "Volatile Organic Compounds"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "voltage",
    "label": {
      "fa": "ولتاژ",
      "en": "Voltage"
    },
    "dataType": "number_or_range",
    "unit": "V",
    "inputHint": "عدد یا بازه + واحد",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "wall_type",
    "label": {
      "fa": "نوع دیوار",
      "en": "Wall Type"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "wash_resistance",
    "label": {
      "fa": "مقاومت شست‌وشو",
      "en": "Wash Resistance"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "water_absorption",
    "label": {
      "fa": "جذب آب",
      "en": "Water Absorption"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "water_consumption",
    "label": {
      "fa": "مصرف آب",
      "en": "Water Consumption"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "waterproofing",
    "label": {
      "fa": "آب‌بندی",
      "en": "Waterproofing"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "weather_resistance",
    "label": {
      "fa": "مقاومت آب‌وهوا",
      "en": "Weather Resistance"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "weight",
    "label": {
      "fa": "وزن",
      "en": "Weight"
    },
    "dataType": "number_or_range",
    "unit": "kg",
    "inputHint": "عدد یا بازه + واحد",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "weight_capacity",
    "label": {
      "fa": "ظرفیت وزن",
      "en": "Weight Capacity"
    },
    "dataType": "number_or_range",
    "unit": "kg",
    "inputHint": "عدد یا بازه + واحد",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "width",
    "label": {
      "fa": "عرض",
      "en": "Width"
    },
    "dataType": "number_or_range",
    "unit": "mm",
    "inputHint": "عدد یا بازه + واحد",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "wind_resistance",
    "label": {
      "fa": "مقاومت باد",
      "en": "Wind Resistance"
    },
    "dataType": "enum",
    "unit": null,
    "inputHint": "انتخاب از فهرست کنترل‌شده",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  },
  {
    "key": "working_pressure",
    "label": {
      "fa": "فشار کاری",
      "en": "Working Pressure"
    },
    "dataType": "number_or_range",
    "unit": "lm",
    "inputHint": "عدد یا بازه + واحد",
    "searchable": true,
    "comparable": true,
    "definitionStatus": "draft_for_domain_review"
  }
] satisfies AttributeDefinition[];
