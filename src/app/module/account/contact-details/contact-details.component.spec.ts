import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule, UntypedFormBuilder } from '@angular/forms';
import { Store, StoreModule } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { AccountContactDetailsComponent } from './contact-details.component';
import { AuthService } from 'app/core/auth/auth.service';
import { Auth0Service } from 'app/core/services/auth0.service';
import { ErrorHandlerService } from 'app/core/services/error-handler.service';
import { loadContactInformation } from '../../../state/actions/contact.actions';
import { selectContactDetails, selectContactError } from '../../../state/selectors/contact.selectors';

describe('AccountContactDetailsComponent', () => {
  let component: AccountContactDetailsComponent;
  let fixture: ComponentFixture<AccountContactDetailsComponent>;
  let store: MockStore;
  let mockAuthService: jest.Mocked<AuthService>;
  let mockAuth0Service: jest.Mocked<Auth0Service>;
  let mockErrorHandlerService: jest.Mocked<ErrorHandlerService>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['']);
    mockAuth0Service = jasmine.createSpyObj('Auth0Service', ['authUser']);
    mockErrorHandlerService = jasmine.createSpyObj('ErrorHandlerService', ['logError']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        StoreModule.forRoot({})  // Provide an empty reducer for testing
      ],
      declarations: [AccountContactDetailsComponent],
      providers: [
        UntypedFormBuilder,
        provideMockStore({
          selectors: [
            { selector: selectContactDetails, value: null },
            { selector: selectContactError, value: null }
          ]
        }),
        { provide: AuthService, useValue: mockAuthService },
        { provide: Auth0Service, useValue: mockAuth0Service },
        { provide: ErrorHandlerService, useValue: mockErrorHandlerService }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountContactDetailsComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store) as MockStore;

    jest.spyOn(mockAuth0Service, 'authUser').mockReturnValue(of({ email: 'test@example.com' }));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize forms on ngOnInit', () => {
    component.ngOnInit();

    expect(component.updateContactEmailForm).toBeDefined();
    expect(component.updatePhoneNumberForm).toBeDefined();
    expect(component.updateMailingAddressForm).toBeDefined();
  });

  it('should dispatch loadContactInformation action on loadContactInformation', () => {
    spyOn(store, 'dispatch');
    component.email = 'test@example.com';
    component.loadContactInformation();

    expect(store.dispatch).toHaveBeenCalledWith(loadContactInformation({ email: 'test@example.com' }));
  });

  it('should populate and disable form controls on populateContactForms', () => {
    const contactDetails = {
      email: 'example@example.com',
      phone: '1234567890',
      address: '123 Main St',
      city: 'Anytown',
      stateName: 'Anystate',
      countryName: 'Anycountry',
      post_code: '12345'
    };

    // component.populateContactForms(contactDetails);

    expect(component.updateContactEmailForm.get('email').value).toEqual(contactDetails.email);
    expect(component.updatePhoneNumberForm.get('phoneNumber').value).toEqual(contactDetails.phone);
    expect(component.updateMailingAddressForm.get('addressInputLine1').value).toEqual(contactDetails.address);
    expect(component.updateMailingAddressForm.get('city').value).toEqual(contactDetails.city);
    expect(component.updateMailingAddressForm.get('province').value).toEqual(contactDetails.stateName);
    expect(component.updateMailingAddressForm.get('country').value).toEqual(contactDetails.countryName);
    expect(component.updateMailingAddressForm.get('zipCode').value).toEqual(contactDetails.post_code);

    expect(component.updateMailingAddressForm.get('province').disabled).toBe(true);
    expect(component.updateMailingAddressForm.get('country').disabled).toBe(true);
  });

  it('should unsubscribe from contactDetails$ on ngOnDestroy', () => {
    spyOn(component.contactDetailsSubscription, 'unsubscribe');
    component.ngOnDestroy();

    expect(component.contactDetailsSubscription.unsubscribe).toHaveBeenCalled();
  });
});
