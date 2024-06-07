import { Component, Input } from "@angular/core";
import { GLOBAL_MESSAGES } from "app/core/utils/constant/StringConstant";
import { MatButtonModule } from "@angular/material/button";
import { CommonModule, NgIf } from "@angular/common";

@Component({
  selector: "not-found",
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: "./not-found.component.html",
  styleUrl: "./not-found.component.scss",
})
export class NotFoundComponent {
  globalMessage = GLOBAL_MESSAGES;
  @Input() notFoundDescription: string;
  @Input() noHistoryFound: string;
  @Input() notFoundSubDescription: string;
  @Input() notFoundGif: string;
  @Input() strokedButton: string;
  @Input() flatButton: string;
}
