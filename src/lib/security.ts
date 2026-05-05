// src/lib/security.ts
import { nanoid } from 'nanoid';

export const security = {
  // Basic hashing for sensitive data
  async hash(data: string): Promise<string> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  },

  // Basic encryption for sensitive data
  async encrypt(data: string, secret: string): Promise<string> {
    // In a real app, use a more robust encryption library like CryptoJS or Web Crypto API
    // This is a simple XOR encryption for demonstration purposes
    const encodedData = btoa(data);
    const encrypted = encodedData.split('').map((char, i) => {
      const charCode = char.charCodeAt(0) ^ secret.charCodeAt(i % secret.length);
      return String.fromCharCode(charCode);
    }).join('');
    return btoa(encrypted);
  },

  async decrypt(encryptedData: string, secret: string): Promise<string> {
    const decodedEncrypted = atob(encryptedData);
    const decrypted = decodedEncrypted.split('').map((char, i) => {
      const charCode = char.charCodeAt(0) ^ secret.charCodeAt(i % secret.length);
      return String.fromCharCode(charCode);
    }).join('');
    return atob(decrypted);
  },

  // Generate a secure API key
  generateApiKey(): string {
    return `bi_${nanoid(32)}`;
  },

  // Sanitize user input
  sanitize(input: string): string {
    return input.replace(/<[^>]*>?/gm, '');
  },

  // Validate email format
  isValidEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },

  // Validate password strength
  isStrongPassword(password: string): boolean {
    return password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password);
  },
};
