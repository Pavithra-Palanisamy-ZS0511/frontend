import { Route } from "@angular/router";
import { DashboardComponent } from "./module/dashboard/dashboard.component";
import { EventsComponent } from "./module/events/events.component";
import { AuthGuard } from "./core/auth/guards/auth.guard";
import { AuthComponent } from "./module/auth/auth.component";

export const appRoutes: Route[] = [
  { path: "", redirectTo: "/dashboard", pathMatch: "full" },
  {
    path: "signup",
    component: AuthComponent,
    canActivate: [AuthGuard],
  },
  { path: "events", component: EventsComponent, canActivate: [AuthGuard] },
  {
    path: "dashboard",
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  // Account
  {
    path: "account",
    loadChildren: () => import("app/module/account/account.routes"),
    canActivate: [AuthGuard],
  },
  // My Giving
  {
    path: "my-giving",
    loadChildren: () => import("app/module/my-giving/my-giving.routes"),
    canActivate: [AuthGuard],
  },
];
