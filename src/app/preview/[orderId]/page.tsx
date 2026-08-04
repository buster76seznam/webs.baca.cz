import { notFound } from 'next/navigation';
import { supabaseAdmin } from '@/supabase';
import PreviewClient from './PreviewClient';

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
  revision_count: number | null;
}

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  const { data: order, error } = await supabaseAdmin
    .from('orders')
    .select(
      'id, company_name, status, generated_site_json, primary_color, language, google_maps_url, facebook_url, instagram_url, company_email, company_phone, company_address, revision_count'
    )
    .eq('id', orderId)
    .single<OrderRow>();

  if (error || !order) {
    notFound();
  }

  if (!order.generated_site_json) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🚧</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Preview not ready yet</h1>
          <p className="text-gray-500">The website preview for this order is being prepared. Please check back soon.</p>
        </div>
      </div>
    );
  }

  const isPaid = order.status === 'paid';

  return (
    <PreviewClient
      order={order}
      siteJson={order.generated_site_json}
      isPaid={isPaid}
      revisionCount={order.revision_count ?? 0}
    />
  );
}
