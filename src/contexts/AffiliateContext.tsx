'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { calculateCommission, getTierInfo, getProgressToNextTier } from '@/lib/affiliate-config';

interface PartnerStats {
  partnerId: string;
  name: string;
  totalClicks: number;
  activeClients: number;
  monthlyRevenue: number;
  monthlyPayout: number;
  tier: 1 | 2 | 3;
  referralLink: string;
  commissionPercent: number;
}

interface AffiliateContextType {
  partner: PartnerStats | null;
  loading: boolean;
  isLoggedIn: boolean;
  login: (partnerId: string) => Promise<void>;
  logout: () => void;
  fetchStats: () => Promise<void>;
}

const AffiliateContext = createContext<AffiliateContextType | undefined>(undefined);

export function AffiliateProvider({ children }: { children: ReactNode }) {
  const [partner, setPartner] = useState<PartnerStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [partnerId, setPartnerId] = useState<string | null>(null);

  // Check for stored partner ID on mount
  useEffect(() => {
    const storedPartnerId = localStorage.getItem('affiliate_partner_id');
    if (storedPartnerId) {
      setPartnerId(storedPartnerId);
      setIsLoggedIn(true);
      fetchStatsForPartner(storedPartnerId);
    }
  }, []);

  const fetchStatsForPartner = async (pId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/partners/${pId}/stats`);
      const data = await response.json();

      // Get base price - use USD as default for calculations
      const basePrice = 150;
      const commission = calculateCommission(data.activeClients, basePrice, 'USD', 1);

      setPartner({
        partnerId: pId,
        name: data.name || '',
        totalClicks: data.totalClicks,
        activeClients: data.activeClients,
        monthlyRevenue: data.monthlyRevenue,
        monthlyPayout: commission.monthlyPayout,
        tier: commission.tier,
        referralLink: data.referralLink,
        commissionPercent: commission.commissionPercent,
      });
    } catch (error) {
      console.error('Failed to fetch partner stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (pId: string) => {
    localStorage.setItem('affiliate_partner_id', pId);
    setPartnerId(pId);
    setIsLoggedIn(true);
    await fetchStatsForPartner(pId);
  };

  const logout = () => {
    localStorage.removeItem('affiliate_partner_id');
    setPartnerId(null);
    setPartner(null);
    setIsLoggedIn(false);
  };

  const fetchStats = async () => {
    if (partnerId) {
      await fetchStatsForPartner(partnerId);
    }
  };

  return (
    <AffiliateContext.Provider
      value={{
        partner,
        loading,
        isLoggedIn,
        login,
        logout,
        fetchStats,
      }}
    >
      {children}
    </AffiliateContext.Provider>
  );
}

export function useAffiliate() {
  const context = useContext(AffiliateContext);
  if (context === undefined) {
    throw new Error('useAffiliate must be used within an AffiliateProvider');
  }
  return context;
}
