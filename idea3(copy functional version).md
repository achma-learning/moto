The Gold Mine: Key Projects & Resources
Direct YouTube Video
DPF Monitor — Arduino + L9637D + K-Line (exactly the hardware stack we discussed)
https://www.youtube.com/watch?v=pMgqPjYh5is
Arduino Nano + L9637D chip reading live data from OBD-II K-Line pin. The device reads data in real time through the K-line using ISO 9141-2, connected with just 3 wires: +12V, ground, and K-line. No ELM interface required. GitHub This is the closest project to what you're building.
The Most Important GitHub Repos
1. muki01/OBD2_KLine_Library — This is your starting codebase
https://github.com/muki01/OBD2_KLine_Library
A lightweight Arduino-compatible library that enables direct communication with vehicles using K-Line (ISO 9141 / ISO 14230 - KWP2000), designed for Arduino, ESP32, and similar platforms. GitHub It has ready-to-use code to read RPM, coolant temp, and speed
