import { ComponentFixture, TestBed } from "@angular/core/testing";

import { FuseMediaWatcherService } from "@fuse/services/media-watcher";
import { Subject } from "rxjs";
import { AccountSecurityComponent } from "./security.component";
import { UntypedFormGroup } from "@angular/forms";

describe("AccountSecurityComponent", () => {
  let component: AccountSecurityComponent;
  let fixture: ComponentFixture<AccountSecurityComponent>;
  let fuseMediaWatcherServiceSpy: { onMediaChange$: jest.Mock };

  beforeEach(async () => {
    // Mock FuseMediaWatcherService
    fuseMediaWatcherServiceSpy = {
      onMediaChange$: jest.fn().mockReturnValue(new Subject()),
    };

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [AccountSecurityComponent],
      providers: [
        {
          provide: FuseMediaWatcherService,
          useValue: fuseMediaWatcherServiceSpy,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountSecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
  it('should initialize forms correctly', () => {
    expect(component.updateLoginEmailForm).toBeInstanceOf(UntypedFormGroup);
    expect(component.recoveryEmailForm).toBeInstanceOf(UntypedFormGroup);
    // Add more initialization checks if needed
  });

  it('should validate updateLoginEmailForm', () => {
    const emailControl = component.updateLoginEmailForm.controls['email'];

    // Valid email
    emailControl.setValue('test@example.com');
    expect(emailControl.valid).toBeTruthy();

    // Invalid email
    emailControl.setValue('invalidemail');
    expect(emailControl.invalid).toBeTruthy();
  });

  it('should validate recoveryEmailForm', () => {
    const emailControl = component.recoveryEmailForm.controls['email'];

    // Valid email
    emailControl.setValue('test@example.com');
    expect(emailControl.valid).toBeTruthy();

    // Invalid email
    emailControl.setValue('invalidemail');
    expect(emailControl.invalid).toBeTruthy();
  });

  it('should handle update login email button click', () => {
    spyOn(component, 'onUpdateLoginEmailButton').and.callThrough();

    component.updateLoginEmailForm.controls['email'].setValue('test@example.com');
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('.update-login-email-button');
    button.click();

    expect(component.onUpdateLoginEmailButton).toHaveBeenCalled();

    it('should handle update login email button click', () => {
      spyOn(component, 'onUpdateLoginEmailButton').and.callThrough();
    
      component.updateLoginEmailForm.controls['email'].setValue('test@example.com');
      fixture.detectChanges();
    
      const button = fixture.nativeElement.querySelector('.update-login-email-button');
      button.click();
    
      // Expectations
      expect(component.onUpdateLoginEmailButton).toHaveBeenCalled();
      expect(component.showEmailUpdateForm).toBe(false); // Form should hide after clicking
      expect(component.showConfirmEmailUpdateForm).toBe(true); // Confirmation form should show
      expect(component.showLoginEmailDone).toBe(true); // "Done" icon should be visible
    });
    
    it('should handle leave recovery email button click', () => {
      // Set initial state
      component.showEmailUpdateForm = false;
      component.showConfirmEmailUpdateForm = true;
    
      // Simulate button click
      component.onLeaveRecoveryEmailButton();
    
      // Expectations
      expect(component.showEmailUpdateForm).toBe(true); // Form should show again
      expect(component.showConfirmEmailUpdateForm).toBe(false); // Confirmation form should hide
    });
    
    it('should handle add recovery email button click', () => {
      spyOn(component, 'onAddRecoveryEmailButton').and.callThrough();
    
      // Set a valid email
      component.recoveryEmailForm.controls['email'].setValue('test@example.com');
      fixture.detectChanges();
    
      // Simulate button click
      const button = fixture.nativeElement.querySelector('.add-recovery-email-button');
      button.click();
    
      // Expectations
      expect(component.onAddRecoveryEmailButton).toHaveBeenCalled();
      expect(component.showAddRecoveryForm).toBe(false); // Form should hide after clicking
      expect(component.showConfirmUpdateRecoveryForm).toBe(true); // Confirmation form should show
      expect(component.showAddRecoveryDone).toBe(true); // "Done" icon should be visible
    });
    
    
  });
 
});
