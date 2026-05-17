import crypto from 'crypto';

// Šifrovací klíč - v produkčním prostředí by měl být uložen v .env
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex');

// Funkce pro šifrování hesel
export function encryptPassword(password: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
  let encrypted = cipher.update(password);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
}

// Funkce pro dešifrování hesel
export function decryptPassword(encryptedPassword: string): string {
  const [ivHex, encryptedHex] = encryptedPassword.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const encrypted = Buffer.from(encryptedHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

// Funkce pro bezpečné uložení hesel (hashování)
export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + ENCRYPTION_KEY).digest('hex');
}

// Pole šifrovaných hesel pro produkční nasazení
export const SECURE_MASTER_PASSWORDS = [
  hashPassword('Wb3x9Kp'),
  hashPassword('Rv5mT2n'),
  // Přidej heslo pro Správce zde
];

// Ověření hesla (bez ukládání prostého hesla)
export function verifyMasterPassword(inputPassword: string): string | null {
  const hashedInput = hashPassword(inputPassword);
  
  if (hashedInput === SECURE_MASTER_PASSWORDS[0]) {
    return 'Obchodní zástupce';
  }
  if (hashedInput === SECURE_MASTER_PASSWORDS[1]) {
    return 'Vývojář';
  }
  // Přidej ověření pro Správce zde
  
  return null;
}