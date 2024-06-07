import { TextFieldModule } from "@angular/cdk/text-field";
import { CommonModule, NgIf } from "@angular/common";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  AfterViewInit,
  ViewEncapsulation,
} from "@angular/core";
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatOptionModule } from "@angular/material/core";
import { MatFormFieldModule, MatSuffix } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { FuseAlertComponent } from "@fuse/components/alert";
import { ASSET_KEYS } from "app/core/utils/constant/AssetConstants";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import {
  GLOBAL_MESSAGES,
  USER_MOCK_DATA,
} from "app/core/utils/constant/StringConstant";
import { TranslocoModule } from "@ngneat/transloco";
import { AuthService } from "app/core/auth/auth.service";
import { Auth0Service } from "app/core/services/auth0.service";
import { ErrorHandlerService } from "app/core/services/error-handler.service";
import { Subscription } from "rxjs";
@Component({
  selector: "account-my-profile",
  templateUrl: "./my-profile.component.html",
  styleUrl: "./my-profile.component.scss",
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
    TextFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatSuffix,
    FontAwesomeModule,
    TranslocoModule,
    NgIf,
  ],
})
export class AccountMyProfileComponent implements OnInit, AfterViewInit {
  accountForm: UntypedFormGroup;
  profileId: number = 2423423324;
  assetKeys = ASSET_KEYS;
  globalMessage = GLOBAL_MESSAGES;
  userMockData = USER_MOCK_DATA;
  isDisabled: boolean = true;
  faImage = faImage;
  outlineInfo = "feather:fa-pro-messages";
  titles: string[] = USER_MOCK_DATA.titles;
  ethnicityOptions: string[] = USER_MOCK_DATA.ethnicityOptions;
  birthDate: number[] = [];
  dietaryOptions: string[] = USER_MOCK_DATA.dietaryOptions;
  interestsOptions: string[] = USER_MOCK_DATA.interestsOptions;
  accessibilityOptions: string[] = USER_MOCK_DATA.accessibilityOptions;
  maritalStatusOptions: string[] = USER_MOCK_DATA.maritalStatusOptions;
  genderOptions: string[] = USER_MOCK_DATA.genderOptions;
  accountInfoSubscription: Subscription;
  yearOfBirth: any;
  user: any;
  email: string;
  profileDetails: any;
  /**
   * Constructor
   */
  constructor(private _formBuilder: UntypedFormBuilder,
    
    private _authService: AuthService,
    private _cdr: ChangeDetectorRef,
    private auth0: Auth0Service,
    private errorHandlerService: ErrorHandlerService) {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Create the form
    this.accountForm = this._formBuilder.group({
      title: [{ value: "", disabled: false }],
      firstName: [""],
      middleName: [""],
      lastName: [""],
      suffixName: [""],
      nickName: [""],
      maritalStatus: [{ value: "", disabled: false }],
      birthDate: [{ value: "", disabled: false }],
      birth: [{value:0}],
      gender: [{ value: "", disabled: false }],
      ethnicity: [{ value: "", disabled: false }],
      dietary: [{ value: "", disabled: false }],
      interests: [{ value: "", disabled: false }],
      accessibility: [{ value: "", disabled: false }],
    
    });
this.email= localStorage.getItem("email");
this.accountInfo(this.email);

  }

  accountInfo(email): void{
    this.accountInfoSubscription = this._authService.viewProfile(email).subscribe((response) => {
      if(response){
        console.log(response);
        this.profileDetails = response;
        this.yearOfBirth=response?.birth_date?.year;
        this.accountForm.patchValue({
                title: response.title || '',
                firstName: response.first_name || '',
                middleName: response.middle_name || '',
                lastName: response.last_name || '',
                suffixName: response.suffix || '',
                nickName: response.nickname || '',
                maritalStatus: response.marital_status || '',
                birthDate:[response?.birth_date?.year],   
                birth: response?.birth_date?.year,
                gender: response.gender || '',
                ethnicity: "Asian" || '',
                dietary: "Yes" || '',
                interests: response.interests || '',
                accessibility: response.accessibility || '',
            });

            console.log('Form Values after patching:', this.accountForm.value);
          } else {
            // Ensure form controls are cleared if no response is received
            this.accountForm.patchValue({
              title: '',
              firstName: '',
              middleName: '',
              lastName: '',
              suffixName: '',
              nickName: '',
              maritalStatus: '',
              birthDate: [],
              birth: '',
              gender: '',
              ethnicity: '',
              dietary: '',
              interests: '',
              accessibility: '',
            });
          }
            this.disableFormControls();
            this._cdr.markForCheck();
      },
      (error) => {
        console.error('Error fetching profile:', error);
        this.disableFormControls();
        this._cdr.markForCheck();
      }
    );
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.birthDate=[this.yearOfBirth];
      this.accountForm.get('birth').disable();
    }, 0);
  }



  disableFormControls(): void {
    this.accountForm.get('title').disable();
    this.accountForm.get('maritalStatus').disable();
    this.accountForm.get('birthDate').disable();
    this.accountForm.get('gender').disable();
    this.accountForm.get('ethnicity').disable();
    this.accountForm.get('dietary').disable();
    this.accountForm.get('interests').disable();
    this.accountForm.get('accessibility').disable();
  }

  ngOnDestroy(): void {
    if (this.accountInfoSubscription) {
      this.accountInfoSubscription.unsubscribe();
    }
  }
}
