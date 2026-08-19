export type Role = 'Obchodni zastupce' | 'Vyvojar' | 'Spravce';

export interface AgenturaUser {
  id: string;
  username: string;
  role: Role;
  password_suffix: string;
  ip_address: string;
  created_at: string;
  last_login: string;
  last_seen?: string | null;
}

export type OrderStatus = 'draft' | 'queued' | 'development' | 'completed' | 'preview_ready' | 'revision_requested' | 'approved' | 'paid' | 'active' | 'failed_email';

export type PricingType = 'dle_domluvy' | 'doda';

export interface Order {
  id: string;
  created_at: string;
  updated_at: string;
  sales_user_id: string;
  company_name: string;
  company_phone: string;
  company_email: string;
  company_address: string;
  industry: string;
  domain: string;
  description: string;
  advantage: string;
  price_list: string | null;
  working_hours: string;
  status: OrderStatus;
  owner_name: string | null;
  owner_phone: string | null;
  owner_email: string | null;
  notes: string | null;
  deleted_at: string | null;
  status_updated_at: string | null;
  images: string[] | null;
  language: string | null;
  primary_color: string | null;
  secondary_color: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  google_maps_url: string | null;
  preview_url: string | null;
  revision_count: number;
  feedback_history: any[] | null;
  // Contract fields
  legal_business_name: string | null;
  state_of_incorporation: string | null;
  principal_place_of_business: string | null;
  authorized_signatory: string | null;
  contract_email: string | null;
  // joined
  sales_user?: { username: string };
}

export const ORDER_STATUSES: OrderStatus[] = [
  'draft',
  'queued',
  'development',
  'completed',
  'preview_ready',
  'revision_requested',
  'approved',
  'paid',
  'active',
  'failed_email',
];

export const STATUS_COLORS: Record<OrderStatus, string> = {
  'draft': 'bg-gray-500/10 text-gray-400',
  'queued': 'bg-amber-500/10 text-amber-400',
  'development': 'bg-blue-500/10 text-blue-400',
  'completed': 'bg-emerald-500/10 text-emerald-400',
  'preview_ready': 'bg-indigo-500/10 text-indigo-400',
  'revision_requested': 'bg-purple-500/10 text-purple-400',
  'approved': 'bg-green-500/10 text-green-400',
  'paid': 'bg-emerald-600/10 text-emerald-500',
  'active': 'bg-sky-500/10 text-sky-400',
  'failed_email': 'bg-red-500/10 text-red-400',
};
