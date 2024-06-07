import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AccountComponent } from "./account.component";
import { MatDrawer } from "@angular/material/sidenav";
import { FuseMediaWatcherService } from "@fuse/services/media-watcher";
import { Subject } from "rxjs";

describe("AccountComponent", () => {
  let component: AccountComponent;
  let fixture: ComponentFixture<AccountComponent>;
  let fuseMediaWatcherServiceSpy: { onMediaChange$: jest.Mock };

  beforeEach(async () => {
    // Mock FuseMediaWatcherService
    fuseMediaWatcherServiceSpy = {
      onMediaChange$: jest.fn().mockReturnValue(new Subject()),
    };

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [AccountComponent],
      providers: [
        {
          provide: FuseMediaWatcherService,
          useValue: fuseMediaWatcherServiceSpy,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize with default values", () => {
    expect(component.drawerMode).toEqual("side");
    expect(component.drawerOpened).toEqual(true);
    expect(component.panels.length).toBeGreaterThan(0);
    expect(component.selectedPanel).toEqual("my-profile");
  });

  it("should change selected panel on goToPanel method call", () => {
    const newPanelId = "security";
    component.goToPanel(newPanelId);
    expect(component.selectedPanel).toEqual(newPanelId);
  });

  it("should close drawer in over mode on goToPanel method call", () => {
    const newPanelId = "payment-method";
    component.drawerMode = "over";
    const drawerCloseSpy = jest.spyOn(component.drawer, "close");
    component.goToPanel(newPanelId);
    expect(drawerCloseSpy).toHaveBeenCalled();
  });

  it("should unsubscribe from all subscriptions on ngOnDestroy", () => {
    const unsubscribeSpy = jest.spyOn(component["_unsubscribeAll"], "next");
    component.ngOnDestroy();
    expect(unsubscribeSpy).toHaveBeenCalled();
    expect(component["_unsubscribeAll"].isStopped).toBeTruthy();
  });

  it("should update drawer mode and opened status on media change", () => {
    const mediaChangeSubject = new Subject<any>();
    fuseMediaWatcherServiceSpy.onMediaChange$.mockReturnValue(
      mediaChangeSubject
    );

    // Initial state
    component.drawerMode = "side";
    component.drawerOpened = true;

    // Simulate media change to small screen
    mediaChangeSubject.next({ matchingAliases: [] });
    expect(component.drawerMode).toEqual("over");
    expect(component.drawerOpened).toEqual(false);

    // Simulate media change to large screen
    mediaChangeSubject.next({ matchingAliases: ["lg"] });
    expect(component.drawerMode).toEqual("side");
    expect(component.drawerOpened).toEqual(true);
  });

  it("should return panel info based on panel id", () => {
    const panelId = "security";
    const panelInfo = component.getPanelInfo(panelId);
    expect(panelInfo).toEqual(
      component.panels.find((panel) => panel.id === panelId)
    );
  });

  it("should track items by index or id", () => {
    const item = { id: "1", name: "Test" };
    const index = 0;

    expect(component.trackByFn(index, item)).toEqual(item.id);

    const itemWithoutId = { name: "Test" };
    expect(component.trackByFn(index, itemWithoutId)).toEqual(index);
  });
});
