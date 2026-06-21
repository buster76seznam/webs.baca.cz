export type Role = 'Obchodní zástupce' | 'Vývojář' | 'Správce';

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

export type OrderStatus = 'čeká' | 'vývoj' | 'dokončená';

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
  status_updated_at: string;
  developer_id: string | null;
  // Optional fields
  primary_color: string | null;
  secondary_color: string | null;
  language: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  google_maps_url: string | null;
  images: string[];
  owner_name: string | null;
  owner_phone: string | null;
  owner_email: string | null;
  notes: string | null;
  deleted_at: string | null;
  // joined
  sales_user?: { username: string };
}

export const ORDER_STATUSES: OrderStatus[] = [
  'čeká',
  'vývoj',
  'dokončená',
];

export const STATUS_COLORS: Record<OrderStatus, string> = {
  'čeká': 'bg-amber-500/10 text-amber-400',
  'vývoj': 'bg-blue-500/10 text-blue-400',
  'dokončená': 'bg-emerald-500/10 text-emerald-400',
};
