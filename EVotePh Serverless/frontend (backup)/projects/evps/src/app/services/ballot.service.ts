import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EncrDecrService } from './encr-decr.service';
import { WebCryptoService } from './web-crypto.service';
import { ApiService } from '../core/classes/api-service';
import { environment } from '../../environments/environment';
import {
  catchError,
  from,
  mergeMap,
  NEVER,
  Observable,
  throwError,
} from 'rxjs';

@Injectable()
export class BallotService extends ApiService<any> {
  constructor(
    private http: HttpClient,
    private webCryptoService: WebCryptoService
  ) {
    super(environment.api.url);
  }

  override rootEndpoint: { [key: string]: any } =
    environment.api.endpoints['ballot'];

  override post(
    body: any,
    query?: Map<string, string>,
    params?: any
  ): Observable<any> {
    return this.http
      .get(
        this.buildRequestUrl({
          endpoint: this.rootEndpoint['getEncryptionKey'],
        })
      )
      .pipe(
        catchError((err) => throwError(err)),
        mergeMap(({ pubKeyPem }: any) =>
          from(this.prepareBallot(body.content, pubKeyPem))
        ),
        catchError((err) => throwError(err)),
        mergeMap((ballot) => {
          return this.http.post(
            this.buildRequestUrl({
              endpoint: this.rootEndpoint['castVote'],
            }),
            ballot ?? null,
            { observe: 'events' }
          );
        }),
        catchError(this.handleError)
      );
  }
  override update(
    body: any,
    query?: Map<string, string>,
    params?: any
  ): Observable<any> {
    throw new Error('Method not implemented.');
  }
  override delete(
    body: any,
    query?: Map<string, string>,
    params?: any
  ): Observable<any> {
    throw new Error('Method not implemented.');
  }
  override get(id: string, query?: Map<string, string>): Observable<any> {
    throw new Error('Method not implemented.');
  }
  override getList(query?: Map<string, string>): Observable<any[]> {
    throw new Error('Method not implemented.');
  }
  override search(query: Map<string, string>): Observable<any[]> {
    throw new Error('Method not implemented.');
  }

  private async prepareBallot(
    content: string,
    pubKeyPem: string
  ): Promise<any> {
    // ---- > Content Signing Process
    const keyPair = await this.webCryptoService.generateECDSAKeyPair();
    // console.log('Generated key pair:', keyPair);

    const signature = await this.webCryptoService.sign(
      content,
      keyPair.privateKey
    );
    // console.log('Generated signature:', signature);

    const signerPubKeyPem = await this.webCryptoService.exportPublicKey(
      keyPair.publicKey
    );
    // console.log('Exported public key PEM:', pubKeyPem);

    // ---- > Encryption Process

    const { encryptedContent, iv, exportAESKey } =
      await this.webCryptoService.encryptWithAES(content);

    const exportedAESKey = await exportAESKey();

    const encryptedAESKey = await this.webCryptoService.encryptWithRSA(
      exportedAESKey,
      pubKeyPem
    );

    return {
      encryptedContent,
      iv,
      encryptedAESKey,
      signature,
      signerPubKeyPem,
    };
  }
}
