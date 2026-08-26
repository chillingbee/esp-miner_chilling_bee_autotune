import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { LoadingService } from 'src/app/services/loading.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-loading',
    templateUrl: './loading.component.html',
    styleUrls: ['./loading.component.scss'],
    standalone: true,
    imports: [CommonModule]
})
export class LoadingComponent {

  @Input() ngClass: any;
  public loading$: Observable<boolean>;

  constructor(private loadingService: LoadingService) {
    this.loading$ = this.loadingService.loading$.asObservable();
  }
}
