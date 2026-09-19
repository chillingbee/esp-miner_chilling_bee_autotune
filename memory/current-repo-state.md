---
name: current-repo-state
description: Rebase abgeschlossen — feat/chillingbee-clean linear auf bitaxeorg/master, Build grün, alle Features erhalten
metadata:
  type: project
---

Rebase `feat/chillingbee-clean` auf `0c798ded` (bitaxeorg/master) abgeschlossen.
Commit `3d49d948` (ursprünglich `42a0afd8`) enthält alle Auflösungen.

Features verifiziert (Build + Firmware laufend):
- Auto-Tune / Cyberpunk: erhalten (lokale Features, nie upstream)
- `max_uri_handlers = 50` (`http_server.c`)
- `best_session_uptime` / `best_session_nonce_diff` (`system.c`)
- `smoothedEfficiencyAverage` + 99/1-Filter (`axe-os/home.component.ts`)
- `pool_difficulty` Fix (`system_api_json.c` — Claude-Autor `42a0afd8`)

Graphify: `graphify-out/graph.json` (3297 Nodes, 166 Communities, 5.5MB)
Stash: `rebase-stash` gedroppt; `graphify-out/` sauber

Nächster Schritt: Wöchentlicher Upstream-Sync (siehe merge-strategy.md)
