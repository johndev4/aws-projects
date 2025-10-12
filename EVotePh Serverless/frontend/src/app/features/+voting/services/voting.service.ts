import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError, mergeMap, from } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiService } from '../../../core/classes/api-service';
import { WebCryptoService } from '../../../shared/services/web-crypto.service';

@Injectable()
export class VotingService extends ApiService<any> {
  constructor(
    private http: HttpClient,
    private webCryptoService: WebCryptoService
  ) {
    super(environment.api.url);
  }

  override rootEndpoint = environment.api.endpoints.voting;

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
          this.prepareBallot(body.content, pubKeyPem)
        ),
        catchError((err) => throwError(err)),
        mergeMap((ballot) => {
          return this.http.post(
            this.buildRequestUrl({
              endpoint: this.rootEndpoint['castVote'],
            }),
            ballot ?? null,
            { observe: 'body' }
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
  override get(): Observable<any> {
    throw new Error('Method not implemented.');
  }
  override getList(query?: Map<string, string>): Observable<any[]> {
    throw new Error('Method not implemented.');
  }
  override search(query: Map<string, string>): Observable<any[]> {
    throw new Error('Method not implemented.');
  }

  checkIfUserHasVoted() {
    return this.http.get(
      this.buildRequestUrl({
        endpoint: this.rootEndpoint['checkIfUserHasVoted'],
      })
    );
  }

  private prepareBallot(content: string, pubKeyPem: string) {
    const prepareBallotAsyncFn = async () => {
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
    };

    return from(prepareBallotAsyncFn());
  }
}
