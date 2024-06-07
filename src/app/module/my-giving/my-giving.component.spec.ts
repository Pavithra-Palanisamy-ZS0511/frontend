import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyGivingComponent } from './my-giving.component';
import { MatDrawer } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { of } from 'rxjs';

describe('MyGivingComponent', () => {
  let component: MyGivingComponent;
  let fixture: ComponentFixture<MyGivingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        MatIconModule,
        MatButtonModule,
        FontAwesomeModule
      ],
      providers: [
        {
          provide: FuseMediaWatcherService,
          useValue: {
            onMediaChange$: of({ matchingAliases: ['lg'] })
          }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyGivingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set drawer mode and drawer opened based on media changes', () => {
    const fuseMediaWatcherService = TestBed.inject(FuseMediaWatcherService);
    const spy = spyOn(component['_changeDetectorRef'], 'markForCheck');
    spyOn(fuseMediaWatcherService.onMediaChange$, 'pipe').and.returnValue(of({ matchingAliases: ['lg'] }));
    
    component.ngOnInit();
    
    expect(component.drawerMode).toEqual('side');
    expect(component.drawerOpened).toEqual(true);
    expect(spy).toHaveBeenCalled();
  });

  it('should navigate to the selected panel', () => {
    const panelId = 'monthly-commitment';
    component.goToPanel(panelId);
    expect(component.selectedPanel).toEqual(panelId);
  });

  it('should close the drawer when in over mode', () => {
    component.drawerMode = 'over';
    spyOn(component.drawer, 'close');
    component.goToPanel('monthly-commitment');
    expect(component.drawer.close).toHaveBeenCalled();
  });

  it('should return panel info based on id', () => {
    const panelId = 'monthly-commitment';
    const panelInfo = component.getPanelInfo(panelId);
    expect(panelInfo.id).toEqual(panelId);
  });


});

