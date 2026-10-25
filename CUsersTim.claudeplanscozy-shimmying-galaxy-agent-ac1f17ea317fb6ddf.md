# ESP-Miner Migration Plan: yyjson + Angular Standalone

## Constraints
- Preserve upstream Standalone / yyjson architecture.
- Do NOT revert to cJSON or NgModules.

## Critical Functions to Modify (with patterns)

### 1. Autotune (P1)
- Backend: `main/http_server/system_api_json.c` → `system_api_add_config()`
  Pattern: `yyjson_mut_obj_add_bool(doc, root, "autotuneEnabled", AUTO_TUNE.auto_tune_hashrate);` and `yyjson_mut_obj_add_strcpy(...)` for status.
- Frontend: `main/http_server/axe-os/src/app/components/autotune/autotune.component.ts`
  Pattern: Standalone component (`standalone: true`, `imports: [CommonModule, ReactiveFormsModule, TooltipTextIconComponent]`). Update slider configs via `sliderConfigs` array; map `autotuneForm.patchValue()` from `SystemApiService.getAutotune()`.
- Update `SystemService`: add `autotuneEnabled?: boolean; autotuneStatus?: string;` to `SystemInfo` interface (`generated/models/system-info.ts`).

### 2. Best Session Timer (P2)
- Backend: `main/http_server/system_api_json.c` → `system_api_add_telemetry()` (yyjson branch, lines 95+)
  Pattern: Add `yyjson_mut_obj_add_uint(doc, root, "bestScoreUptime", best_score_uptime);` and include `start_time_us` tracking from `g->SYSTEM_MODULE.start_time_us`.
- Frontend: `main/http_server/axe-os/src/app/components/home/home.component.ts`
  Pattern: In `tap()` (line ~1118), compute `bestScoreUptime` and `uptimeSinceBest` from info; set `this.lastBestUpdate`. Template shows timer.

### 3. Efficiency (P3)
- Frontend: `main/http_server/axe-os/src/app/components/home/home.component.ts` (lines 1159-1181)
  Pattern: `calculateEfficiency()` mapped to `hashRate`, `hashRate_1m`. Add `expectedEfficiency` and smoothed average. Ensure `SystemInfo` interface includes efficiency fields.

### 4. Cyberpunk Theme (P4)
- Frontend: Restore `main/http_server/axe-os/src/app/layout/styles/layout/_cyberpunk.scss`.
- Update `app.layout.service.ts`: `changeTheme()` must include `'theme-cyberpunk'` in `root.classList.remove/add` (line 165-166). Ensure `isGlass` and `effectiveScheme` handle `'cyberpunk'`.
- `theme-config.component.ts`: Restore `cyberpunk` option in `themes` array / scheme switch (line 177 `scheme === 'cyberpunk'`). Keep standalone (`imports: [RadioButtonComponent, FormsModule]`).

### 5. System Config
- `main/http_server/http_server.c`: Resolve merge conflict at line 1982-1986.
  Pattern: Restore `config.max_uri_handlers = 50;` (HEAD side) instead of `num_routes + 4`; do NOT revert to old cJSON route registration.

## Files to Modify (Critical)
- `main/http_server/system_api_json.c`
- `main/http_server/http_server.c`
- `main/http_server/axe-os/src/app/services/system.service.ts`
- `main/http_server/axe-os/src/app/components/autotune/autotune.component.ts`
- `main/http_server/axe-os/src/app/components/home/home.component.ts`
- `main/http_server/axe-os/src/app/layout/service/app.layout.service.ts`
- `main/http_server/axe-os/src/app/components/design/theme-config.component.ts`
