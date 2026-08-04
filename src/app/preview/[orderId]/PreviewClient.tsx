'use client';

import SiteRenderer from '@/components/SiteRenderer';

interface GeneratedSiteJson {
  hero: { title: string; subtitle: string; cta_text: string };
  about: { title: string; content: string };
  services: Array<{ title: string; description: string; icon: string }>;
  advantages: Array<{ title: string; description: string }>;
  contact: { email: string; phone: string; address: string };
  theme: { primary_color: string; secondary_color: string; font_style: string };
  layout?: {
    hero_variant?: 'variant_1' | 'variant_2' | 'variant_3';
    services_variant?: 'grid' | 'list';
  };
}

interface OrderRow {
  id: string;
  company_name: string;
  status: string;
  generated_site_json: GeneratedSiteJson | null;
  primary_color: string | null;
  language: string | null;
  google_maps_url: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  company_email: string | null;
  company_phone: string | null;
  company_address: string | null;
}

interface Props {
  order: OrderRow;
  siteJson: GeneratedSiteJson;
  isPaid: boolean;
}

export default function PreviewClient({ order, siteJson, isPaid }: Props) {
  return <SiteRenderer data={siteJson} order={order} isPaid={isPaid} />;
}
