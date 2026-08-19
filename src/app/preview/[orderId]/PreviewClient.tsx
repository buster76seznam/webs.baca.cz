'use client';

import { useState } from 'react';
import SiteRenderer from '@/components/SiteRenderer';
import { useRouter } from 'next/navigation';

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
  revision_count?: number | null;
  working_hours: string;
  preview_url: string | null;
}

interface Props {
  order: OrderRow;
  siteJson: GeneratedSiteJson;
  isPaid: boolean;
  revisionCount: number;
}

const MAX_REVISIONS = 3;

export default function PreviewClient({ order, siteJson, isPaid, revisionCount }: Props) {
  const router = useRouter();
  const [currentSiteJson, setCurrentSiteJson] = useState<GeneratedSiteJson>(siteJson);
  const [currentRevisionCount, setCurrentRevisionCount] = useState<number>(revisionCount);
  const [currentStatus, setCurrentStatus] = useState<string>(order.status);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const revisionsRemaining = MAX_REVISIONS - currentRevisionCount;
  const isApproved = currentStatus === 'approved' || currentStatus === 'paid' || currentStatus === 'active';

  async function handleApprove() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' }),
      });

      if (!res.ok) throw new Error('Failed to approve');
      
      setCurrentStatus('approved');
      setSuccessMsg('Web byl schválen! Přesměrovávám k platbě...');
      
      // Redirect to payment (simulated for now, or use Stripe if ready)
      setTimeout(() => {
        router.push(`/api/checkout/create-session?orderId=${order.id}`);
      }, 2000);
    } catch (err) {
      setError('Nepodařilo se schválit návrh.');
    } finally {
      setLoading(false);
    }
  }

  async function handleRevisionSubmit() {
    if (!prompt.trim() || revisionsRemaining <= 0) return;
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/orders/revision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order.id, prompt }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Nastala chyba při zpracování revize.');
        return;
      }

      // If the API returns updated data immediately
      if (data.generated_site_json) {
        setCurrentSiteJson(data.generated_site_json);
      }
      
      setCurrentRevisionCount(prev => prev + 1);
      setCurrentStatus('revision_requested');
      setSuccessMsg('Vaše připomínky byly odeslány. Claude právě upravuje váš web.');
      setPrompt('');
    } catch {
      setError('Nastala neočekávaná chyba při odesílání revize.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Control Panel Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50 px-4 py-3 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-tight">{order.company_name}</h1>
            <p className="text-sm text-gray-500">Náhled webu — {isApproved ? 'Schváleno' : `Revize: ${currentRevisionCount}/${MAX_REVISIONS}`}</p>
          </div>

          <div className="flex items-center gap-3">
            {!isApproved && (
              <>
                <button
                  onClick={handleApprove}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm disabled:opacity-50"
                >
                  {loading && currentStatus !== 'revision_requested' ? 'Zpracovávám...' : 'Schválit návrh'}
                </button>
              </>
            )}
            {isApproved && (
              <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg font-semibold flex items-center gap-2">
                <span className="text-xl">✅</span> Schváleno
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col lg:flex-row">
        {/* Main Content: Iframe/Renderer */}
        <div className="flex-1 bg-gray-100 overflow-hidden relative">
            {/* We use SiteRenderer but could also use iframe if we wanted to isolate styles better */}
            <div className="w-full h-full overflow-y-auto">
                <SiteRenderer data={currentSiteJson} order={order} isPaid={isPaid} />
            </div>
        </div>

        {/* Sidebar: Revision Panel */}
        {!isApproved && (
          <div className="w-full lg:w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Chci úpravu</h2>
            
            {revisionsRemaining > 0 ? (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    Zbývají vám <strong>{revisionsRemaining}</strong> ze 3 bezplatných úprav.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vaše připomínky
                  </label>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    rows={6}
                    placeholder="Např. Změňte barvu na modrou, přidejte fotku týmu a upravte text v sekci O nás..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    disabled={loading}
                  />
                </div>

                {error && <p className="text-xs text-red-600 bg-red-50 p-2 rounded">{error}</p>}
                {successMsg && <p className="text-xs text-green-600 bg-green-50 p-2 rounded">{successMsg}</p>}

                <button
                  onClick={handleRevisionSubmit}
                  disabled={loading || !prompt.trim()}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
                >
                  {loading ? 'Odesílám...' : 'Odeslat připomínky'}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
                  <p className="text-sm text-amber-800 font-medium">
                    Vyčerpali jste maximální počet 3 bezplatných úprav.
                  </p>
                  <p className="text-xs text-amber-700 mt-2">
                    Pro další změny schvalte návrh a pokračujte k dokončení objednávky.
                  </p>
                </div>
                
                <button
                  disabled
                  className="w-full bg-gray-200 text-gray-500 font-semibold py-3 rounded-lg cursor-not-allowed"
                >
                  Úpravy zablokovány
                </button>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-gray-100">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Jak to funguje?</h3>
              <ul className="text-xs text-gray-500 space-y-2">
                <li>1. Napíšete, co chcete změnit.</li>
                <li>2. Claude během chvilky web upraví.</li>
                <li>3. Dostanete e-mail s novou verzí.</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
