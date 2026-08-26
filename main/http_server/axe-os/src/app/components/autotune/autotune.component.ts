import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';

import { LoadingService } from 'src/app/services/loading.service';
import { ToastrService } from 'ngx-toastr';
import { AutotuneSettings, SystemInfo } from 'src/app/generated/models';
import { SystemApiService } from 'src/app/services/system.service';

// PrimeNG & Eigene UI-Element-Imports für das Template
import { CheckboxComponent } from '../checkbox/checkbox.component';
import { SliderComponent } from '../slider/slider.component';
import { TooltipTextIconComponent } from '../tooltip-text-icon/tooltip-text-icon.component';

interface SliderConfig {
  formControlName: string;
  label: string;
  min: number;
  max: number;
  step: number;
  unit: string;
  tooltip: string;
}

@Component({
  selector: 'autotune',
  templateUrl: './autotune.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CheckboxComponent,
    SliderComponent,
    TooltipTextIconComponent
  ]
})
export class AutotuneComponent implements OnInit {
  public autotuneForm!: FormGroup;

  public sliderConfigs: SliderConfig[] = [
    {
      formControlName: 'power_limit',
      label: 'Power Limit',
      min: 10,
      max: 40,
      step: 1,
      unit: 'W',
      tooltip: 'The maximum power limit that the miner is allowed to use, based on your power supply output. Default:25W'
    },
    {
      formControlName: 'fan_limit',
      label: 'Fan Limit',
      min: 0,
      max: 100,
      step: 1,
      unit: '%',
      tooltip: 'Sets the maximum fan speed limit in percent. This ensures that fans do not exceed this speed, helping to control noise levels and reduce wear on the fans. Default:75%'
    },
    {
      formControlName: 'osh_pow_limit',
      label: 'Overshoot Power Limit',
      min: 0,
      max: 2.2,
      step: 0.1,
      unit: 'W',
      tooltip: 'Maximum allowed power overshoot in watts. This provides a buffer for temporary spikes above the power limit, allowing for brief surges without triggering safety mechanisms. Default:0.2W'
    },
    {
      formControlName: 'osh_fan_limit',
      label: 'Overshoot Fanspeed',
      min: 0,
      max: 25,
      step: 1,
      unit: '%',
      tooltip: 'Maximum allowed fan speed overshoot in percent. This provides a buffer for temporary spikes above the fan limit, allowing for brief increases without triggering safety mechanisms. Default:5%'
    },
    {
      formControlName: 'max_volt_asic',
      label: 'Max Voltage ASIC',
      min: 1000,
      max: 1400,
      step: 1,
      unit: 'mV',
      tooltip: 'Maximum voltage for the ASIC in millivolts. This prevents over-voltage conditions that could damage hardware, ensuring safe operation within specified limits. Default:1400mV'
    },
    {
      formControlName: 'max_freq_asic',
      label: 'Max Frequency ASIC',
      min: 400,
      max: 1000,
      step: 1,
      unit: 'MHz',
      tooltip: 'Maximum frequency for the ASIC in megahertz. This prevents overclocking beyond safe limits, ensuring stable and reliable performance. Default:1000MHz'
    },
    {
      formControlName: 'max_temp_asic',
      label: 'Max Temperature ASIC',
      min: 20,
      max: 70,
      step: 1,
      unit: '°C',
      tooltip: 'Maximum temperature allowed for the ASIC in degrees Celsius. This ensures safe operation and prevents overheating that could damage hardware or affect performance. Default:65°C'
    },
    {
      formControlName: 'max_temp_vr',
      label: 'Max Temperature VR',
      min: 20,
      max: 90,
      step: 1,
      unit: '°C',
      tooltip: 'Maximum temperature for the VoltageRegulator in degrees Celsius. This ensures thermal safety, preventing hardware damage due to overheating. Default:85°C'
    }
  ];

  constructor(
    private fb: FormBuilder,
    private systemApiService: SystemApiService,
    private loadingService: LoadingService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadAutotuneSettings();
  }

  private initForm(): void {
    this.autotuneForm = this.fb.group({
      auto_tune: [false, Validators.required],
      power_limit: [25, [Validators.required, Validators.min(10), Validators.max(40)]],
      fan_limit: [75, [Validators.required, Validators.min(0), Validators.max(100)]],
      osh_pow_limit: [0.2],
      osh_fan_limit: [5],
      max_volt_asic: [1400, [Validators.required, Validators.min(1000), Validators.max(1400)]],
      max_freq_asic: [1000, [Validators.required, Validators.min(400), Validators.max(1000)]],
      max_temp_asic: [65, [Validators.required, Validators.min(20), Validators.max(70)]],
      max_temp_vr: [85, [Validators.min(20), Validators.max(90)]],
    });
  }

