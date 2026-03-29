# moto
This is a fantastic project — basically building a **predictive maintenance system** for a 50cc scooter. Let me architect the whole thing properly.Hadchi is a seriously smart project — basically building a **scooter health intelligence platform**. Let me architect the whole system from the ECU wire to the notification on your phone.

First, the system overview:Now let me break down each layer with the concrete implementation details.

## Layer 1 — The Physical Connection

Your ECU has a **diagnostic connector** (referenced in the workshop manual page 5-19). Pin 2 is K-Line (wire color L/O = Blue/Orange). The protocol is **ISO 14230 (KWP2000)** — this is the standard for European scooters of this era.

**What you need**: A Bluetooth ELM327 adapter that supports **ISO 14230** (not just CAN — many cheap ones are CAN-only). The v1.5 or v2.1 clones from Avito/AliExpress for 80–150 DHS work, but verify it supports "protocol 5" (ISO 14230 slow init). You'll also need a simple wiring adapter from the Kymco diagnostic plug to the ELM327's OBD-II connector — just 3 wires: K-Line (pin 2), Battery+ (pin 1, B/L wire), Ground (pin 5, G/B wire).

**Available live PIDs** (from the diagnostic report pages in the workshop manual):

| Parameter | Unit | Durability Relevance |
|-----------|------|---------------------|
| Engine RPM | rpm | High RPM = accelerated valve/piston wear |
| Engine temp (EWT) | °C | >165°C triggers DTC P0217, but sustained >130°C already accelerates oil degradation |
| TPS position | % | Erratic readings = sensor failure approaching |
| O2 sensor voltage | 0–1V | Drift from 0.2–0.6V range = AFR issues = carbon buildup |
| Battery voltage | V | <12V = charging system failing |
| Idle solenoid PWM | % | 30–95% normal; outside = carburetor issue |
| Ignition advance | degrees | Should be 3–13° at idle; deviation = timing problem |
| Speed (VSS) | km/h | RPM/speed ratio reveals CVT health |
| Active DTCs | codes | Early warning of component failure |

## Layer 2 — Phone Logger → GitHub

The phone connects to ELM327 via Bluetooth and logs data to CSV. At end of day (or when you connect to WiFi), it pushes to a GitHub repo.

**Android app approach**: Use **Torque Pro** (~25 DHS on Play Store) or the free **OBD Fusion** — both support custom PID definitions and CSV logging. But for full control, a custom app using the `android-obd-reader` library gives you exactly the format you want.

**CSV structure** (one row per sample, ~1 sample/second while riding):

```
timestamp,rpm,engine_temp_c,tps_pct,o2_voltage,battery_v,idle_pwm_pct,ign_advance_deg,speed_kmh
2026-03-29T08:32:15,3200,78,45,0.42,13.1,65,12,32
2026-03-29T08:32:16,4100,79,72,0.38,13.0,68,18,38
```

**GitHub push**: A simple shell script (via Termux on Android) or a lightweight Python script that runs `git add/commit/push` to your private repo. Files go to `/logs/2026-03-29.csv`. Each day = one file. A typical 30-minute ride at 1 Hz = ~1,800 rows ≈ 150 KB — GitHub handles this easily.

## Layer 3 — AI Analysis Engine (the interesting part)

A **GitHub Actions** workflow triggers every night (cron) or on every push to `/logs/`. It runs a Python script that:

**Step 1 — Load & parse** the day's CSV
**Step 2 — Compute durability metrics**:

Here are the key rules, derived directly from your ECU's workshop manual specs:

**Rule 1: Thermal stress score** — The NTC sensor gives engine temp. Oil degrades exponentially above 100°C. Each minute spent above 110°C = 2× normal wear. Above 130°C = 5×. Above 165°C = critical (DTC P0217). The script computes a daily "thermal stress index" = Σ(time_at_temp × wear_multiplier). If the trend line rises week over week → oil change interval should shorten → notification.

