import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface ThemeSettings {
  colorScheme: string;
  primaryColor: string;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly mockSettings: ThemeSettings = {
    colorScheme: 'dark',
    primaryColor: '#F80421'
  };

  private themeSettingsSubject = new BehaviorSubject<ThemeSettings>(this.mockSettings);
  private themeSettings$ = this.themeSettingsSubject.asObservable();

  constructor(private http: HttpClient) {
    if (!environment.mock) {
      this.http.get<ThemeSettings>('/api/theme').pipe(
        catchError(() => of(this.mockSettings)),
        tap(settings => this.themeSettingsSubject.next(settings))
      ).subscribe();
    }
  }

  getThemeSettings(): Observable<ThemeSettings> {
    return this.themeSettings$;
  }

  saveThemeSettings(settings: ThemeSettings): Observable<void> {
    if (!environment.mock) {
      return this.http.post<void>('/api/theme', settings).pipe(
        tap(() => this.themeSettingsSubject.next(settings))
      );
    } else {
      this.themeSettingsSubject.next(settings);
      return of(void 0);
    }
  }

  static generateThemeVariables(primaryColor: string): Record<string, string> {
    // Parse the primary color (assumed to be in hex format like #RRGGBB)
    const hex = primaryColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Generate color variations
    const withAlpha = (alpha: number) => `rgba(${r}, ${g}, ${b}, ${alpha})`;
    const lighten = (amount: number) => {
      const nr = Math.min(255, Math.round(r + (255 - r) * amount));
      const ng = Math.min(255, Math.round(g + (255 - g) * amount));
      const nb = Math.min(255, Math.round(b + (255 - b) * amount));
      return `rgb(${nr}, ${ng}, ${nb})`;
    };
    const darken = (amount: number) => {
      const nr = Math.max(0, Math.round(r * (1 - amount)));
      const ng = Math.max(0, Math.round(g * (1 - amount)));
      const nb = Math.max(0, Math.round(b * (1 - amount)));
      return `rgb(${nr}, ${ng}, ${nb})`;
    };

    return {
      // Primary colors
      '--p-primary-50': lighten(0.95),
      '--p-primary-100': lighten(0.85),
      '--p-primary-200': lighten(0.7),
      '--p-primary-300': lighten(0.5),
      '--p-primary-400': lighten(0.3),
      '--p-primary-500': `rgb(${r}, ${g}, ${b})`,
      '--p-primary-600': darken(0.15),
      '--p-primary-700': darken(0.3),
      '--p-primary-800': darken(0.45),
      '--p-primary-900': darken(0.6),
      '--p-primary-950': darken(0.75),

      // Primary with alpha
      '--p-primary-50-rgb': `${Math.round(r * 0.95)}, ${Math.round(g * 0.95)}, ${Math.round(b * 0.95)}`,
      '--p-primary-100-rgb': `${Math.round(r * 0.85)}, ${Math.round(g * 0.85)}, ${Math.round(b * 0.85)}`,
      '--p-primary-200-rgb': `${Math.round(r * 0.7)}, ${Math.round(g * 0.7)}, ${Math.round(b * 0.7)}`,
      '--p-primary-300-rgb': `${Math.round(r * 0.5)}, ${Math.round(g * 0.5)}, ${Math.round(b * 0.5)}`,
      '--p-primary-400-rgb': `${Math.round(r * 0.3)}, ${Math.round(g * 0.3)}, ${Math.round(b * 0.3)}`,
      '--p-primary-500-rgb': `${r}, ${g}, ${b}`,
      '--p-primary-600-rgb': `${Math.round(r * 0.85)}, ${Math.round(g * 0.85)}, ${Math.round(b * 0.85)}`,
      '--p-primary-700-rgb': `${Math.round(r * 0.7)}, ${Math.round(g * 0.7)}, ${Math.round(b * 0.7)}`,
      '--p-primary-800-rgb': `${Math.round(r * 0.55)}, ${Math.round(g * 0.55)}, ${Math.round(b * 0.55)}`,
      '--p-primary-900-rgb': `${Math.round(r * 0.4)}, ${Math.round(g * 0.4)}, ${Math.round(b * 0.4)}`,
      '--p-primary-950-rgb': `${Math.round(r * 0.25)}, ${Math.round(g * 0.25)}, ${Math.round(b * 0.25)}`,

      // Primary with alpha variants
      '--p-primary-100-a': withAlpha(0.1),
      '--p-primary-200-a': withAlpha(0.2),
      '--p-primary-300-a': withAlpha(0.3),
      '--p-primary-400-a': withAlpha(0.4),
      '--p-primary-500-a': withAlpha(0.5),
      '--p-primary-600-a': withAlpha(0.6),
      '--p-primary-700-a': withAlpha(0.7),
      '--p-primary-800-a': withAlpha(0.8),
      '--p-primary-900-a': withAlpha(0.9),

      // Contrast colors
      '--p-on-primary': lighten(0.95),
      '--p-on-primary-container': darken(0.75),
      '--p-primary-container': lighten(0.3),

      // Surface variants with primary tint
      '--p-surface-tint': `rgb(${r}, ${g}, ${b})`,
      '--p-surface-container-highest': `rgba(${r}, ${g}, ${b}, 0.05)`,
    };
  }
}