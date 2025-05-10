import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WebCryptoService {
  private encoder = new TextEncoder();
  private decoder = new TextDecoder();

  // Get this from the backend or config (PEM to CryptoKey)
  async importPublicKey(pem: string): Promise<CryptoKey> {
    const b64 = pem.replace(/-----.*?-----/g, '').replace(/\s/g, '');
    const binaryDer = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
    return crypto.subtle.importKey(
      'spki',
      binaryDer.buffer,
      { name: 'RSA-OAEP', hash: 'SHA-256' },
      false,
      ['encrypt']
    );
  }

  async generateECDSAKeyPair(): Promise<CryptoKeyPair> {
    return crypto.subtle.generateKey(
      { name: 'ECDSA', namedCurve: 'P-256' },
      true,
      ['sign', 'verify']
    );
  }

  async sign(content: string, privateKey: CryptoKey): Promise<ArrayBuffer> {
    const data = this.encoder.encode(content);
    return crypto.subtle.sign(
      { name: 'ECDSA', hash: 'SHA-256' },
      privateKey,
      data
    );
  }

  async encrypt(content: string, publicKey: CryptoKey): Promise<ArrayBuffer> {
    const data = this.encoder.encode(content);
    return crypto.subtle.encrypt({ name: 'RSA-OAEP' }, publicKey, data);
  }

  async exportPublicKey(key: CryptoKey): Promise<string> {
    const exported = await crypto.subtle.exportKey('spki', key);
    const b64 = btoa(String.fromCharCode(...new Uint8Array(exported)));
    return `-----BEGIN PUBLIC KEY-----\n${b64}\n-----END PUBLIC KEY-----`;
  }
}
