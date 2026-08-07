import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutotuneComponent } from './autotune.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('SettingsComponent', () => {
  let component: AutotuneComponent;
  let fixture: ComponentFixture<AutotuneComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      providers: [
       provideHttpClient(),
       provideHttpClientTesting(),
  // ... weitere Provider
]
      imports: [AutotuneComponent]
    });
    fixture = TestBed.createComponent(AutotuneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
