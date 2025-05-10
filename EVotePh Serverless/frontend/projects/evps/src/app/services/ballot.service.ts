import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EncrDecrService } from './encr-decr.service';
import { WebCryptoService } from './web-crypto.service';
import { ApiService } from '../core/classes/api-service.class';
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
    // const encryptedBallotContent = this.encrDecrService.encrypt(content);
    // console.log('encryptedBallotContent:', encryptedBallotContent);
    // return this.http.post(
    //   'https://lp7dr0rt4a.execute-api.ap-southeast-1.amazonaws.com/dev/ballot/cast-vote',
    //   { ballot_content: encryptedBallotContent ?? null },
    //   { observe: 'events' }
    // );
    return this.http
      .get(
        this.buildRequestUrl({
          endpoint: this.rootEndpoint['getEncryptionKey'],
        })
      )
      .pipe(
        catchError((err) => throwError(err)),
        mergeMap((pem: any) => {
          return from(
            (async () => {
              const pubKey = await this.webCryptoService.importPublicKey(
                pem['publicKey']
              );
              return await this.prepareBallot(body.content, pubKey);
            })()
          );
        }),
        mergeMap((encryptedContent) => {
          return this.http.post(
            this.buildRequestUrl({
              endpoint: this.rootEndpoint['castVote'],
            }),
            { ballot_content: encryptedContent ?? null },
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
    electionPubKey: CryptoKey
  ): Promise<any> {
    const keyPair = await this.webCryptoService.generateECDSAKeyPair();
    console.log('Generated key pair:', keyPair);

    const signature = await this.webCryptoService.sign(
      content,
      keyPair.privateKey
    );
    console.log('Generated signature:', signature);

    const encrypted = await this.webCryptoService.encrypt(
      content,
      electionPubKey
    );
    console.log('Encrypted content:', encrypted);

    const pubKeyPem = await this.webCryptoService.exportPublicKey(
      keyPair.publicKey
    );
    console.log('Exported public key PEM:', pubKeyPem);

    return {
      encryptedVote: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
      signature: btoa(String.fromCharCode(...new Uint8Array(signature))),
      signerPublicKey: pubKeyPem,
    };
  }
}
