import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebCryptoService {
  private encoder = new TextEncoder();
  private decoder = new TextDecoder();

  // async importPublicKey(pubKeyPem: string): Promise<CryptoKey> {
  //   return crypto.subtle.importKey(
  //     'spki',
  //     this.pemToArrayBuffer(pubKeyPem),
  //     { name: 'RSA-OAEP', hash: 'SHA-256' },
  //     false,
  //     ['encrypt']
  //   );
  // }

  async exportPublicKey(key: CryptoKey): Promise<string> {
    const exported = await crypto.subtle.exportKey('spki', key);
    const b64 = btoa(String.fromCharCode(...new Uint8Array(exported)));
    return `-----BEGIN PUBLIC KEY-----\n${b64}\n-----END PUBLIC KEY-----`;
  }

  async generateECDSAKeyPair(): Promise<CryptoKeyPair> {
    return crypto.subtle.generateKey(
      { name: 'ECDSA', namedCurve: 'P-256' },
      true,
      ['sign', 'verify']
    );
  }

  async sign(content: string, privateKey: CryptoKey): Promise<string> {
    const data = this.encoder.encode(content);
    const signature = await crypto.subtle.sign(
      { name: 'ECDSA', hash: 'SHA-256' },
      privateKey,
      data
    );
    return btoa(String.fromCharCode(...new Uint8Array(signature)));
  }

  async encryptWithRSA(
    content: string | ArrayBuffer | Uint8Array<ArrayBuffer>,
    pubKeyPem: string
  ): Promise<string> {
    const data =
      typeof content === 'string' ? this.encoder.encode(content) : content;

    // Import public key
    const publicKey = await crypto.subtle.importKey(
      'spki',
      this.pemToArrayBuffer(pubKeyPem),
      { name: 'RSA-OAEP', hash: 'SHA-256' },
      false,
      ['encrypt']
    );

    const encrypted = await crypto.subtle.encrypt(
      { name: 'RSA-OAEP' },
      publicKey,
      data
    );

    return this.bufToB64(encrypted);
  }

  // async generateAESKey(): Promise<CryptoKey> {
  //   return await crypto.subtle.generateKey(
  //     { name: 'AES-GCM', length: 256 },
  //     true,
  //     ['encrypt', 'decrypt']
  //   );
  // }

  // async exportAESKey(symmetricKey: CryptoKey): Promise<ArrayBuffer> {
  //   return await crypto.subtle.exportKey('raw', symmetricKey);
  // }

  async encryptWithAES(content: string): Promise<{
    encryptedContent: string;
    iv: string;
    exportAESKey: () => Promise<ArrayBuffer>;
  }> {
    const iv = crypto.getRandomValues(new Uint8Array(12)); // GCM IV
    const encoded = this.encoder.encode(content);

    // Generate AES key
    const aesKey = await crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );

    // Encrypt with generated AES key
    const encryptedContent = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      aesKey,
      encoded
    );

    return {
      encryptedContent: this.bufToB64(encryptedContent),
      iv: this.bufToB64(iv),
      exportAESKey: async () => await crypto.subtle.exportKey('raw', aesKey), // Export AES key
    };
  }

  private bufToB64(buffer: ArrayBuffer | Uint8Array): string {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)));
  }

  private pemToArrayBuffer(pem: string): ArrayBuffer {
    const b64 = pem.replace(/-----.*?-----/g, '').replace(/\s/g, '');
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }

  hashWithSHA256(data: string): Observable<string> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    return from(
      crypto.subtle.digest('SHA-256', dataBuffer).then((hashBuffer) => {
        return Array.from(new Uint8Array(hashBuffer))
          .map((b) => b.toString(16).padStart(2, '0'))
          .join('');
      })
    );
  }
}
