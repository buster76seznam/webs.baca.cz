declare module 'web-push' {
  export function setVapidDetails(subject: string, publicKey: string, privateKey: string): void;
  export function sendNotification(subscription: any, payload: string, options?: any): Promise<void>;
  export function generateVAPIDKeys(): { publicKey: string; privateKey: string };
}
