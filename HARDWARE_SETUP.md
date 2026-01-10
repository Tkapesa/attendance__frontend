# ESP32 Fingerprint Sensor Hardware Setup Guide

Complete guide to connect and configure the ESP32 with Adafruit fingerprint sensor for the attendance system.

---

## 📦 Required Hardware

### Components Needed:
1. **ESP32 Development Board**
   - ESP32-WROOM-32 or ESP32-DevKitC
   - ~$5-10 on Amazon/AliExpress

2. **Adafruit Fingerprint Sensor**
   - Model: R307 or R305
   - ~$40-50 on Adafruit/Amazon
   - Product link: https://www.adafruit.com/product/751

3. **Jumper Wires**
   - Female-to-Female wires (at least 4)
   - Dupont cables recommended

4. **USB Cable**
   - Micro-USB or USB-C (depending on ESP32 model)
   - For programming and power

5. **Power Supply** (Optional)
   - 5V adapter for standalone operation
   - USB power bank works too

---

## 🔌 Hardware Connections

### Fingerprint Sensor Pinout
```
┌─────────────────┐
│  Fingerprint    │
│    Sensor       │
│  ┌─────────┐   │
│  │         │   │
│  └─────────┘   │
└─────────────────┘
  │  │  │  │  │  │
  │  │  │  │  │  │
 RED BLK WHT GRN YEL BLU
  │  │  │  │  │  │
  5V GND TX  RX  -- --
```

### Wire Connections Table

| Fingerprint Pin | Wire Color | ESP32 Pin | Description |
|----------------|------------|-----------|-------------|
| VCC (Red)      | Red        | 5V        | Power supply |
| GND (Black)    | Black      | GND       | Ground |
| TX (White)     | White      | GPIO16 (RX2) | Transmit data |
| RX (Green)     | Green      | GPIO17 (TX2) | Receive data |
| WAKE (Yellow)  | -          | Not connected | Optional |
| VTOUCH (Blue)  | -          | Not connected | Optional |

### Visual Wiring Diagram
```
ESP32                    Fingerprint Sensor
┌────────────┐          ┌─────────────────┐
│            │          │                 │
│     5V ●───┼──────────┼─● VCC (Red)    │
│            │          │                 │
│    GND ●───┼──────────┼─● GND (Black)  │
│            │          │                 │
│ GPIO16 ●───┼──────────┼─● TX  (White)  │
│  (RX2)     │          │                 │
│            │          │                 │
│ GPIO17 ●───┼──────────┼─● RX  (Green)  │
│  (TX2)     │          │                 │
│            │          │                 │
│    USB ●   │          └─────────────────┘
│            │
└────────────┘
```

### Important Notes:
⚠️ **TX connects to RX, RX connects to TX** (crossover)
- Sensor TX → ESP32 RX (GPIO16)
- Sensor RX → ESP32 TX (GPIO17)

⚠️ **Power**: Sensor requires 5V, but data lines are 3.3V compatible
⚠️ **Don't reverse power connections** - will damage sensor

---

## 💻 Software Setup

### Step 1: Install Arduino IDE

1. **Download Arduino IDE**
   - Visit: https://www.arduino.cc/en/software
   - Download version 2.0+ for macOS
   - Install the application

2. **Install ESP32 Board Support**
   - Open Arduino IDE
   - Go to **Arduino IDE** → **Preferences**
   - In "Additional Board Manager URLs" add:
     ```
     https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
     ```
   - Click **OK**
   - Go to **Tools** → **Board** → **Boards Manager**
   - Search for "esp32"
   - Install **"esp32 by Espressif Systems"**
   - Wait for installation to complete

3. **Select ESP32 Board**
   - Go to **Tools** → **Board** → **ESP32 Arduino**
   - Select your board (e.g., "ESP32 Dev Module")

### Step 2: Install Required Libraries

1. **Adafruit Fingerprint Library**
   - Go to **Sketch** → **Include Library** → **Manage Libraries**
   - Search for "Adafruit Fingerprint Sensor Library"
   - Click **Install**
   - Install all dependencies if prompted

2. **WiFi & HTTP Libraries**
   - These come pre-installed with ESP32 board support
   - No additional installation needed

