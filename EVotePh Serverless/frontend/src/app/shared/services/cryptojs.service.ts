import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class CryptojsService {
  private key = 'encrypt!135790';

  // Method to encrypt data
  public encrypt(data: string): string {
    return CryptoJS.AES.encrypt(data, this.key).toString();
  }

  // Method to decrypt data
  public decrypt(data: string): string {
    return CryptoJS.AES.decrypt(data, this.key).toString(CryptoJS.enc.Utf8);
  }
}
