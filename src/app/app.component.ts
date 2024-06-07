import { Component } from "@angular/core";
import { NavigationEnd, Router, RouterOutlet } from "@angular/router";
import { CoreModule } from "./core/core.module";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  standalone: true,
  imports: [RouterOutlet, CoreModule, CommonModule],
})
export class AppComponent {
  showHeader: boolean;

  // Constructor
  constructor(private router: Router) {}
}