**Rule 2: O2 sensor health** — Healthy O2 sensor oscillates 0.2–0.6V at idle. If average O2 voltage drifts consistently above 0.6V (rich) or below 0.2V (lean) → AFR is off → carbon buildup on valves → warn user. Also: if O2 voltage becomes **static** (no oscillation) → sensor dying → replace before it causes damage.

**Rule 3: CVT wear detection** — This is the clever one. Plot RPM vs speed. A healthy CVT has a predictable curve (RPM rises, belt shifts, RPM drops to cruising speed). If the RPM-at-max-speed starts **creeping upward** over weeks → variator rollers are wearing flat → belt isn't shifting fully → replace before the belt gets damaged too.

**Rule 4: Idle stability** — Idle solenoid PWM should be 30–95%. If it's consistently near 95% → the solenoid is maxing out to compensate for something → likely pilot jet clogging (very common in Marrakech dust). Alert before the bike starts stalling.

**Rule 5: Battery/charging trend** — Battery voltage should be >13V when engine running (charging). If running voltage drops below 13V progressively → regulator/rectifier degrading → battery will die soon.

**Rule 6: RPM histogram for durability** — Track what percentage of riding time is spent in each RPM band. For maximum durability on this engine, optimal cruising is 4,000–5,500 RPM. Time spent above 6,500 RPM accelerates valve guide wear (remember — this is air-cooled, and Marrakech heat makes it worse). Weekly RPM distribution report helps you adjust riding habits.

## Layer 4 — Notifications & Dashboard

**Notifications**: Use **ntfy.sh** (free, open-source push notification service — no app needed, works via HTTP POST from GitHub Actions). Or email via GitHub Actions' built-in SMTP. Notifications are graded:

| Severity | Example | Channel |
|----------|---------|---------|
| **Info** | "Weekly report ready" | Dashboard only |
| **Warning** | "O2 sensor drift increasing — check within 500 km" | Push + email |
| **Critical** | "Engine temp exceeded 140°C 3 times this week — check cooling" | Immediate push |

**Dashboard**: GitHub Pages (free hosting from the same repo). A static HTML page with Chart.js that reads the analysis JSON output. Shows: thermal stress trend, RPM distribution histogram, O2 health gauge, CVT wear curve, upcoming maintenance predictions.

## The Repo Structure

```
kymco-agility-monitor/
├── logs/
│   ├── 2026-03-29.csv
│   └── 2026-03-30.csv
├── analysis/
│   ├── analyzer.py          # Main analysis script
│   ├── rules.py             # Durability rules engine
│   ├── models.py            # Trend/anomaly detection
│   └── results/
│       └── 2026-03-29.json  # Daily analysis output
├── dashboard/
│   ├── index.html           # GitHub Pages site
│   ├── charts.js            # Chart.js visualizations
│   └── style.css
├── config/
│   ├── thresholds.yaml      # All alert thresholds
│   └── bike_specs.yaml      # Kymco Agility 50 specs
├── .github/
│   └── workflows/
│       └── analyze.yml      # GitHub Actions cron
└── README.md
```

## Implementation Roadmap

**Phase 1** (Week 1–2): Hardware — buy ELM327 BT adapter, wire the diagnostic connector adapter, verify K-Line communication, confirm which PIDs your specific ECU responds to.

**Phase 2** (Week 3–4): Logger — set up Torque Pro or custom logger, configure CSV format, set up GitHub repo, automate daily push via Termux.

**Phase 3** (Week 5–6): Analysis — write the Python analyzer with Rules 1–6, set up GitHub Actions workflow, test with a week's worth of real data.

**Phase 4** (Week 7–8): Dashboard + notifications — build the GitHub Pages dashboard, configure ntfy.sh push notifications, tune alert thresholds to your actual riding patterns.

Wach bghiti nbed2aw b Phase 1 — n-détailliw the wiring diagram dyal diagnostic connector → ELM327, w n-testaw the K-Line communication protocol? Ola bghiti nbed2aw b the Python analysis engine (Phase 3) hit tkoun ready melli t-collecti l-data?
