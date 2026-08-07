export type AdminRole = 
  | 'Super Admin'
  | 'Manufacturer Verification Admin'
  | 'Review Team Manager'
  | 'Reviewer'
  | 'Support & Customer Success'
  | 'Finance & Subscription';

export interface AdminAccount {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  active: boolean;
  phone: string;
  avatarUrl?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  adminName: string;
  adminRole: AdminRole;
  action: string;
  targetType: string;
  targetName: string;
  reason: string;
  details?: string;
}

export interface ManufacturerRequest {
  id: string;
  companyName: string;
  brandName: string;
  ceoName: string;
  phone: string;
  email: string;
  licenseNumber: string;
  licenseFile: string;
  dateSubmitted: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  reason?: string;
}

export interface ReviewObject {
  id: string;
  titleFa: string;
  titleEn: string;
  category: string;
  manufacturerName: string;
  fileSize: string;
  formats: string[];
  dateSubmitted: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  assignedTo?: string; // Reviewer ID
  assignedName?: string; // Reviewer Name
  reasonCode?: string;
  reasonDetail?: string;
  overrideReason?: string;
  overriddenBy?: string;
}

export interface TicketMessage {
  sender: 'user' | 'admin';
  text: string;
  timestamp: string;
}

export interface SupportTicket {
  id: string;
  userEmail: string;
  userRole: 'Modeler' | 'Manufacturer';
  subject: string;
  message: string;
  category: 'Billing' | 'Download Issue' | 'Metadata error' | 'Account Verification' | 'General' | 'Technical Support';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Escalated';
  dateCreated: string;
  messages: TicketMessage[];
  escalatedTo?: 'Finance' | 'Review Manager' | 'None';
  /** Present for tickets synced from the website contact form (server store). */
  refNumber?: string;
  department?: string;
}

export interface BillingInvoice {
  id: string;
  companyName: string;
  userEmail: string;
  userRole: 'Modeler' | 'Manufacturer';
  planName: string;
  amount: number; // in IRR (Rials) or Toman
  status: 'Paid' | 'Refunded' | 'Disputed' | 'Failed';
  date: string;
}

export interface RefundRequest {
  id: string;
  invoiceId: string;
  companyName: string;
  amount: number;
  reason: string;
  dateSubmitted: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  processedBy?: string;
  processedDate?: string;
}

export interface ReviewerMetrics {
  reviewerId: string;
  reviewerName: string;
  approvedCount: number;
  rejectedCount: number;
  avgTurnaroundHours: number;
  assignedCount: number;
}
