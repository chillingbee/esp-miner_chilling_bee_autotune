import { Component } from '@angular/core';
import { ThemeConfigComponent } from './theme-config.component';

@Component({
    selector: 'app-design',
    templateUrl: './design.component.html',
    standalone: true,
    imports: [ThemeConfigComponent]
})
export class DesignComponent {
  constructor() { }
}
