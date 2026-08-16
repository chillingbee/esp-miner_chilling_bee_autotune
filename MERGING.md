# Merging Upstream (bitaxeorg/master) into this Fork

Dieses Dokument beschreibt, wie neue Commits von `bitaxeorg/master` in diesen
Fork übernommen werden, ohne die eigenen Features (Autotune, Session-Best-
Difficulty-Timer, Smooth Efficiency) zu verlieren oder bei jedem Merge von
vorne anzufangen.

## Grundprinzip

Ziel ist es, so nah wie möglich am aktuellen `bitaxeorg/master` zu bleiben.
Eigene Features werden **on top** gehalten, nicht als Abzweigung, die
irgendwann komplett auseinanderdriftet.

## Setup (einmalig)

```bash
git remote -v
# sollte "bitaxeorg" als Remote für das offizielle Repo zeigen
# falls nicht:
git remote add bitaxeorg https://github.com/bitaxeorg/ESP-Miner.git

git config rerere.enabled true
```

`rerere` merkt sich einmal gelöste Konflikte und wendet dieselbe Lösung beim
nächsten Merge automatisch wieder an. Bei wiederkehrenden Konflikten in
denselben Dateien (siehe unten) spart das sehr viel Zeit.

## Ablauf für einen Merge

```bash
# 1. Laufende Änderungen sichern, falls vorhanden
git stash

# 2. Aktuellen bitaxeorg-Stand holen
git fetch bitaxeorg

# 3. Auf dem eigenen Arbeits-Branch (z.B. master) mergen
git checkout master
git merge bitaxeorg/master

# 4. Konflikte auflösen (siehe Entscheidungsregeln unten)
#    ... bearbeiten, git add, ...
git commit

# 5. Bei Bedarf gestashte Änderungen zurückholen
git stash pop
```

**Empfehlung:** Lieber öfter und in kleineren Abständen mergen (z.B. alle
1–2 Wochen oder alle 10–15 Upstream-Commits), statt sich über Monate einen
riesigen Abstand aufbauen zu lassen. Kleine, häufige Merges erzeugen kleinere,
übersichtlichere Konflikte — und `rerere` greift zuverlässiger, wenn die
Diffs nicht zu groß sind.

## Wiederkehrende Konfliktstellen

Diese Dateien werden bei praktisch jedem Merge Konflikte zeigen, weil sowohl
`bitaxeorg` als auch dieser Fork aktiv daran arbeiten:

- `main/nvs_config.c` / `main/nvs_config.h`
- `main/http_server/http_server.c`
- `main/http_server/openapi.yaml`
- `main/http_server/axe-os/src/app/components/home/home.component.html` / `.ts`
- `main/http_server/axe-os/src/app/components/edit/edit.component.html`
- `main/http_server/axe-os/src/app/layout/styles/layout/_axe-os.scss`

Dateien, die **keine** Konflikte verursachen sollten, weil sie ausschließlich
diesem Fork gehören (neue, eigenständige Dateien):

- `main/thermal/auto_tune.c` / `.h`
- `main/http_server/axe-os/src/app/components/autotune/*`
- `main/power/vcore.c` / `main/power/TPS546.c` (TPS546-Erweiterung, sofern
  nicht auch upstream verändert)

## Entscheidungsregeln bei Konflikten

Diese Regeln haben sich aus den bisherigen Merges ergeben und sollten die
meisten Konfliktentscheidungen ohne langes Nachdenken beantworten:

### Frontend / Angular

1. **UI-Framework:** Dieser Fork hat PrimeNG durch eigene Tailwind-Komponenten
   ersetzt (`app-slider`, `app-checkbox`, `app-progressbar`, `app-dropdown`,
   `TooltipDirective` statt `pTooltip`). Bei Konflikten zwischen einer
   PrimeNG-Version (`p-slider`, `p-checkbox`, ...) und einer `app-*`-Version:
   **immer die `app-*`-Version behalten**, auch wenn die PrimeNG-Seite neuer
   aussieht. Falls die PrimeNG-Seite ein neues *Feature* enthält (nicht nur
   Styling), das Feature mit den `app-*`-Komponenten nachbauen, nicht die
   PrimeNG-Variante übernehmen.

2. **Control-Flow-Syntax:** Dieser Fork nutzt durchgängig die neue Angular-
   Syntax (`@if`, `@for`, `@else`) statt `*ngIf`/`*ngFor`. Bei Konflikten:
   neue Syntax behalten, alte Syntax migrieren statt übernehmen.

