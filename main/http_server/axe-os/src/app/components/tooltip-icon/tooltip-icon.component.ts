import { Component, Input, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip'; // <-- HIER IMPORTIEREN

@Component({
    selector: 'tooltip-icon',
    templateUrl: './tooltip-icon.component.html',
    styleUrls: ['./tooltip-icon.component.scss'],
    standalone: true,
    imports: [CommonModule, TooltipModule] // <-- HIER HINZUFÜGEN
})
export class TooltipIconComponent {
  @Input() tooltip: string = '';
  @Input() size: string = 'xs';
  @Input() icon: string = '';

  showMobileTooltip = false;
  isMobile = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

  get tooltipIconClass(): string {
    return `pi ${this.icon} text-${this.size} pl-1 pr-2 tooltip-icon`;
  }
}