### Step 3: Get Backend Server IP Address

1. **Find Your Mac's Local IP**
   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   ```
   Look for IP like: `192.168.1.100` or `10.0.0.5`

2. **Verify Backend is Running**
   ```bash
   cd "/Users/user/attendance_frontend /backend"
   source .venv/bin/activate
   python manage.py runserver 0.0.0.0:8000
   ```
   Note: Using `0.0.0.0` allows network access

3. **Test from ESP32 Network**
   ```bash
   curl http://YOUR_MAC_IP:8000/health/
   ```

---

## 📝 Arduino Code

### Complete ESP32 Sketch

Create new sketch in Arduino IDE and paste this code:

```cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <Adafruit_Fingerprint.h>

// ============================================
// CONFIGURATION - UPDATE THESE VALUES
// ============================================

// WiFi credentials
const char* ssid = "YOUR_WIFI_SSID";           // Replace with your WiFi name
const char* password = "YOUR_WIFI_PASSWORD";   // Replace with your WiFi password

// Backend server URL (use your Mac's local IP)
const char* serverURL = "http://192.168.1.100:8000/attendance/check-in/";

// Device identification
const char* deviceID = "ESP32-001";            // Unique ID for this device

// ============================================
// HARDWARE SETUP
// ============================================

// Initialize fingerprint sensor on Serial2
HardwareSerial mySerial(2); // Use UART2
Adafruit_Fingerprint finger = Adafruit_Fingerprint(&mySerial);

// ============================================
// SETUP
// ============================================

void setup() {
  // Initialize Serial Monitor
  Serial.begin(115200);
  delay(1000);
  Serial.println("\n\n=================================");
  Serial.println("ESP32 Attendance System Starting");
  Serial.println("=================================\n");

  // Initialize fingerprint sensor
  Serial.println("Initializing fingerprint sensor...");
  mySerial.begin(57600, SERIAL_8N1, 16, 17); // RX=16, TX=17
  
  if (finger.verifyPassword()) {
    Serial.println("✓ Fingerprint sensor found!");
  } else {
    Serial.println("✗ Fingerprint sensor not found!");
    Serial.println("Check wiring:");
    Serial.println("  - Sensor TX → ESP32 GPIO16");
    Serial.println("  - Sensor RX → ESP32 GPIO17");
    Serial.println("  - 5V and GND connected");
    while (1) { delay(1000); }
  }

  // Get sensor parameters
  Serial.print("Sensor contains "); 
  Serial.print(finger.templateCount); 
  Serial.println(" templates");
  
  // Connect to WiFi
  Serial.println("\nConnecting to WiFi...");
  WiFi.begin(ssid, password);
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n✓ WiFi connected!");
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());
    Serial.print("Server URL: ");
    Serial.println(serverURL);
  } else {
    Serial.println("\n✗ WiFi connection failed!");
    Serial.println("Check your WiFi credentials in the code");
  }
  
  Serial.println("\n=================================");
  Serial.println("Ready! Waiting for fingerprint...");
  Serial.println("=================================\n");
}

// ============================================
// MAIN LOOP
// ============================================

void loop() {
  // Check WiFi connection
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi disconnected! Reconnecting...");
    WiFi.reconnect();
    delay(5000);
    return;
  }

  // Wait for finger detection
  int result = finger.getImage();
  
  if (result == FINGERPRINT_NOFINGER) {
    // No finger detected, wait
    delay(50);
    return;
  }
  
  if (result != FINGERPRINT_OK) {
    Serial.println("Error reading fingerprint");
    delay(1000);
    return;
  }

  Serial.println("👆 Fingerprint detected! Processing...");

  // Convert image to template
  result = finger.image2Tz();
  if (result != FINGERPRINT_OK) {
    Serial.println("Error converting image");
    delay(2000);
    return;
  }

  // Search for matching fingerprint
  result = finger.fingerFastSearch();
  
  if (result == FINGERPRINT_OK) {
    // Match found!
    int fingerprintID = finger.fingerID;
    int confidence = finger.confidence;
    
    Serial.println("✓ Match found!");
    Serial.print("  Fingerprint ID: ");
    Serial.println(fingerprintID);
    Serial.print("  Confidence: ");
    Serial.println(confidence);
    
    // Send to backend server
    sendAttendance(fingerprintID);
    
  } else if (result == FINGERPRINT_NOTFOUND) {
    Serial.println("✗ Fingerprint not recognized");
    Serial.println("  Please enroll this fingerprint first");
  } else {
    Serial.println("Error searching fingerprint database");
  }
  
  // Wait before next scan
  delay(3000);
  Serial.println("\nReady for next scan...\n");
}

