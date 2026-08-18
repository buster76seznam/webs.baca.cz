'use client';

import { useState } from 'react';
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
  revision_count?: number | null;
  working_hours: string;
}

interface Props {
  order: OrderRow;
  siteJson: GeneratedSiteJson;
  isPaid: boolean;
  revisionCount: number;
}

const MAX_REVISIONS = 3;

export default function PreviewClient({ order, siteJson, isPaid, revisionCount }: Props) {
  const [currentSiteJson, setCurrentSiteJson] = useState<GeneratedSiteJson>(siteJson);
  const [currentRevisionCount, setCurrentRevisionCount] = useState<number>(revisionCount);
  const [modalOpen, setModalOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const revisionsRemaining = MAX_REVISIONS - currentRevisionCount;

  async function handleRevisionSubmit() {
    if (!prompt.trim()) return;
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

      setCurrentSiteJson(data.generated_site_json);
      setCurrentRevisionCount(data.revision_count);
      setSuccessMsg(`Revize provedena. Zbývá ${data.revisions_remaining} z ${MAX_REVISIONS} revizí.`);
      setPrompt('');
      setModalOpen(false);
    } catch {
      setError('Nastala neočekávaná chyba.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <SiteRenderer data={currentSiteJson} order={order} isPaid={isPaid} />

      {/* Plovoucí tlačítko pro revize */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
        {successMsg && (
          <div className="bg-green-600 text-white text-sm px-4 py-2 rounded-lg shadow-lg max-w-xs">
            {successMsg}
          </div>
        )}
        {revisionsRemaining > 0 ? (
          <button
            onClick={() => { setModalOpen(true); setError(null); setSuccessMsg(null); }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-3 rounded-xl shadow-xl transition-colors"
          >
            Požádat o úpravu webu
            <span className="ml-2 text-xs bg-indigo-500 rounded-full px-2 py-0.5">
              {revisionsRemaining}/{MAX_REVISIONS}
            </span>
          </button>
        ) : (
          <div className="bg-gray-700 text-white text-sm px-4 py-3 rounded-xl shadow-xl">
            Byl dosažen limit revizí ({MAX_REVISIONS}/{MAX_REVISIONS})
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Požádat o úpravu webu</h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                aria-label="Zavřít"
              >
                &times;
              </button>
            </div>

            <p className="text-sm text-gray-500 mb-3">
              Zbývá <strong>{revisionsRemaining}</strong> z <strong>{MAX_REVISIONS}</strong> revizí.
            </p>

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Popište požadované změny
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={5}
              placeholder="Např. Změň primární barvu na červenou a přidej do služeb čištění střech."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={loading}
            />

            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}

            <div className="mt-4 flex gap-3 justify-end">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm"
                disabled={loading}
              >
                Zrušit
              </button>
              <button
                onClick={handleRevisionSubmit}
                disabled={loading || !prompt.trim()}
                className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Zpracovávám...' : 'Odeslat úpravu'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
