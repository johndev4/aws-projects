import { Injectable } from '@angular/core';
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';
import {
  fromCognitoIdentityPool,
  CognitoIdentityCredentialProvider,
} from '@aws-sdk/credential-provider-cognito-identity';
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Injectable({
  providedIn: 'root',
})
export class S3Service {
  private credentials!: CognitoIdentityCredentialProvider;
  private s3Client!: S3Client;
  private readonly awsRegion = 'ap-southeast-1';
  private readonly s3BucketName = 'demo-johndev1898-s3-cognito-users-storage';
  private readonly userPoolId = 'ap-southeast-1_WZNbVRLf1';
  private readonly identityPoolId =
    'ap-southeast-1:051f3044-673e-46b8-bef6-a62eac9f64c6';

  constructor(private oidcidcSecurityService: OidcSecurityService) {
    this.oidcidcSecurityService.getIdToken().subscribe(async (idToken) => {
      this.credentials = fromCognitoIdentityPool({
        client: new CognitoIdentityClient({ region: this.awsRegion }),
        identityPoolId: this.identityPoolId,
        // If you have authenticated users, include these
        logins: {
          [`cognito-idp.ap-southeast-1.amazonaws.com/${this.userPoolId}`]:
            idToken,
        },
      });
      this.s3Client = new S3Client({
        region: this.awsRegion,
        credentials: this.credentials,
      });
    });
  }

  async listUserFiles(): Promise<string[]> {
    const { identityId } = await this.credentials();
    const userFolder = `private/user/${identityId}/`;

    const command = new ListObjectsV2Command({
      Bucket: this.s3BucketName,
      Prefix: userFolder,
    });

    const response = await this.s3Client.send(command);

    if (!response.Contents) {
      console.log('No objects found in user folder');
      return [];
    }

    console.log('Objects in user folder:');
    return response.Contents.map((item) => {
      const s3Object = `- ${item.Key} (${item.Size} bytes)`;
      console.log(s3Object);
      return s3Object;
    });
  }
}