// ============================================
// SEND ATTENDANCE TO BACKEND
// ============================================

void sendAttendance(int fingerprintID) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("✗ Cannot send - WiFi not connected");
    return;
  }

  HTTPClient http;
  http.begin(serverURL);
  http.addHeader("Content-Type", "application/json");
  
  // Create JSON payload
  String payload = "{\"fingerprint_id\":" + String(fingerprintID) + 
                   ",\"device_id\":\"" + String(deviceID) + "\"}";
  
  Serial.println("Sending to backend...");
  Serial.print("  Payload: ");
  Serial.println(payload);
  
  // Send POST request
  int httpCode = http.POST(payload);
  
  if (httpCode > 0) {
    String response = http.getString();
    Serial.print("  Response code: ");
    Serial.println(httpCode);
    Serial.print("  Response: ");
    Serial.println(response);
    
    if (httpCode == 200) {
      Serial.println("✓ Attendance recorded successfully!");
    } else {
      Serial.println("✗ Server returned error");
    }
  } else {
    Serial.print("✗ HTTP request failed: ");
    Serial.println(http.errorToString(httpCode));
    Serial.println("  Check:");
    Serial.println("  - Backend server is running");
    Serial.println("  - Server URL is correct");
    Serial.println("  - Firewall allows connection");
  }
  
  http.end();
}
```

### Step 4: Configure the Code

Update these lines in the sketch:

```cpp
// Line 11-12: Your WiFi credentials
const char* ssid = "YourWiFiName";
const char* password = "YourWiFiPassword";

// Line 15: Your Mac's IP address (from ifconfig)
const char* serverURL = "http://192.168.1.100:8000/attendance/check-in/";

// Line 18: Optional device ID
const char* deviceID = "ESP32-001";
```

---

## 📤 Upload to ESP32

### Step 1: Connect ESP32

1. Connect ESP32 to Mac via USB cable
2. Wait for driver installation (first time only)

### Step 2: Select Port

1. In Arduino IDE, go to **Tools** → **Port**
2. Select port like: `/dev/cu.usbserial-0001` or `/dev/cu.SLAB_USBtoUART`
3. If no port appears:
   - Check USB cable (must be data cable, not charge-only)
   - Install CH340/CP2102 drivers if needed

### Step 3: Upload Code

1. Click **Upload** button (→ arrow) or press **Cmd+U**
2. Wait for compilation (~30 seconds)
3. Look for "Connecting..." message
4. ESP32 will automatically enter upload mode
5. Wait for "Hard resetting via RTS pin..."
6. Upload complete! ✅

### Step 4: Open Serial Monitor

1. Go to **Tools** → **Serial Monitor** or press **Cmd+Shift+M**
2. Set baud rate to **115200**
3. You should see:
   ```
   =================================
   ESP32 Attendance System Starting
   =================================
   
   ✓ Fingerprint sensor found!
   ✓ WiFi connected!
   Ready! Waiting for fingerprint...
   ```

---

## 🖐️ Enroll Fingerprints

### Option 1: Using Adafruit Example Sketch

1. Go to **File** → **Examples** → **Adafruit Fingerprint Sensor Library** → **enroll**
2. Upload the enroll sketch
3. Open Serial Monitor (115200 baud)
4. Follow prompts to enroll fingerprints
5. Note the fingerprint ID numbers (e.g., 1, 2, 3...)

### Option 2: Manual Enrollment Steps

1. Type finger ID number in Serial Monitor (1-127)
2. Place finger on sensor when prompted
3. Remove finger
4. Place same finger again
5. Fingerprint saved!

### Link Fingerprints to Students

After enrolling, register in backend:

```bash
curl -X POST http://localhost:8000/users/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "uid": "S001",
    "name": "John Doe",
    "fingerprint_id": 1,
    "role": "student"
  }'
