export const TIER_STRUCTURE = {
  1: {
    name: 'Tier 1: Starter',
    minClients: 0,
    maxClients: 50,
    commissionPercent: 10,
    usdCommission: 15,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
  },
  2: {
    name: 'Tier 2: Growth',
    minClients: 51,
    maxClients: 125,
    commissionPercent: 15,
    usdCommission: 22.5,
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20',
  },
  3: {
    name: 'Tier 3: Elite',
    minClients: 126,
    maxClients: Infinity,
    commissionPercent: 20,
    usdCommission: 30,
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/20',
  },
};

export function getTier(clientCount: number): 1 | 2 | 3 {
  if (clientCount >= 126) return 3;
  if (clientCount >= 51) return 2;
  return 1;
}

export function getTierInfo(clientCount: number) {
  const tier = getTier(clientCount);
  return TIER_STRUCTURE[tier];
}

export function calculateCommission(
  clientCount: number,
  basePrice: number,
  currency: string,
  exchangeRate: number = 1
): {
  tier: 1 | 2 | 3;
  commissionPercent: number;
  monthlyPayout: number;
  details: string;
} {
  const tier = getTier(clientCount);
  const tierInfo = TIER_STRUCTURE[tier];
  const monthlyPayout = clientCount * (tierInfo.usdCommission * exchangeRate);

  return {
    tier,
    commissionPercent: tierInfo.commissionPercent,
    monthlyPayout,
    details: `${tierInfo.commissionPercent}% commission (${clientCount} clients)`,
  };
}

export function getProgressToNextTier(clientCount: number): {
  current: number;
  next: number;
  percent: number;
  message: string;
} {
  const tier = getTier(clientCount);
  
  if (tier === 1) {
    const next = 51;
    const percent = (clientCount / next) * 100;
    return {
      current: clientCount,
      next,
      percent: Math.min(percent, 100),
      message: `${next - clientCount} clients until Tier 2 (15% commission)`,
    };
  }
  
  if (tier === 2) {
    const next = 126;
    const percent = ((clientCount - 51) / (next - 51)) * 100;
    return {
      current: clientCount,
      next,
      percent: Math.min(percent, 100),
      message: `${next - clientCount} clients until Tier 3 (20% commission)`,
    };
  }

  // Tier 3
  return {
    current: clientCount,
    next: clientCount + 1,
    percent: 100,
    message: 'You are at the highest tier! 🎉',
  };
}
