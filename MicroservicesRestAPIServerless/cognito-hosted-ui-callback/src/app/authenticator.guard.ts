import { environment as env } from "../environments/environment";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { catchError } from "rxjs";
import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  GuardResult,
  MaybeAsync,
  Router,
  RouterStateSnapshot,
} from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class AuthenticatorGuard implements CanActivate {
  constructor(private _http: HttpClient, private _router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
    return new Promise((resolve, reject) => {
      try {
        const isAuthenticated = sessionStorage.getItem("tokens") ? true : false;
        const queryCode = route.queryParams?.["code"] ?? null;
        const pathName = route.routeConfig?.path;

        if (pathName === "dashboard" && queryCode && !isAuthenticated) {
          this._authenticate(queryCode).then((result) => {
            if (result) {
              this._router.navigateByUrl("/dashboard", { replaceUrl: true });
            }
          });
        } else {
          if (pathName === "dashboard" && queryCode && isAuthenticated) {
            this._router.navigateByUrl("/dashboard", { replaceUrl: true });
          } else if (isAuthenticated) {
            resolve(isAuthenticated);
          } else {
            window.location.replace(<string>env.cognito.LoginUrl);
          }
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  private _authenticate(queryCode: string): Promise<Boolean> {
    return new Promise((resolve, reject) => {
      try {
        const headers = new HttpHeaders({
          "Content-Type": "application/x-www-form-urlencoded",
        });

        const body = new HttpParams()
          .set("grant_type", "authorization_code")
          .set("client_id", <string>env.cognito.ClientId)
          .set("client_secret", <string>env.cognito.ClientSecret)
          .set("redirect_uri", <string>env.cognito.ClientRedirectUri)
          .set("code", queryCode);

        this._http
          .post(`${env.cognito.ClientDomain}/oauth2/token`, body.toString(), { headers })
          .pipe(
            catchError((error) => {
              throw error;
            })
          )
          .subscribe((response: any) => {
            sessionStorage.setItem("tokens", JSON.stringify(response, null, 2));
            resolve(true);
          });
      } catch (error) {
        reject(error);
      }
    });
  }
}
