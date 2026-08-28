import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TooltipIconComponent } from 'src/app/components/tooltip-icon/tooltip-icon.component';
import { WifiIconComponent } from './wifi-icon.component';

describe('WifiIconComponent', () => {
  let component: WifiIconComponent;
  let fixture: ComponentFixture<WifiIconComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TooltipIconComponent], // WifiIconComponent hier entfernt
    });
    fixture = TestBed.createComponent(WifiIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});