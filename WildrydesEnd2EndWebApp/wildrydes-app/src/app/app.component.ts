import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Amplify } from 'aws-amplify';
import {
  AmplifyAuthenticatorModule,
  AuthenticatorService,
} from '@aws-amplify/ui-angular';
import { environment } from '../environments/environment';
import { JsonPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: environment.aws.cognito?.userPoolId || '',
      userPoolClientId: environment.aws.cognito?.userPoolClientId || '',
    },
  },
});

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    AmplifyAuthenticatorModule,
    JsonPipe,
    MatButtonModule,
    MatMenuModule,
    MatIcon,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  constructor(protected authenticator: AuthenticatorService) {}
}
