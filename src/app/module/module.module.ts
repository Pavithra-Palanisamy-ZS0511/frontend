import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { EventsComponent } from "./events/events.component";
import { AuthComponent } from "./auth/auth.component";

@NgModule({
  declarations: [DashboardComponent, EventsComponent, AuthComponent],
  imports: [CommonModule],
})
export class ModuleModule {}
