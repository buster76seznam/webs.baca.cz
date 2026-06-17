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

export type OrderStatus =
  | 'Čeká ve frontě'
  | 'Vytváří se'
  | 'Návrh odeslán'
  | 'Čekám na podklady'
  | 'Čekám na smlouvu'
  | 'Platí'
  | 'Vývoj'
  | 'vývoj'
  | 'Dokončená'
  | 'dokončená';

export type PricingType = 'dle_domluvy' | 'doda';

export interface Order {
  id: string;
  created_at: string;
  updated_at: string;
  sales_user_id: string;
  company_name: string;
  phone: string;
  email: string;
  address: string;
  industry: string;
  has_photos: boolean | null;
  services: string | null;
  website_url: string | null;
  pricing_type: PricingType | null;
  status: OrderStatus;
  status_updated_at: string;
  developer_id: string | null;
  // New fields for web orders
  primary_color?: string | null;
  secondary_color?: string | null;
  language?: string | null;
  facebook_url?: string | null;
  instagram_url?: string | null;
  google_maps_url?: string | null;
  images?: string[] | null;
  owner_name?: string | null;
  owner_phone?: string | null;
  owner_email?: string | null;
  advantage?: string | null;
  price_list?: string | null;
  working_hours?: string | null;
  notes?: string | null;
  // joined
  sales_user?: { username: string };
}

export const ORDER_STATUSES: OrderStatus[] = [
  'Čeká ve frontě',
  'Vytváří se',
  'Návrh odeslán',
  'Čekám na podklady',
  'Čekám na smlouvu',
  'Platí',
  'Vývoj',
  'vývoj',
  'Dokončená',
  'dokončená',
];

export const STATUS_COLORS: Record<OrderStatus, string> = {
  'Čeká ve frontě':    'bg-zinc-700/40 text-zinc-300 border-zinc-600/30',
  'Vytváří se':        'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'Návrh odeslán':     'bg-purple-500/20 text-purple-300 border-purple-500/30',
  'Čekám na podklady': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  'Čekám na smlouvu':  'bg-orange-500/20 text-orange-300 border-orange-500/30',
  'Platí':             'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  'Vývoj':             'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  'vývoj':             'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  'Dokončená':         'bg-green-500/20 text-green-300 border-green-500/30',
  'dokončená':         'bg-green-500/20 text-green-300 border-green-500/30',
};
