import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HeaderComponent } from "./header.component";
import { RouterTestingModule } from "@angular/router/testing";
import { TranslocoModule } from "@ngneat/transloco";
import { LanguagesComponent } from "app/shared/languages/languages.component";
import { UserComponent } from "app/shared/user/user.component";
import { ASSET_KEYS } from "../utils/constant/AssetConstants";
import { GLOBAL_MESSAGES } from "../utils/constant/StringConstant";

describe("HeaderComponent", () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HeaderComponent,
        RouterTestingModule,
        TranslocoModule,
        UserComponent,
        LanguagesComponent,
      ],
      providers: [
        { provide: "ASSET_KEYS", useValue: ASSET_KEYS },
        { provide: "GLOBAL_MESSAGES", useValue: GLOBAL_MESSAGES },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should render logo", () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector("img")).toBeTruthy();
  });

  it("should render myGivings link", () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('a[href="/my-giving"]')).toBeTruthy();
  });

  it("should render events link", () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('a[href="/events"]')).toBeTruthy();
  });

  it("should have user component", () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector("user")).toBeTruthy();
  });

  it("should have correct alt attribute for logo", () => {
    const compiled = fixture.nativeElement;
    const imgElement = compiled.querySelector("img");
    expect(imgElement.getAttribute("alt")).toEqual("PMCF Logo");
  });

  it("should have correct text for myGivings link", () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    const myGivingsLink = compiled.querySelector('a[href="/my-giving"] span');
    expect(myGivingsLink.textContent.trim()).toEqual("My Giving");
  });

  it("should have correct text for events link", () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    const eventsLink = compiled.querySelector('a[href="/events"] span');
    expect(eventsLink.textContent.trim()).toEqual("Events");
  });
});