import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Amplify } from 'aws-amplify';
import {
  AmplifyAuthenticatorModule,
  AuthenticatorService,
} from '@aws-amplify/ui-angular';
import { environment } from '../environments/environment';
import { JsonPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  checkingRedirect: boolean = false;
  constructor(
    protected authenticator: AuthenticatorService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    if (this._router.url.split('/')?.[1] === 'app') {
      this.checkingRedirect = true;
      setTimeout(() => {
        this.checkingRedirect = false;
      }, 1000);
    }
  }
}
