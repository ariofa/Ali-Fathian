/**
 * Transport contract shared conceptually with the future API.
 * No network request is made from the current exhibition front-end.
 */
import type {
  AttributeValue, BimFile, Category, DataLevel, Product, ProductDocument,
  ProductVariant, PublicationStatus,
} from './types';

export const CATALOG_API_VERSION = 'v1';
export const CATALOG_API_BASE_PATH = `/api/${CATALOG_API_VERSION}`;
export const CATALOG_API_ROUTES = {
  categories: `${CATALOG_API_BASE_PATH}/catalog/categories`,
  attributes: `${CATALOG_API_BASE_PATH}/catalog/attributes`,
  products: `${CATALOG_API_BASE_PATH}/catalog/products`,
  product: (productId: string) => `${CATALOG_API_BASE_PATH}/catalog/products/${productId}`,
  variants: (productId: string) => `${CATALOG_API_BASE_PATH}/catalog/products/${productId}/variants`,
  attributeValues: (productId: string) => `${CATALOG_API_BASE_PATH}/catalog/products/${productId}/attribute-values`,
  documents: (productId: string) => `${CATALOG_API_BASE_PATH}/catalog/products/${productId}/documents`,
  bimFiles: (productId: string) => `${CATALOG_API_BASE_PATH}/catalog/products/${productId}/bim-files`,
  review: (productId: string) => `${CATALOG_API_BASE_PATH}/catalog/products/${productId}/review`,
  changes: (productId: string) => `${CATALOG_API_BASE_PATH}/catalog/products/${productId}/changes`,
} as const;

export interface ApiMeta { requestId: string; generatedAt: string; }
export interface ApiResponse<T> { data: T; meta: ApiMeta; }
export interface ApiError { code: string; message: string; field?: string; details?: Record<string, unknown>; }
export interface ApiErrorResponse { error: ApiError; meta: ApiMeta; }

export interface CatalogListQuery {
  category?: string;
  q?: string;
  brandIds?: string[];
  formats?: string[];
  content?: string[];
  bimAvailability?: string[];
  dataLevels?: DataLevel[];
  updatedWithin?: '30d' | '90d' | 'older';
  /** Attribute keys must be from the published registry; values are typed by its dataType. */
  attributes?: Record<string, string | number | boolean | string[] | { min?: number; max?: number }>;
  page?: number;
  pageSize?: number;
}
export interface Paginated<T> { items: T[]; page: number; pageSize: number; total: number; }

/** Server representation of a published/public or brand-owned product. */
export interface CatalogProductDto extends Product {
  /** Server-authoritative level used in public responses and brand-panel state. */
  dataLevel: DataLevel;
  dataLevelCompletionPercent?: number;
}
export type ProductVariantDto = ProductVariant;
export type AttributeValueDto = AttributeValue;
export type ProductDocumentDto = ProductDocument;

/** Published files are immutable. A new revision creates a new record. */
export interface BimFileVersionDto extends BimFile {
  revision: number;
  checksumSha256: string;
  fileSizeBytes: number;
  uploadedAt: string;
  supersedesFileId?: string;
  releaseNotes?: string;
}

export interface ProductReviewDto {
  id: string;
  productId: string;
  status: PublicationStatus;
  checklistVersion: string;
  reviewedAt?: string;
  reviewerId?: string;
  notesForBrand?: string;
  internalNotes?: string;
}
export interface ProductChangeDto {
  id: string;
  productId: string;
  actorId: string;
  actorRole: 'brand' | 'reviewer' | 'admin' | 'system';
  action: 'created' | 'updated' | 'submitted_for_review' | 'published' | 'archived' | 'bim_file_released';
  occurredAt: string;
  summary: string;
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
}

export interface ProductWriteInput {
  title: Product['title'];
  shortDescription: Product['shortDescription'];
  categoryId: string;
  family?: string;
  modelNumber?: string;
  productionStatus: Product['productionStatus'];
  keywords: Product['keywords'];
  updatedAt: string;
}

/** Backend adapters should implement this interface; components stay transport-agnostic. */
export interface CatalogApiClient {
  listCategories(): Promise<ApiResponse<Category[]>>;
  listProducts(query: CatalogListQuery): Promise<ApiResponse<Paginated<CatalogProductDto>>>;
  getProduct(productId: string): Promise<ApiResponse<CatalogProductDto>>;
  createProduct(brandId: string, input: ProductWriteInput): Promise<ApiResponse<CatalogProductDto>>;
  updateProduct(productId: string, input: Partial<ProductWriteInput>): Promise<ApiResponse<CatalogProductDto>>;
  replaceVariants(productId: string, variants: ProductVariantDto[]): Promise<ApiResponse<ProductVariantDto[]>>;
  replaceAttributeValues(productId: string, values: AttributeValueDto[]): Promise<ApiResponse<AttributeValueDto[]>>;
  createBimFileVersion(productId: string, input: Omit<BimFileVersionDto, 'id' | 'revision' | 'uploadedAt'>): Promise<ApiResponse<BimFileVersionDto>>;
  submitForReview(productId: string): Promise<ApiResponse<ProductReviewDto>>;
}
