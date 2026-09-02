import { Injectable, effect, signal } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ThemeService } from '../../services/theme.service';
import { LocalStorageService } from '../../local-storage.service';

const STATIC_MENU_DESKTOP_INACTIVE = 'STATIC_MENU_DESKTOP_INACTIVE'

export interface AppConfig {
    colorScheme: string;
    menuMode: string;
    scale: number;
}

interface LayoutState {
    staticMenuDesktopInactive: boolean;
    overlayMenuActive: boolean;
    profileSidebarVisible: boolean;
    configSidebarVisible: boolean;
    staticMenuMobileActive: boolean;
    menuHoverActive: boolean;
}

@Injectable({
    providedIn: 'root',
})
export class LayoutService {
    _config: AppConfig = {
        menuMode: 'static',
        colorScheme: 'dark',
        scale: 14,
    };

    config = signal<AppConfig>(this._config);

    state: LayoutState = {
        staticMenuDesktopInactive: false,
        overlayMenuActive: false,
        profileSidebarVisible: false,
        configSidebarVisible: false,
        staticMenuMobileActive: false,
        menuHoverActive: false,
    };

    isWideView = signal<boolean>(this.localStorageService.getBool('DASHBOARD_WIDE_VIEW'));

    private overlayOpen = new Subject<any>();
    overlayOpen$ = this.overlayOpen.asObservable();

    private staticMenuDesktopInactive$ = new BehaviorSubject<boolean>(this.state.staticMenuDesktopInactive);

    constructor(
      private themeService: ThemeService,
      private localStorageService: LocalStorageService
    ) {
        // Load saved theme settings from NVS
        this.themeService.getThemeSettings().subscribe(
            settings => {
                if (settings) {
                    this._config = {
                        ...this._config,
                        colorScheme: settings.colorScheme,
                    };

                    document.documentElement.style.setProperty('--color-primary', settings.primaryColor);
                } else {
                    // Save default red dark theme if no settings exist
                    const defaultPrimary = '#F80421';
                    this.themeService.saveThemeSettings({
                        colorScheme: 'dark',
                        primaryColor: defaultPrimary
                    }).subscribe();
                    
                    document.documentElement.style.setProperty('--color-primary', defaultPrimary);
                }
                // Update signal with config
                this.config.set(this._config);
                // Apply initial theme
                this.changeTheme();
            },
            error => {
                console.error('Error loading theme settings:', error);
                // Use default theme on error
                this.config.set(this._config);
                this.changeTheme();
            }
        );

        effect(() => {
            const config = this.config();
            this.changeTheme();
            this.changeScale(config.scale);
            this.handleStaticMenuDesktopInactivity();
        });
    }

    onMenuToggle() {
        if (this.isOverlay()) {
            this.state.overlayMenuActive = !this.state.overlayMenuActive;
            if (this.state.overlayMenuActive) {
                this.overlayOpen.next(null);
            }
        }

        if (this.isDesktop()) {
            this.state.staticMenuDesktopInactive =
                !this.state.staticMenuDesktopInactive;

            this.localStorageService.setBool(STATIC_MENU_DESKTOP_INACTIVE, this.state.staticMenuDesktopInactive);
            this.staticMenuDesktopInactive$.next(this.state.staticMenuDesktopInactive);
        } else {
            this.state.staticMenuMobileActive =
                !this.state.staticMenuMobileActive;

            if (this.state.staticMenuMobileActive) {
                this.overlayOpen.next(null);
            }
        }
    }

    showProfileSidebar() {
        this.state.profileSidebarVisible = !this.state.profileSidebarVisible;
        if (this.state.profileSidebarVisible) {
            this.overlayOpen.next(null);
        }
    }

    showConfigSidebar() {
        this.state.configSidebarVisible = true;
    }

    isOverlay() {
        return this.config().menuMode === 'overlay';
    }

    isDesktop() {
        return window.innerWidth > 991;
    }

    isMobile() {
        return !this.isDesktop();
    }

    changeTheme() {
        const config = this.config();
        const root = document.documentElement;

        // Resolve 'auto' to actual scheme
        let effectiveScheme = config?.colorScheme || 'dark';
        const isGlass = (effectiveScheme || '').startsWith('glass-') || effectiveScheme === 'glass';
        const isAuto = effectiveScheme.endsWith('auto') || effectiveScheme === 'auto';

        if (isAuto) {
            const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (isGlass) {
                effectiveScheme = systemDark ? 'glass-dark' : 'glass-light';
            } else {
                effectiveScheme = systemDark ? 'dark' : 'light';
            }
        } else if (effectiveScheme === 'glass') {
            // Default glass to dark if not specified
            effectiveScheme = 'glass-dark';
        }

        // Toggle theme CSS classes
        root.classList.remove('theme-dark', 'theme-light', 'theme-white', 'theme-glass-dark', 'theme-glass-light', 'theme-cyberpunk', 'theme-tron');
        root.classList.add(`theme-${config.colorScheme}`);

        // Toggle dark-mode class for theme switching
        if (effectiveScheme === 'white' || effectiveScheme === 'light' || effectiveScheme === 'glass-light') {
            root.classList.remove('dark-mode');
        } else {
            root.classList.add('dark-mode');
        }

        // Apply glass effect if needed
        if (effectiveScheme.includes('glass')) {
             root.classList.add('glass-mode');
        } else {
             root.classList.remove('glass-mode');
        }

        // Load theme settings from NVS
        this.themeService.getThemeSettings().subscribe(
            settings => {
                if (settings && settings.primaryColor) {
                    root.style.setProperty('--color-primary', settings.primaryColor);
                }
            },
            error => console.error('Error loading accent colors:', error)
        );
    }

    changeScale(value: number) {
        document.documentElement.style.fontSize = `${value}px`;
    }

    handleStaticMenuDesktopInactivity() {
        if (!this.isDesktop()) {
            return;
        }

        this.state.staticMenuDesktopInactive = this.localStorageService.getBool(STATIC_MENU_DESKTOP_INACTIVE);
        this.staticMenuDesktopInactive$.next(this.state.staticMenuDesktopInactive);
    }

    toggleWideView() {
        this.isWideView.set(!this.isWideView());
        this.localStorageService.setBool('DASHBOARD_WIDE_VIEW', this.isWideView());
    }

    getStaticMenuDesktopInactive$() {
      return this.staticMenuDesktopInactive$.asObservable();
    }
}