3. **`openapi.yaml` ist die Quelle der Wahrheit** für die generierten
   TypeScript-Interfaces (`ng-openapi-gen`). Jedes neue Firmware-JSON-Feld
   muss dort ergänzt werden (in der `required`-Liste und als
   Property-Definition), sonst bricht der generierte Typ.

4. Bei Formular-/Card-Blöcken, die an derselben Stelle von beiden Seiten neue
   Inhalte einfügen (z.B. zwei neue `<div>`-Blöcke direkt hintereinander):
   in der Regel **beide behalten**, nacheinander — meistens sind es
   unabhängige Ergänzungen, keine echten Widersprüche. Kurz prüfen, ob es
   sich inhaltlich überschneidet, bevor beide übernommen werden.

### Firmware / C

5. **NVS-Config (`nvs_config.h` Enum und `nvs_config.c` Array):** Neue Keys
   werden ans Ende der bestehenden, zusammengehörigen Gruppe angehängt, nicht
   mittendrin eingefügt. Enum-Reihenfolge in `.h` und Array-Reihenfolge in
   `.c` müssen exakt übereinstimmen (Array ist Index-basiert:
   `[NVS_CONFIG_X] = {...}`).

6. **REST-Endpunkte** (`http_server.c`): Neue Handler-Funktionen werden
   ergänzt, und **zusätzlich** über `httpd_uri_t` + `httpd_register_uri_handler`
   registriert — das Hinzufügen der Funktion allein reicht nicht, sie ist
   sonst nicht erreichbar. `max_uri_handlers` in der `httpd_config_t` im
   Blick behalten (siehe unten), wenn viele Endpunkte dazukommen.

7. **Funktionssignaturen mit `GlobalState *`:** Falls eine Funktion wie
   `start_rest_server` in HEAD eine andere Signatur hat als in der
   eingehenden Seite (z.B. `GlobalState * global_state` vs.
   `void * pvParameters`), prüfen, welche Variable direkt danach im Funktions-
   körper verwendet wird — das entscheidet, welche Signatur kompiliert.

8. **ESP-IDF-Versionswechsel:** API-Änderungen zwischen Versionen (z.B.
   `ws_pre_handshake_cb`, das hinter einer Kconfig-Option
   `CONFIG_HTTPD_WS_PRE_HANDSHAKE_CB_SUPPORT` versteckt sein kann) zuerst im
   passenden ESP-IDF-Header/-Kconfig-File nachschlagen, bevor man rät oder
   den Code entfernt. Meistens existiert die Funktionalität noch, ist aber
   umbenannt oder muss per Kconfig aktiviert werden.

### Allgemein

9. **Vor dem finalen Commit:** sowohl `npm run build` (Frontend) als auch
   `idf.py build` (Firmware) sauber durchlaufen lassen. Beide Builds können
   unabhängig voneinander brechen, auch wenn der Merge selbst konfliktfrei
   aussah (z.B. neue TypeScript-Modelle vs. altes Interface, tote
   Makro-Kollisionen).

10. **`npm run test:ci`** nicht vergessen — Unit-Tests fangen Dinge ab, die
    weder Build noch manuelles Durchklicken zeigen (z.B. standalone
    Components, die in `TestBed.declarations` statt `imports` stehen, oder
    Mock-Objekte, denen ein Feld fehlt, das ein neuer Codepfad
    voraussetzt).

## max_uri_handlers im Blick behalten

`esp_http_server` hat ein festes Limit für registrierte URI-Handler
(`httpd_config_t.max_uri_handlers`, aktuell auf 40 gesetzt). Bei jedem neuen
Endpunkt kurz gegenchecken:

```bash
grep -c "httpd_register_uri_handler(server" main/http_server/http_server.c
```

Kommt die Zahl in die Nähe des Limits, das Limit rechtzeitig erhöhen —
sonst schlägt die Registrierung der letzten Handler (typischerweise
`common_get_uri`, der die eigentliche Web-UI ausliefert) still fehl, ohne
sichtbaren Fehler, und das Gerät ist über die Web-UI nicht mehr erreichbar.

## Nach dem Merge: Checkliste

- [ ] `idf.py build` läuft durch
- [ ] `npm run build` (in `main/http_server/axe-os`) läuft durch
- [ ] `npm run test:ci` — alle Tests grün
- [ ] Keine übrig gebliebenen Konfliktmarker im Repo:
      `grep -rn "^<<<<<<<\|^=======$\|^>>>>>>>" main/`
- [ ] `openapi.yaml` und generierte Modelle stimmen überein (`npm run
      generate:api` neu laufen lassen, falls unsicher)
- [ ] `git log --oneline -5` zeigt einen sinnvollen Merge-Commit, keine
      liegen gebliebenen WIP-Commits
