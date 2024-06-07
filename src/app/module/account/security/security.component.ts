import { CommonModule, NgIf } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatOptionModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { faL } from "@fortawesome/free-solid-svg-icons";
import { FuseAlertComponent } from "@fuse/components/alert";
import { TranslocoModule } from "@ngneat/transloco";

@Component({
  selector: "account-security",
  templateUrl: "./security.component.html",
  styleUrl: "./security.component.scss",
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    FuseAlertComponent,
    MatIconModule,
    MatInputModule,
    MatOptionModule,
    MatButtonModule,
    TranslocoModule,
    NgIf,
  ],
})
export class AccountSecurityComponent {
  updateLoginEmailForm: UntypedFormGroup;
  recoveryEmailForm: UntypedFormGroup;
  isDisabled: boolean = true;
  showEmailUpdateForm: boolean = true;
  showConfirmEmailUpdateForm: boolean = false;
  showAddRecoveryForm: boolean = true;
  showConfirmUpdateRecoveryForm: boolean = false;
  showLoginEmailDone: boolean = false;
  showAddRecoveryDone: boolean = false;
  updateEmail: string = "makenna.r@gmail.com";

  constructor(private _formBuilder: UntypedFormBuilder) {}

  ngOnInit(): void {
    this.initializeForms();
  }

  initializeForms(): void {
    this.updateLoginEmailForm = this._formBuilder.group({
      email: [
        this.updateEmail,
        [Validators.required, Validators.email],
      ],
    });

    this.recoveryEmailForm = this._formBuilder.group({
      email: [
        this.updateEmail,
        [Validators.required, Validators.email],
      ],
    });
  }

  onUpdateLoginEmailButton(): void {
    if (this.updateLoginEmailForm.valid) {
      this.showEmailUpdateForm = false;
      this.showConfirmEmailUpdateForm = true;
      this.showLoginEmailDone = true;
    } else {
      this.updateLoginEmailForm.markAllAsTouched();
      this.showLoginEmailDone = false;
    }
  }

  onLeaveRecoveryEmailButton(): void {
    this.showEmailUpdateForm = true;
    this.showConfirmEmailUpdateForm = false;
  }

  onAddRecoveryEmailButton(): void {
    if (this.recoveryEmailForm.valid) {
      this.showAddRecoveryForm = false;
      this.showConfirmUpdateRecoveryForm = true;
      this.showAddRecoveryDone = true;
    } else {
      this.recoveryEmailForm.markAllAsTouched();
      this.showAddRecoveryDone = false;
    }
  }

  onConfirmAddRecoveryEmailButton(): void {
    this.showAddRecoveryForm = true;
    this.showConfirmUpdateRecoveryForm = false;
  }

}
