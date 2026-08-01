export interface AffiliateStats {
  partnerId: string;
  totalClicks: number;
  activeClients: number;
  monthlyRevenue: number;
  monthlyPayout: number;
  tier: string;
  conversionRate: number;
}

export interface PartnerProfile {
  id: string;
  name: string;
  email: string;
  companyName?: string;
  createdAt: string;
  verified: boolean;
  stats: AffiliateStats;
}

export const COMMISSION_STRUCTURE = {
  1: { min: 0, max: 50, percent: 10, usd: 15 },
  2: { min: 51, max: 125, percent: 15, usd: 22.5 },
  3: { min: 126, max: Infinity, percent: 20, usd: 30 },
};

export function calculateMonthlyEarnings(activeClients: number, basePrice: number = 150): number {
  if (activeClients >= 126) return activeClients * 30;
  if (activeClients >= 51) return activeClients * 22.5;
  return activeClients * 15;
}

export function getAffiliateRank(activeClients: number): string {
  if (activeClients >= 126) return 'Elite Partner';
  if (activeClients >= 51) return 'Growth Partner';
  return 'Starter Partner';
}

export function estimateMonthlyEarnings(monthlyClicks: number, conversionRate: number = 0.05): {
  potentialClients: number;
  potentialEarnings: number;
  tier: 1 | 2 | 3;
} {
  const potentialClients = Math.floor(monthlyClicks * conversionRate);
  let tier: 1 | 2 | 3 = 1;
  
  if (potentialClients >= 126) tier = 3;
  else if (potentialClients >= 51) tier = 2;

  const potentialEarnings = calculateMonthlyEarnings(potentialClients);

  return {
    potentialClients,
    potentialEarnings,
    tier,
  };
}
