# ⚡ ChargeGrid – EV Charging Station Route Planner

ChargeGrid is a React Native CLI mobile application built to help electric vehicle (EV) users log in and find the best route between locations with available EV charging stations. It supports login using local storage (`AsyncStorage`) and visualizes routes on a map using Google Maps integration.

---

## 📸 Screenshots

| Login Screen | Route Display | Station Locations |
|--------------|---------------|-------------------|
| ![Login](https://github.com/user-attachments/assets/89b2b72c-3b5e-4594-88d4-70c50288809f) | ![Route](https://github.com/user-attachments/assets/1e20914b-7153-47c3-ad15-392a1dc56dd3) | ![Stations](https://github.com/user-attachments/assets/5533f2ea-3d3b-4a9f-8c66-53737ff2a53c) |



> **Note:** You should save and rename your screenshots as shown above in an `assets/screenshots/` folder.

---

## 🚀 Features

- 🔐 **Login System** using `AsyncStorage` (local storage)
- 🗺️ **Map Integration** using `react-native-maps`
- 📍 **EV Station Locations** on map
- 🔄 **Route Planning** between two cities
- 🌍 Google Maps API integration
- 🎯 Lightweight UI & responsive design

---

## 📦 Tech Stack

- React Native CLI
- JavaScript
- AsyncStorage
- Google Maps API
- `react-native-maps`
- `react-native-geolocation-service`
- `react-native-geocoding`

---

## 🛠️ Installation & Setup

> Ensure you have **Node.js**, **React Native CLI**, **Android Studio**, and **Java JDK** installed.

```bash
# 1. Clone the project
git clone https://github.com/your-username/chargegrid.git
cd chargegrid

# 2. Install dependencies
npm install

# 3. Add your Google Maps API Key
#    In your code, replace the placeholder:
#    const apiKey = 'YOUR_GOOGLE_MAPS_API_KEY';

# 4. Link dependencies (only if needed)
npm react-native link

# 5. Start Metro Bundler
npm react-native start

# 6. Run on Android device/emulator
npm react-native run-android