```

**Important**: Match fingerprint_id in enrollment with registration!

---

## ✅ Testing the System

### Test 1: Check WiFi Connection
```
Expected output in Serial Monitor:
✓ WiFi connected!
IP address: 192.168.1.150
```

### Test 2: Check Backend Connection
```
Expected output when scanning:
👆 Fingerprint detected! Processing...
✓ Match found!
  Fingerprint ID: 1
  Confidence: 180
Sending to backend...
  Response code: 200
✓ Attendance recorded successfully!
```

### Test 3: Verify in Backend
```bash
curl http://localhost:8000/attendance/today/
```
Should show today's attendance records.

---

## 🐛 Troubleshooting

### Sensor Not Found
**Symptoms**: "Fingerprint sensor not found!"
**Solutions**:
- Check wiring: TX↔RX, RX↔TX (crossover)
- Verify 5V power connected
- Try different GPIO pins (update code)
- Test sensor LED lights up

### WiFi Won't Connect
**Symptoms**: Stuck on "Connecting to WiFi..."
**Solutions**:
- Verify WiFi credentials (case-sensitive)
- Check 2.4GHz WiFi (ESP32 doesn't support 5GHz)
- Move ESP32 closer to router
- Check WiFi allows new device connections

### HTTP Request Failed
**Symptoms**: "HTTP request failed: -1"
**Solutions**:
- Verify backend is running: `curl http://YOUR_IP:8000/health/`
- Check firewall allows port 8000
- Use Mac's local IP, not 127.0.0.1
- Ensure Mac and ESP32 on same network

### Fingerprint Not Recognized
**Symptoms**: "Fingerprint not recognized"
**Solutions**:
- Re-enroll fingerprint with better quality
- Clean sensor surface
- Place finger firmly on sensor
- Try different finger angle
- Check finger isn't too dry/wet

### Upload Failed
**Symptoms**: "Failed to connect to ESP32"
**Solutions**:
- Hold BOOT button during upload
- Try different USB cable
- Install USB drivers (CH340/CP2102)
- Reset ESP32 and retry

---

## 🔋 Power Options

### USB Power (Development)
- Connect via USB cable
- Easiest for testing
- Can use power bank

### 5V Adapter (Production)
- Use 5V 2A adapter
- Connect to VIN and GND pins
- More stable for permanent installation

### Battery Power
- Use 3.7V LiPo battery with voltage regulator
- ESP32 dev boards usually have built-in regulator
- Add charging circuit for rechargeable setup

---

## 📏 Mounting the Hardware

### Enclosure Options

1. **3D Printed Case**
   - Design with cutout for sensor
   - Mount on wall or desk stand
   - Thingiverse has free designs

2. **Project Box**
   - Buy plastic project box from electronics store
   - Drill hole for sensor
   - Professional appearance

3. **Cardboard Prototype**
   - Quick testing setup
   - Tape components to cardboard
   - Easy to modify

### Installation Tips
- Mount at chest height (~120-150cm)
- Good lighting for sensor
- Stable surface (no wobbling)
- Protected from rain/weather
- Near power outlet

---

## 🎯 Next Steps

After hardware setup:

1. ✅ Test individual fingerprint scans
2. ✅ Enroll all students (5-10 per sensor recommended)
3. ✅ Test attendance recording in backend
4. ✅ Verify data appears in dashboard
5. ✅ Set up permanent mounting location
6. ✅ Create backup power solution
7. ✅ Train users on proper finger placement

---

## 📚 Additional Resources

- **Adafruit Sensor Guide**: https://learn.adafruit.com/adafruit-optical-fingerprint-sensor
- **ESP32 Documentation**: https://docs.espressif.com/projects/esp-idf/
- **Arduino ESP32**: https://github.com/espressif/arduino-esp32
- **Project GitHub**: https://github.com/Tkapesa/attendance__frontend

---

**Congratulations! Your hardware is now ready!** 🎉

For software setup and Firebase configuration, see:
- `FIREBASE_SETUP.md` - Firebase configuration
- `FULL_STACK_SETUP.md` - Complete system setup
- `backend/API_DOCUMENTATION.md` - API reference
