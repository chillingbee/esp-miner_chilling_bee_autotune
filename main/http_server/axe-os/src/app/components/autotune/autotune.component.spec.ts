import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AutotuneComponent } from './autotune.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { NO_ERRORS_SCHEMA } from '@angular/core'; // <-- HIER IMPORTIEREN

describe('AutotuneComponent', () => {
  let component: AutotuneComponent;
  let fixture: ComponentFixture<AutotuneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AutotuneComponent],
      imports: [
        CommonModule,
        ReactiveFormsModule,
        ToastrModule.forRoot()
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
      schemas: [NO_ERRORS_SCHEMA] // <-- IGNORIERT UNBEKANNTE ELEMENTE WIE TOOLTIPS IM TEST
    }).compileComponents();

    fixture = TestBed.createComponent(AutotuneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});