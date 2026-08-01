'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export function ReferralTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) {
      // Track the click
      fetch(`/api/partners/track-click?ref=${ref}`).catch(() => {
        // Silently fail - don't disrupt user experience
      });
    }
  }, [searchParams]);

  return null; // This component doesn't render anything
}
