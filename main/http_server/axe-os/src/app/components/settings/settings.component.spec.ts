import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SettingsComponent } from './settings.component';
import { EditComponent } from '../edit/edit.component';
import { provideHttpClient } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HashSuffixPipe } from 'src/app/pipes/hash-suffix.pipe';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EditComponent, HashSuffixPipe], // SettingsComponent hier NICHT importieren, da sie selbst getestet wird
      providers: [
        provideToastr(),
        provideHttpClientTesting(),
        provideHttpClient(),
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { 
              paramMap: { get: () => '1' },
              queryParamMap: { get: () => null }
            },
            params: of({}),
            queryParams: of({}),
            paramMap: of({ get: () => '1' }),
            queryParamMap: of({ get: () => null })
          }
        }
      ]
    });
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});