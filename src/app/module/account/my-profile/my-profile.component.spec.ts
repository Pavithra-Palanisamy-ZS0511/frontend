import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AccountMyProfileComponent } from './my-profile.component';
import { AuthService } from 'app/core/auth/auth.service';
import { ChangeDetectorRef } from '@angular/core';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslocoTestingModule } from '@ngneat/transloco';

describe('AccountMyProfileComponent', () => {
  let component: AccountMyProfileComponent;
  let fixture: ComponentFixture<AccountMyProfileComponent>;
  let authService: AuthService;

  const mockResponse = {
    title: 'Mr.',
    first_name: 'John',
    middle_name: 'M',
    last_name: 'Doe',
    suffix: 'Jr.',
    nickname: 'Johnny',
    marital_status: 'Single',
    birth_date: { year: 1985 },
    gender: 'Male',
    ethnicity: 'Asian',
    dietary: 'Yes',
    interests: 'Reading',
    accessibility: 'None'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        TranslocoTestingModule
      ],
      declarations: [AccountMyProfileComponent],
      providers: [
        AuthService,
        ChangeDetectorRef
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(AccountMyProfileComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);

    jest.spyOn(authService, 'viewProfile').mockReturnValue(of(mockResponse));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form', () => {
    expect(component.accountForm).toBeDefined();
    const formControls = component.accountForm.controls;
    expect(formControls['title']).toBeDefined();
    expect(formControls['firstName']).toBeDefined();
    expect(formControls['middleName']).toBeDefined();
    expect(formControls['lastName']).toBeDefined();
    expect(formControls['suffixName']).toBeDefined();
    expect(formControls['nickName']).toBeDefined();
    expect(formControls['maritalStatus']).toBeDefined();
    expect(formControls['birthDate']).toBeDefined();
    expect(formControls['birth']).toBeDefined();
    expect(formControls['gender']).toBeDefined();
    expect(formControls['ethnicity']).toBeDefined();
    expect(formControls['dietary']).toBeDefined();
    expect(formControls['interests']).toBeDefined();
    expect(formControls['accessibility']).toBeDefined();
  });

  it('should patch form values on accountInfo call', () => {
    component.accountInfo('test@example.com');
    expect(authService.viewProfile).toHaveBeenCalledWith('test@example.com');
    expect(component.accountForm.value).toEqual({
      title: 'Mr.',
      firstName: 'John',
      middleName: 'M',
      lastName: 'Doe',
      suffixName: 'Jr.',
      nickName: 'Johnny',
      maritalStatus: 'Single',
      birthDate: [1985],
      birth: 1985,
      gender: 'Male',
      ethnicity: 'Asian',
      dietary: 'Yes',
      interests: 'Reading',
      accessibility: 'None'
    });
  });

  it('should disable form controls after patching values', () => {
    component.accountInfo('test@example.com');
    fixture.detectChanges();
    component.disableFormControls();
    expect(component.accountForm.get('title').disabled).toBeTruthy();
    expect(component.accountForm.get('maritalStatus').disabled).toBeTruthy();
    expect(component.accountForm.get('birthDate').disabled).toBeTruthy();
    expect(component.accountForm.get('gender').disabled).toBeTruthy();
    expect(component.accountForm.get('ethnicity').disabled).toBeTruthy();
    expect(component.accountForm.get('dietary').disabled).toBeTruthy();
    expect(component.accountForm.get('interests').disabled).toBeTruthy();
    expect(component.accountForm.get('accessibility').disabled).toBeTruthy();
    it('should update birthDate in ngAfterViewInit', (done) => {
      component.ngOnInit();
      fixture.detectChanges();
  
      component.ngAfterViewInit();
  
      setTimeout(() => {
        expect(component.birthDate).toEqual([1981]);
        expect(component.accountForm.get('birth').disabled).toBe(true);
        done();
      }, 0);
    });
    it('should log form values after patching', () => {
      const consoleSpy = jest.spyOn(console, 'log');
      component.ngOnInit();
      fixture.detectChanges();
  
      expect(consoleSpy).toHaveBeenCalledWith('Form Values after patching:', component.accountForm.value);
    });
  });
});
