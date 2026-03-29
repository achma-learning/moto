Hna the results — YouTube videos specifically on K-Line motorcycle ECU readers are rare, but I found something better: **a complete ecosystem of open-source projects** that are directly applicable to your Kymco. Let me map what I found to your exact use case:

## The Gold Mine: Key Projects & Resources

### Direct YouTube Video
**DPF Monitor — Arduino + L9637D + K-Line** (exactly the hardware stack we discussed)
https://www.youtube.com/watch?v=pMgqPjYh5is
Arduino Nano + L9637D chip reading live data from OBD-II K-Line pin. The device reads data in real time through the K-line using ISO 9141-2, connected with just 3 wires: +12V, ground, and K-line. No ELM interface required. This is the closest project to what you're building.

### The Most Important GitHub Repos

**1. muki01/OBD2_KLine_Library** — This is your starting codebase
https://github.com/muki01/OBD2_KLine_Library

A lightweight Arduino-compatible library that enables direct communication with vehicles using K-Line (ISO 9141 / ISO 14230 - KWP2000), designed for Arduino, ESP32, and similar platforms. It has ready-to-use code to read RPM, coolant temp, and speed with just a few lines. The library even auto-detects the protocol (ISO9141 vs ISO14230 slow vs fast init) — critical since we're not 100% sure which variant the Dellorto ECU uses.

**2. muki01/OBD2_K-line_Reader** — Complete project with schematics
https://github.com/muki01/OBD2_K-line_Reader

Provides hardware schematics using dedicated automotive ICs like the L9637D, MCZ33290, and SN65HVDA195, plus a WebServer mode for ESP32 that displays live data on a webpage — exactly the "local website" part of your architecture.

**3. sophienyaa/Honda-Motorcycle-ECU-Tools** — Motorcycle-specific K-Line on ESP32
https://github.com/sophienyaa/Honda-Motorcycle-ECU-Tools

An ESP32 module tied directly into the ECU via diagnostic socket, monitoring engine temperature, throttle position, intake air temperature — built for a Honda enduro but the hardware approach is identical to what we need for the Kymco.

**4. BananaJoh/sv650overlay** — ESP32 motorcycle data logger with phone app
https://github.com/BananaJoh/sv650overlay

ESP32 reads diagnostic sensor data from bike ECU via K-Line (SDS protocol) and sends it via Bluetooth. Android smartphone app receives, processes, displays and optionally records the data in CSV format. This has the phone integration + CSV logging you want.

**5. terrafirma2021/Yamaha-DataLogger** — ESP32-S3 + L9637D motorcycle logger
https://github.com/terrafirma2021/Yamaha-DataLogger

An ESP32-S3 based device that converts K-line data into CAN bus OBD2 standard using ELM327 emulation, enabling compatibility with apps like RaceChrono, Realdash, and Torque. Supported PIDs include RPM, speed, coolant temp. Uses the exact L9637D + ESP32 combo I recommended.

### Key Forum Threads (10+ years of accumulated knowledge)

**Arduino Forum: "Bike interface OBD"** — 18 pages, active since 2014
https://forum.arduino.cc/t/bike-interface-obd/229761

This is the master thread. Everyone from Suzuki GSXR to Kawasaki to Yamaha owners has contributed. TriB's L9637D solution that converts K-Line to serial signal is referenced everywhere. One key finding: with ISO 14230, minimum time between requests is 100ms, but it can be reduced to 55ms, though the ECU then takes 75ms to respond. This tells you your max sampling rate is ~10–13 Hz — plenty for durability monitoring.

## Why This Matters for Your Kymco

The critical insight from all these projects: normal OBD-II chips like the ELM327 are incompatible with motorcycle K-Line because bikes don't use standard OBD-II protocol on top of K-Line. They use raw KWP2000 or manufacturer-specific protocols. Your Kymco Dellorto ECU is the same situation — it speaks KWP2000 (ISO 14230) over K-Line, but with Kymco-specific PIDs and init sequences.

This means the **ELM327 from Marjane at 99 DHS will almost certainly NOT work** for reading live data from your bike. It would need to be the **ESP32 + L9637D route** — which is exactly what every successful motorcycle K-Line project uses.

The muki01 library is your best starting point — it handles ISO14230 on ESP32 natively and includes schematics, web dashboard code, and example scripts. Combined with the Yamaha DataLogger as a reference for the Bluetooth/phone bridge, you have 90% of your project already coded by the community.

Bghiti n-compilliw had les resources f plan d'action concret — phase 1 wiring + first data read from the Kymco ECU?
