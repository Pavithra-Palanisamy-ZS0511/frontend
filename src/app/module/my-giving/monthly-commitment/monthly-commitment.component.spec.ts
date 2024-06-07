import { ComponentFixture, TestBed } from "@angular/core/testing";

import { MonthlyCommitmentComponent } from "./monthly-commitment.component";
import { FuseMediaWatcherService } from "@fuse/services/media-watcher";
import { FuseAlertComponent } from "@fuse/components/alert";

describe("MonthlyCommitmentComponent", () => {
  let component: MonthlyCommitmentComponent;
  let fixture: ComponentFixture<MonthlyCommitmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthlyCommitmentComponent, FuseMediaWatcherService, FuseAlertComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MonthlyCommitmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have initial selected value", () => {
    expect(component.selectedValue).toEqual("credit-card");
  });

  it("should update selectedValue on radio button change", () => {
    const index = 3;
    const event = { value: "debit-card" };
    component.onChange(event, index);
    expect(component.selectedValue[index]).toEqual("debit-card");
  });
  it("should have correct monthly donation amount", () => {
    expect(component.monthlyDonation).toBe(50.0);
  });

  it("should have correct next transaction date", () => {
    expect(component.nextTransactionDate).toBe("Jun 01, 2024");
  });

  it("should have correct direct bank debit number", () => {
    expect(component.directBankDebitNum).toBe("****4636");
  });

  it("should have correct credit card number", () => {
    expect(component.creditCardNum).toBe("****8847");
  });

  it("should display correct labels for donation amount and next transaction date", () => {
    const labels = fixture.nativeElement.querySelectorAll("mat-label");
    expect(labels[0].textContent.trim()).toBe("Monthly Donation Amount");
    expect(labels[1].textContent.trim()).toBe("Next Transaction Date");
  });
});
