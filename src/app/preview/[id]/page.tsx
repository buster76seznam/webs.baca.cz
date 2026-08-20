import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import PreviewClient from './PreviewClient';
import Link from 'next/link';

// Ořezání bílých znaků a neplatných symbolů z env proměnných
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || '';
const supabaseKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)?.trim() || '';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false, autoRefreshToken: false }
});

interface GeneratedSiteJson {
  hero: { title: string; subtitle: string; ctaText: string };
  about: { title: string; text: string };
  services: Array<{ title: string; description: string }>;
  contact: { address: string; phone: string; hours: string };
  theme: { primaryColor: string; secondaryColor: string };
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
  working_hours: string;
}

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: order, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error("❌ SUPABASE FETCH ERROR:", error.message);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center max-w-md bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Chyba při načítání náhledu</h1>
          <p className="text-gray-500 mb-6">{error.message}</p>
          <Link 
            href="/"
            className="inline-block bg-indigo-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Zpět na úvod
          </Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center max-w-md bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Objednávka nenalezena</h1>
          <p className="text-gray-500 mb-6">Omlouváme se, ale požadovaný náhled nebyl nalezen. Zkontrolujte prosím správnost odkazu.</p>
          <Link 
            href="/"
            className="inline-block bg-indigo-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Zpět na úvod
          </Link>
        </div>
      </div>
    );
  }

  // Ošetření načítání dat v komponentě - parsování generated_site_json
  const siteJson = typeof order.generated_site_json === 'string' 
    ? JSON.parse(order.generated_site_json) 
    : order.generated_site_json;

  // Check if status is preview_ready or if we have the content
  const isReady = order.status === 'preview_ready' || siteJson;

  if (!isReady) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Připravujeme váš náhled...</h1>
          <p className="text-gray-500">
            Náš AI model právě vytváří obsah pro váš nový web. Tato operace obvykle trvá 30-60 sekund.
          </p>
          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-400">
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Zpracovávání dat
          </div>
        </div>
      </div>
    );
  }

  const isPaid = order.status === 'paid' || order.status === 'active';

  return (
    <PreviewClient
      order={order}
      siteJson={siteJson as GeneratedSiteJson}
      isPaid={isPaid}
      revisionCount={order.revision_count ?? 0}
    />
  );
}
