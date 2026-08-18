import { Role } from '@/types';

export function isAdmin(role: Role): boolean {
  return role === 'Spravce';
}

export function isSales(role: Role): boolean {
  return role === 'Obchodni zastupce';
}

export function isDeveloper(role: Role): boolean {
  return role === 'Vyvojar';
}

export function canChangeOrderStatus(role: Role): boolean {
  return isDeveloper(role) || isAdmin(role);
}

export function canCreateOrders(role: Role): boolean {
  return isSales(role) || isAdmin(role);
}

export const ROLES: Role[] = ['Obchodni zastupce', 'Vyvojar', 'Spravce'];

export const ROLE_LABELS: Record<Role, string> = {
  'Obchodni zastupce': 'Obchodní zástupce',
  Vyvojar: 'Vývojář',
  Spravce: 'Správce',
};

/** Online = aktivita v posledních 3 minutách */
export function isUserOnline(lastSeen: string | null | undefined, lastLogin: string): boolean {
  const ref = lastSeen ?? lastLogin;
  if (!ref) return false;
  return Date.now() - new Date(ref).getTime() < 3 * 60 * 1000;
}