  private loadAutotuneSettings(): void {
    const loadSettings$ = this.systemApiService.getAutotuneSettings();
    const loadInfo$ = this.systemApiService.getInfo();
    const loadAsic$ = this.systemApiService.getAsicSettings();

    forkJoin([loadSettings$, loadInfo$, loadAsic$])
      .pipe(this.loadingService.lockUIUntilComplete())
      .subscribe({
        next: ([settings, info, asicSettings]) => {
          this.updateSliderLimits(info, asicSettings);

          if (settings) {
            this.patchForm(settings);
          }
          // Set defaults from info if settings not available
          if (info && !settings) {
            this.patchFormFromInfo(info);
          }
        },
        error: (err: HttpErrorResponse) => {
          console.error('Failed to load autotune settings:', err);
          this.toastr.error('Failed to load autotune settings');
        }
      });
  }

  private patchForm(settings: AutotuneSettings): void {
    this.autotuneForm.patchValue({
      auto_tune: settings.auto_tune === 1,
      power_limit: settings.power_limit ?? 25,
      fan_limit: settings.fan_limit ?? 75,
      osh_pow_limit: settings.osh_pow_limit ?? 0.2,
      osh_fan_limit: settings.osh_fan_limit ?? 5,
      max_volt_asic: settings.max_volt_asic ?? 1400,
      max_freq_asic: settings.max_freq_asic ?? 1000,
      max_temp_asic: settings.max_temp_asic ?? 65,
      max_temp_vr: settings.max_temp_vr ?? 85,
    });
  }

  private patchFormFromInfo(info: SystemInfo): void {
    this.autotuneForm.patchValue({
      power_limit: info.maxPower ?? 25,
      fan_limit: info.manualFanSpeed ?? 75,
      max_temp_asic: (info.temptarget ?? 55) + 10,
      max_temp_vr: 85,
      max_volt_asic: 1400,
      max_freq_asic: 1000,
      osh_pow_limit: 0.2,
      osh_fan_limit: 5,
    });
  }

  private updateSliderLimits(info: SystemInfo, asic: any): void {
    const isPidActive = info.autofanspeed === 1;

    const minTemp = isPidActive ? ((info.temptarget ?? 19) + 1) : 20;
    const minFanspeed = isPidActive ? ((info.minFanSpeed ?? 19) + 1) : 20;
    const maxPower = info.maxPower ?? 40;

    // Update max_volt_asic and max_freq_asic based on ASIC settings
    const maxVoltage = asic?.defaultVoltage ? Math.round(asic.defaultVoltage * 1.25) : 1400;
    const maxFrequency = asic?.defaultFrequency ? Math.round(asic.defaultFrequency * 2) : 1000;

    this.sliderConfigs = this.sliderConfigs.map(config => {
      if (config.formControlName === 'max_volt_asic') {
        return { ...config, max: maxVoltage };
      }
      if (config.formControlName === 'max_freq_asic') {
        return { ...config, max: maxFrequency };
      }
      if (config.formControlName === 'max_temp_asic') {
        return { ...config, min: minTemp };
      }
      if (config.formControlName === 'fan_limit') {
        return { ...config, min: minFanspeed };
      }
      if (config.formControlName === 'power_limit') {
        return { ...config, max: maxPower };
      }
      return config;
    });
  }

  public saveAutotuneSettings(): void {
    if (this.autotuneForm.invalid) {
      this.toastr.error('Please check the form for errors');
      return;
    }

    const formValue = this.autotuneForm.value;
    const settings: AutotuneSettings = {
      auto_tune: formValue.auto_tune ? 1 : 0,
      power_limit: formValue.power_limit,
      fan_limit: formValue.fan_limit,
      osh_pow_limit: formValue.osh_pow_limit,
      osh_fan_limit: formValue.osh_fan_limit,
      max_volt_asic: formValue.max_volt_asic,
      max_freq_asic: formValue.max_freq_asic,
      max_temp_asic: formValue.max_temp_asic,
      max_temp_vr: formValue.max_temp_vr,
    };

    this.systemApiService.updateAutotuneSettings(settings)
      .pipe(this.loadingService.lockUIUntilComplete())
      .subscribe({
        next: () => {
          this.toastr.success('Autotune settings saved successfully');
        },
        error: (err: HttpErrorResponse) => {
          console.error('Failed to save autotune settings:', err);
          this.toastr.error('Failed to save autotune settings');
        }
      });
  }
}