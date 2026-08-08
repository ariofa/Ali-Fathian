/**
 * Front-end catalogue contract — v0.1
 *
 * This module has no API or persistence dependency. IDs and attribute keys are
 * deliberately stable so the same contract can later be mapped to a database/API.
 */
export type LocalizedText = { fa: string; en: string };
export type CategoryLevel = 1 | 2;
export type AttributeDataType =
  | 'enum'
  | 'multi_enum'
  | 'text'
  | 'rich_text'
  | 'number_or_range'
  | 'boolean'
  | 'identifier'
  | 'date'
  | 'url_or_asset'
  | 'asset'
  | 'relation'
  | 'controlled_relation'
  | 'controlled_tags'
  | 'reference_or_url'
  | 'audit_log';

export type DataScope =
  | 'product'
  | 'product_series'
  | 'variant'
  | 'bim_file'
  | 'document'
  | 'review_record'
  | 'system';

export type PublicationStatus = 'draft' | 'pending_review' | 'needs_revision' | 'publishable' | 'published' | 'archived';
export type ProductionStatus = 'active' | 'made_to_order' | 'discontinued' | 'unknown';
export type BimAvailability = 'not_available' | 'in_preparation' | 'available' | 'pending_review' | 'published' | 'archived';
export type DataLevel = 'DATA_1' | 'DATA_2' | 'DATA_3';
export type DataLevelLabel = 'basic_information' | 'technical_information' | 'design_data';
export type AttributePriority = 'primary' | 'advanced';
export type ValueApplicability = 'applicable' | 'not_applicable' | 'unknown';

export interface Category {
  id: string;
  slug: string;
  level: CategoryLevel;
  parentId?: string;
  label: LocalizedText;
  /** Only level-1 categories may have children. */
  childIds: string[];
}

export interface AttributeDefinition {
  key: string;
  label: LocalizedText;
  dataType: AttributeDataType;
  unit?: string;
  inputHint: string;
  searchable: boolean;
  comparable: boolean;
  /** The registry is ready for front-end use; controlled values are added by category in a later step. */
  definitionStatus: 'draft_for_domain_review';
}

export interface CategoryAttributeRule {
  categoryId: string;
  attributeKey: string;
  priority: AttributePriority;
  requiredForLevel: 'DATA_2' | 'DATA_3';
  scope: DataScope;
  filterable: boolean;
  comparable: boolean;
  weight: 2 | 5;
  evidenceRequired: boolean;
  inputHint: string;
}

export interface AttributeSource {
  id: string;
  kind: 'manufacturer_datasheet' | 'manufacturer_catalog' | 'manufacturer_website' | 'technical_document' | 'sample';
  title: string;
  url?: string;
  publishedAt?: string;
}

export interface AttributeValue {
  attributeKey: string;
  applicability: ValueApplicability;
  /** Use a scalar/list for enums, or number/min/max + unit for measured values. */
  value?: string | number | boolean | string[];
  min?: number;
  max?: number;
  unit?: string;
  sourceId?: string;
  updatedAt?: string;
}

export interface ProductVariant {
  id: string;
  sku?: string;
  label: LocalizedText;
  status: ProductionStatus;
  attributes: AttributeValue[];
}

export interface ProductDocument {
  id: string;
  type: 'catalog' | 'datasheet' | 'installation_guide' | 'technical_drawing' | 'image';
  title: LocalizedText;
  url?: string;
  sourceId?: string;
  isSample?: boolean;
}

export interface BimFile {
  id: string;
  availability: BimAvailability;
  contentType: 'manufacturer_object' | 'generic_object' | 'system' | 'material' | 'detail';
  format: 'RFA' | 'RVT' | 'IFC' | 'DWG' | 'SKP' | 'PDF' | 'OTHER';
  softwareVersion?: string;
  version?: string;
  publishedAt?: string;
  parametricStatus?: 'none' | 'limited' | 'parametric';
  reviewStatus: PublicationStatus;
}

export interface Product {
  id: string;
  isSample: boolean;
  title: LocalizedText;
  shortDescription: LocalizedText;
  manufacturer: { id: string; name: LocalizedText; isSample: boolean };
  categoryId: string;
  family?: string;
  modelNumber?: string;
  productionStatus: ProductionStatus;
  publicationStatus: PublicationStatus;
  updatedAt: string;
  keywords: LocalizedText;
  attributes: AttributeValue[];
  variants: ProductVariant[];
  sources: AttributeSource[];
  documents: ProductDocument[];
  /** Declared even when no file is attached yet; separate from the data-level badge. */
  bimAvailability: BimAvailability;
  bimFiles: BimFile[];
}

export interface DataLevelAssessment {
  level: DataLevel;
  label: DataLevelLabel;
  completedWeight: number;
  eligibleWeight: number;
  completionPercent: number;
  unmetRequirements: string[];
  hasEvidenceGap: boolean;
}
