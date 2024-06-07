import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { UserComponent } from "./user.component";
import { UserService } from "app/core/user/user.service";

describe("UserComponent", () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [UserComponent, RouterTestingModule],
      providers: [UserService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
    jest.clearAllMocks();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should call checkScreenSize on window resize", fakeAsync(() => {
    const checkScreenSizeSpy = jest
      .spyOn(component, "checkScreenSize")
      .mockImplementation();
    window.dispatchEvent(new Event("resize"));
    tick(300);
    expect(checkScreenSizeSpy).toHaveBeenCalled();
  }));

  it("should navigate to profile page when myProfile button is clicked", () => {
    const routerNavigateSpy = jest
      .spyOn(component["_router"], "navigate")
      .mockImplementation();
    const myProfileButton = fixture.debugElement.nativeElement.querySelector(
      ".toggle-nav-menu:first-child"
    );
    myProfileButton.click();
    expect(routerNavigateSpy).toHaveBeenCalledWith(["/account"]);
  });

  it("should call logOut method and navigate to home page when logOut button is clicked", () => {
    const routerNavigateSpy = jest
      .spyOn(component["_router"], "navigate")
      .mockImplementation();
    const logOutButton = fixture.debugElement.nativeElement.querySelector(
      ".toggle-nav-menu:last-child"
    );
    logOutButton.click();
    expect(routerNavigateSpy).toHaveBeenCalledWith(["/"]);
  });

  it("should call logOut method when logOut is called", () => {
    const routerNavigateSpy = jest
      .spyOn(component["_router"], "navigate")
      .mockImplementation();
    component.logOut();
    expect(routerNavigateSpy).toHaveBeenCalledWith(["/"]);
  });
});
