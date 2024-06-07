import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  OnInit
} from "@angular/core";
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatOptionModule } from "@angular/material/core";
import { MatFormFieldModule, MatSuffix } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { FuseAlertComponent } from "@fuse/components/alert";
import { TranslocoModule } from "@ngneat/transloco";
import { AuthService } from "app/core/auth/auth.service";
import { Store } from '@ngrx/store';
import { loadContactInformation } from '../../../state/actions/contact.actions';
import { ContactState } from '../../../state/reducer/contact.reducer';
import { selectContactDetails, selectContactError } from '../../../state/selectors/contact.selectors';
import { Observable, Subscription, filter } from "rxjs";
import { Auth0Service } from "app/core/services/auth0.service";
import { ErrorHandlerService } from "app/core/services/error-handler.service";

@Component({
  selector: "account-contact-details",
  templateUrl: "./contact-details.component.html",
  styleUrls: ["./contact-details.component.scss"],
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
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatSuffix,
    TranslocoModule
  ]
})
export class AccountContactDetailsComponent implements OnInit {
  updateContactEmailForm: UntypedFormGroup;
  updatePhoneNumberForm: UntypedFormGroup;
  updateMailingAddressForm: UntypedFormGroup;
  isDisabled = true;
  contactDetails: any;
  contactDetails$: Observable<any>;
  contactError$: Observable<any>;
  contactDetailsSubscription: Subscription;

  provinceOptions = ["Select", ""];
  countryOptions = ["Select", ""];
  email: string;

  constructor(
    private _formBuilder: UntypedFormBuilder,
    private _authService: AuthService,
    private auth0: Auth0Service,
    private errorHandlerService: ErrorHandlerService,
    private store: Store<{ contact: ContactState }>
  ) {
    
    this.contactDetails$ = this.store.select(selectContactDetails);
    this.contactError$ = this.store.select(selectContactError);
  }

  ngOnInit(): void {
    this.initializeForms();
    this.loadContactInformation();
    this.contactDetailsSubscription = this.contactDetails$
      .pipe(filter(contactDetails => !!contactDetails)) 
      .subscribe(contactDetails => {
        this.populateContactForms(contactDetails);
      }, () => {
        this.disableAllFormControls();
      });
  }

  ngOnDestroy(): void {
    if (this.contactDetailsSubscription) {
      this.contactDetailsSubscription.unsubscribe();
    }
  }

  private initializeForms(): void {
    this.updateContactEmailForm = this._formBuilder.group({
      email: ["", [Validators.email]]
    });

    this.updatePhoneNumberForm = this._formBuilder.group({
      phoneNumber: [""]
    });

    this.updateMailingAddressForm = this._formBuilder.group({
      addressInputLine1: [""],
      addressInputLine2: [""],
      city: [""],
      province: [{ value: "", disabled: false }],
      country: [{ value: "", disabled: false }],
      zipCode: [""]
    });
  }

  loadContactInformation(): void {
    this.email = localStorage.getItem("email");
    this.store.dispatch(loadContactInformation({ email: this.email }));
    this.contactDetails$.subscribe(contactDetails => {
      if (!contactDetails) {
        this.disableAllFormControls();
      }
    });
  }

  private populateContactForms(contactDetails: any): void {
    this.provinceOptions = ["Select", contactDetails?.stateName];
      this.countryOptions = ["Select", contactDetails?.countryName];
    this.updateContactEmailForm.patchValue({
      email: contactDetails?.email
    });

    this.updatePhoneNumberForm.patchValue({
      phoneNumber: contactDetails?.phone
    });

    this.updateMailingAddressForm.patchValue({
      addressInputLine1: contactDetails?.address,
      city: contactDetails?.city,
      province: contactDetails?.stateName ,
      country: contactDetails?.countryName,
      zipCode: contactDetails?.post_code
    });
    this.disableFormControls();
  }

  disableFormControls(): void {
    if (this.updateMailingAddressForm.get('province')) {
      this.updateMailingAddressForm.get('province').disable();
    }

    if (this.updateMailingAddressForm.get('country')) {
      this.updateMailingAddressForm.get('country').disable();
    }
  }

  disableAllFormControls(): void {
    this.updateContactEmailForm.disable();
    this.updatePhoneNumberForm.disable();
    this.updateMailingAddressForm.disable();
    this.updateMailingAddressForm.get('province').disable();
    this.updateMailingAddressForm.get('country').disable();
  }
}
