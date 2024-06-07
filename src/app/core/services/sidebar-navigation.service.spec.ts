import { TestBed } from "@angular/core/testing";
import { SidebarNavigationService } from "./sidebar-navigation.service";
import { QueryList, ElementRef } from "@angular/core";

describe("SidebarNavigationService", () => {
  let service: SidebarNavigationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SidebarNavigationService],
      providers: [SidebarNavigationService],
    });
    service = TestBed.inject(SidebarNavigationService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should handle key down event for arrow down", () => {
    const event = { key: "ArrowDown" } as KeyboardEvent;
    const panelId = "panel1";
    const panels = [{ id: "panel1" }, { id: "panel2" }];

    const mockButtons: ElementRef<any>[] = [
      { nativeElement: { focus: jest.fn() } },
      { nativeElement: { focus: jest.fn() } },
    ];
    const mockQueryList: QueryList<ElementRef<any>> = new QueryList<
      ElementRef<any>
    >();
    mockQueryList.reset(mockButtons);

    service.handleKeyDown(event, panelId, panels, mockQueryList);

    expect(mockButtons[1].nativeElement.focus).toHaveBeenCalled();
    expect(service.focusedPanel).toEqual("panel2");
  });

  it("should handle key down event for arrow down", () => {
    const event = { key: "ArrowDown" } as KeyboardEvent;
    const panelId = "panel1";
    const panels = [{ id: "panel1" }, { id: "panel2" }];
    const mockQueryList: QueryList<ElementRef<any>> = new QueryList<
      ElementRef<any>
    >();
    const mockElementRef: ElementRef<any> = {
      nativeElement: { focus: jest.fn() },
    };
    mockQueryList.reset([mockElementRef]);

    service.handleKeyDown(event, panelId, panels, mockQueryList);

    expect(mockElementRef.nativeElement.focus).toHaveBeenCalled();
    expect(service.focusedPanel).toEqual("panel2");
  });

  it("should handle focus", () => {
    const panelId = "panel1";

    service.handleFocus(panelId);
    expect(service.focusedPanel).toEqual("panel1");
  });

  it("should handle blur", () => {
    service.handleBlur();
    expect(service.focusedPanel).toBeNull();
  });
});
