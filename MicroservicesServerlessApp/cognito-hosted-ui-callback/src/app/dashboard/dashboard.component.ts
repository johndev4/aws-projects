import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { environment as env } from "../../environments/environment";
import { CognitoJwtVerifier } from "aws-jwt-verify";

@Component({
  selector: "dashboard",
  standalone: true,
  imports: [CommonModule],
  template: `
    <p>dashboard works!</p>
    <div style="display: flex; align-items: center; flex-direction: row-reverse; gap: 0.5rem;">
      <button (click)="signout()" title="Sign out cognito">Sign out</button>
      <button (click)="changeuser()" title="Change cognito user">Change user</button>
    </div>
    <br />
    <p>{{ tokens | json }}</p>
  `,
  styles: ``,
})
export class DashboardComponent implements OnInit {
  tokens!: any;

  constructor() {}

  ngOnInit(): void {
    this.tokens = JSON.parse(<string>sessionStorage.getItem("tokens")) ?? null;

    // Verifier that expects valid access tokens:
    const verifier = CognitoJwtVerifier.create({
      userPoolId: <string>env.cognito.PoolId,
      tokenUse: "access",
      clientId: <string>env.cognito.ClientId,
    });

    try {
      verifier.verify(this.tokens["access_token"]).then((payload) => {
        console.log("Token is valid. Payload:", payload);
      });
    } catch {
      console.log("Token not valid!");
    }
  }

  signout() {
    sessionStorage.removeItem("tokens");
    window.location.replace(<string>env.cognito.LogoutUrl);
  }

  changeuser() {
    sessionStorage.removeItem("tokens");
    window.location.replace(<string>env.cognito.LoginUrl);
  }
}
