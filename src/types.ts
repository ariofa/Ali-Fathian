export type Language = 'fa' | 'en';

export interface Manufacturer {
  id: string;
  nameFa: string;
  nameEn: string;
  logo: string;
  descriptionFa: string;
  descriptionEn: string;
  website: string;
  email: string;
  phone: string;
  verified: boolean;
  tier: 'Free' | 'Premium' | 'VIP';
  addressFa?: string;
  addressEn?: string;
  stats?: {
    views: number;
    downloads: number;
    leads: number;
  };
}

export interface BIMObject {
  id: string;
  titleFa: string;
  titleEn: string;
  manufacturerId: string;
  category: string; // e.g. 'doors_windows', 'furniture', 'hvac', etc.
  subcategory: string;
  tagsFa: string[];
  tagsEn: string[];
  formats: string[]; // ['Revit', 'ArchiCAD', 'IFC', 'STEP', etc.]
  revitVersions?: string[]; // ['2022', '2023', '2024', '2025', '2026']
  lod: 'LOD 100' | 'LOD 200' | 'LOD 300' | 'LOD 350' | 'LOD 400';
  priceType: 'Free' | 'Paid' | 'Subscription-only';
  priceValue?: number; // in Tomans
  certification: string[]; // ['INSO', 'ISO 9001', 'CE', 'BHRC']
  isImported: boolean; // false for manufactured in Iran
  hasCutsheet: boolean;
  hasSample: boolean;
  fileSize: string; // e.g. "12.4 MB"
  downloadCount: number;
  rating: number;
  imageUrl: string;
  descriptionFa: string;
  descriptionEn: string;
  
  // Category-specific technical parameters
  specs: {
    [key: string]: string | number | boolean | string[];
  };
}

export interface Category {
  id: string;
  nameFa: string;
  nameEn: string;
  icon: string; // lucide icon name
  subcategories: {
    id: string;
    nameFa: string;
    nameEn: string;
  }[];
  specificFilters: {
    id: string;
    labelFa: string;
    labelEn: string;
    type: 'select' | 'checkbox' | 'range' | 'boolean';
    options?: { value: string; labelFa: string; labelEn: string }[];
    min?: number;
    max?: number;
    unit?: string;
  }[];
}

export interface FilterState {
  search: string;
  formats: string[];
  revitVersions: string[];
  manufacturers: string[];
  priceTypes: string[];
  certifications: string[];
  lods: string[];
  isImported: boolean | null;
  isIranBrand: boolean | null;
  hasCutsheet: boolean | null;
  hasSample: boolean | null;
  category: string | null;
  subcategory: string | null;
  specifics: { [key: string]: string | number | boolean | string[] };
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  companyName?: string;
  role: 'Modeler' | 'Manufacturer';
  favorites: string[]; // BIMObject IDs
  downloads: { objectId: string; date: string }[];
}
