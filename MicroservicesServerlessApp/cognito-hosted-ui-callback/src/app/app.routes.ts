import { Routes } from "@angular/router";
import { AuthenticatorGuard } from "./authenticator.guard";

export const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "dashboard",
  },
  {
    path: "dashboard",
    loadComponent: () => import("./dashboard/dashboard.component").then((c) => c.DashboardComponent),
    canActivate: [AuthenticatorGuard],
  },
];
