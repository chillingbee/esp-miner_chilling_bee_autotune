import 'chartjs-adapter-moment';

import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Api } from './generated/api';
import { ApiConfiguration } from './generated/api-configuration';
import { ANSIPipe } from './pipes/ansi.pipe';
import { DateAgoPipe } from './pipes/date-ago.pipe';
import { HashSuffixPipe } from './pipes/hash-suffix.pipe';
import { DiffSuffixPipe } from './pipes/diff-suffix.pipe';
import { AddressPipe } from './pipes/address.pipe';
import { SatsPipe } from './pipes/sats.pipe';
import { DialogService, DialogListComponent } from './services/dialog.service';
import { TooltipDirective } from './directives/tooltip.directive';
import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { RadioButtonComponent } from './components/radio-button/radio-button.component';
import { SliderComponent } from './components/slider/slider.component';
import { AppChartComponent } from './components/chart/app-chart.component';
import { ProgressbarComponent } from './components/progressbar/progressbar.component';
import { AppLayoutModule } from './layout/app.layout.module';

import { PoolComponent } from './components/pool/pool.component';
import { NetworkEditComponent } from './components/network-edit/network.edit.component';
import { HomeComponent } from './components/home/home.component';
import { ModalComponent } from './components/modal/modal.component';
import { WifiIconComponent } from './components/wifi-icon/wifi-icon.component';
import { TooltipIconComponent } from './components/tooltip-icon/tooltip-icon.component';
import { TooltipTextIconComponent } from './components/tooltip-text-icon/tooltip-text-icon.component';
import { ConfettiComponent } from './components/confetti/confetti.component';
import { SnowflakesComponent } from './components/snowflakes/snowflakes.component';
import { LogsComponent } from './components/logs/logs.component';
import { SystemComponent } from './components/system/system.component';
import { UpdateComponent } from './components/update/update.component';
import { NetworkComponent } from './components/network/network.component';
import { SettingsComponent } from './components/settings/settings.component';
import { SwarmComponent } from './components/swarm/swarm.component';
import { ScoreboardComponent } from './components/scoreboard/scoreboard.component';
import { ThemeConfigComponent } from './components/design/theme-config.component';
import { DesignComponent } from './components/design/design.component';
import { AutotuneComponent } from './components/autotune/autotune.component';
import { EditComponent } from './components/edit/edit.component';

const components = [
  AppComponent,
  SnowflakesComponent,
];

@NgModule({
  declarations: [
    ...components,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right'
    }),
    BrowserAnimationsModule,
    CommonModule,
    AppLayoutModule,
    TooltipDirective,
    CheckboxComponent,
    DropdownComponent,
    RadioButtonComponent,
    SliderComponent,
    AppChartComponent,
    ProgressbarComponent,
    SettingsComponent,
    ANSIPipe,
    DateAgoPipe,
    HashSuffixPipe,
    DiffSuffixPipe,
    AddressPipe,
    SatsPipe,
    DesignComponent,
    DialogListComponent,
    ScoreboardComponent,
    ThemeConfigComponent,
    AutotuneComponent,
    SwarmComponent,
    TooltipIconComponent,
    TooltipTextIconComponent,
    PoolComponent,
    NetworkEditComponent,
    HomeComponent,
    ModalComponent,
    WifiIconComponent,
    ConfettiComponent,
    LogsComponent,
    SystemComponent,
    UpdateComponent,
    NetworkComponent,
    EditComponent,
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: ApiConfiguration, useValue: { rootUrl: '' } },
    Api,
    DialogService,
    provideHttpClient()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }