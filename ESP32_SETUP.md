# ESP32 Fingerprint Reader - Quick Setup Guide

## ✅ Backend Status: READY FOR FINGERPRINT READER

Your backend is running and will accept ESP32 POST requests!

## 🔥 Firebase Setup (Required)

### Option 1: Use Firebase Emulator (Testing Without Real Firebase)
```bash
# Install Firebase tools
npm install -g firebase-tools

# Start Firestore emulator
firebase emulators:start --only firestore
```

### Option 2: Use Real Firebase (Production)
1. Go to https://console.firebase.google.com
2. Select your project → Settings (⚙️) → Service Accounts
3. Click "Generate new private key"
4. Save the downloaded JSON file as:
   ```
   /Users/user/attendance_frontend /backend/firebase-credentials.json
   ```

## 📡 ESP32 Arduino Code

```cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <Adafruit_Fingerprint.h>

// WiFi credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// Backend server (change to your computer's local IP)
const char* serverURL = "http://192.168.1.XXX:8000/attendance/check-in/";

HardwareSerial mySerial(2); // Use Serial2 for fingerprint sensor
Adafruit_Fingerprint finger = Adafruit_Fingerprint(&mySerial);

void setup() {
  Serial.begin(115200);
  mySerial.begin(57600, SERIAL_8N1, 16, 17); // RX=16, TX=17
  
  // Connect to WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi Connected!");
  
  // Initialize fingerprint sensor
  if (finger.verifyPassword()) {
    Serial.println("Fingerprint sensor connected!");
  } else {
    Serial.println("Fingerprint sensor not found!");
    while (1) { delay(1); }
  }
}

void loop() {
  uint8_t result = finger.getImage();
  if (result != FINGERPRINT_OK) return;
  
  result = finger.image2Tz();
  if (result != FINGERPRINT_OK) return;
  
  result = finger.fingerFastSearch();
  if (result == FINGERPRINT_OK) {
    int fingerprintID = finger.fingerID;
    Serial.printf("Found fingerprint ID: %d\n", fingerprintID);
    
    // Send to backend
    sendAttendance(fingerprintID);
  }
  
  delay(1000); // Wait before next scan
}

void sendAttendance(int fingerprintID) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverURL);
    http.addHeader("Content-Type", "application/json");
    
    String payload = "{\"fingerprint_id\":" + String(fingerprintID) + 
                     ",\"device_id\":\"esp32-reader-01\"}";
    
    int httpCode = http.POST(payload);
    
    if (httpCode > 0) {
      String response = http.getString();
      Serial.println("Response: " + response);
      
      // Parse response
      if (response.indexOf("\"status\":\"success\"") > 0) {
        Serial.println("✅ Attendance recorded!");
        // TODO: Add buzzer beep or LED blink
      } else {
        Serial.println("❌ Error recording attendance");
      }
    } else {
      Serial.printf("Error: %s\n", http.errorToString(httpCode).c_str());
    }
    
    http.end();
  }
}
```

## 🧪 Test Without Hardware

```bash
# Simulate ESP32 fingerprint scan:
curl -X POST http://127.0.0.1:8000/attendance/check-in/ \
  -H 'Content-Type: application/json' \
  -d '{"fingerprint_id":1234,"device_id":"esp32-test"}'

# Expected response (without Firebase):
# {"status":"error","message":"Firebase credentials not found..."}

# Expected response (with Firebase + enrolled user):
# {"status":"success","message":"Attendance recorded for John Doe","user_name":"John Doe"}
```

## 🎯 Next Steps

1. **Add Firebase credentials** (see above)
2. **Find your computer's IP**:
   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   ```
3. **Update ESP32 code** with your IP address
4. **Upload to ESP32** and test fingerprint scanning!

## 📊 Frontend Dashboard

Open http://127.0.0.1:5173/ to see live attendance updates!
