import { ComponentFixture, TestBed } from "@angular/core/testing";

import { NotFoundComponent } from "./not-found.component";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";

describe("NotFoundComponent", () => {
  let component: NotFoundComponent;
  let fixture: ComponentFixture<NotFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotFoundComponent, CommonModule, MatButtonModule],
    }).compileComponents();

    fixture = TestBed.createComponent(NotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should display correct input values", () => {
    const notFoundTransactionDescription = "We will show your donation history for the last two years and all related tax receipts on this page.";
    const noHistoryFound = "Monthly donation";
    const notFoundTransactionSubDescription = "We'd love your support! Your donation has the means to make an impact.";
    const notFoundGif = "/assets/images/pages/common/not-found.gif";
    const strokedButton = "Monthly donation";
    const flatButton = "One-time donation";

    component.notFoundDescription = notFoundTransactionDescription;
    component.noHistoryFound = noHistoryFound;
    component.notFoundSubDescription =
      notFoundTransactionSubDescription;
    component.notFoundGif = notFoundGif;
    component.strokedButton = strokedButton;
    component.flatButton = flatButton;

    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector("h2").textContent).toContain(
      notFoundTransactionDescription
    );
    expect(compiled.querySelector("h3").textContent).toContain(noHistoryFound);
    expect(compiled.querySelector("p").textContent).toContain(
      notFoundTransactionSubDescription
    );
    expect(compiled.querySelector("img").getAttribute("src")).toContain(
      notFoundGif
    );
    expect(
      compiled.querySelector("button[mat-stroked-button]").textContent
    ).toContain(strokedButton);
    expect(
      compiled.querySelector("button[mat-flat-button]").textContent
    ).toContain(flatButton);
  });
});
