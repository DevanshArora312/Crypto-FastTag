#include <SPI.h>
// #include <MFRC522.h>      // RFID library
#include <WiFi.h>         // ESP32: <WiFi.h>, ESP8266: <ESP8266WiFi.h>
#include <HTTPClient.h>   // ESP32: <HTTPClient.h>, ESP8266: <ESP8266HTTPClient.h>
// #include "RFIDUtils.h"
#include <WiFiClientSecure.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <ArduinoJson.h>

const char* Dssid = "narzo 50A";
const char* Dpassword = "pass@123";

const char* Assid = "Redmi 12 5G";
const char* Apassword = "ARYAN:))";

const char* ssid = Dssid;
const char* password = Dpassword;


const char* serverUrl = "https://0bbd-14-139-226-237.ngrok-free.app/makePayment"; 

// RFID Pins
// #define SS_PIN 5    // ESP32: GPIO5, ESP8266: D1
// #define RST_PIN 27  // ESP32: GPIO27, ESP8266: D2 (use any unused pin)
// MFRC522 mfrc522(SS_PIN, RST_PIN); // Create RFID instance

WiFiClientSecure client;
int requestCount = 0;      
// OLED Display Settings
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET    -1
#define SCREEN_ADDRESS 0x3C  // Change if needed (use I2C scanner)

// Create OLED display object
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);


void setup() {
  Serial.begin(115200);
  Wire.begin(17, 16);  // SDA, SCL (for ESP32)
  
  if (!display.begin(SSD1306_SWITCHCAPVCC, SCREEN_ADDRESS)) {
    Serial.println("❌ OLED initialization failed!");
    while (true);
  }
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(WHITE);
  display.display();

  // Show "Connecting" message
  updateDisplay("Connecting to WiFi...", 0,"");

  // Connect to WiFi
  WiFi.begin(ssid, password);
  Serial.print("🔄 Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\n✅ Connected to WiFi!");
  Serial.print("🌐 IP Address: ");
  Serial.println(WiFi.localIP());

  updateDisplay("WiFi Connected!", 0,"");
  delay(2000);

  client.setInsecure(); 
  // Serial.println("\nInitializing RFID Reader...");
  // SPI.begin();
  // mfrc522.PCD_Init();
  // Serial.println("RFID Reader Initialized.");
}



void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    sendToServer();
  } else {
    Serial.println("⚠️ WiFi Disconnected! Trying to reconnect...");
    updateDisplay("WiFi Reconnecting...", 0,"");
    WiFi.reconnect();
  }
  if (Serial.available()) {
        String command = Serial.readStringUntil('\n');
        command.trim();
        if (command == "STOP") {
            shutdownOLED();
            while(true);
        }
  }
  delay(15000);
  // Check for new RFID card
  // if (mfrc522.PICC_IsNewCardPresent() && mfrc522.PICC_ReadCardSerial()) {
  //   Serial.print("Scanned");
  //   String uid = "";
  //   for (byte i = 0; i < mfrc522.uid.size; i++) {
  //     uid += String(mfrc522.uid.uidByte[i] < 0x10 ? "0" : "");
  //     uid += String(mfrc522.uid.uidByte[i], HEX);
  //   }
  //   uid.toUpperCase();
  //   Serial.println("Card UID: " + uid);

  //   // Send UID to your API
  //   sendToServer(uid);

  //   // Halt the card to avoid multiple reads
  //   mfrc522.PICC_HaltA();
  //   delay(1000); // Add a small delay to prevent rapid scans
  // }
}
void sendToServer() {
  HTTPClient http;
  Serial.println("📡 Sending HTTP GET Request...");

  http.begin(client, serverUrl);
  http.addHeader("Content-Type", "application/json");
  http.setTimeout(15000);
  String payload = "{\"fastag\":\"MAT626359MKA03673\",\"toll\":\"TOLL_ID\",\"amount\":1}";
  int httpResponseCode = http.POST(payload);

 if (httpResponseCode > 0) {
    Serial.printf("✅ HTTP Response Code: %d\n", httpResponseCode);
    String response = http.getString();
    Serial.println("📩 Response: " + response);

    // Extract the response message (assuming JSON format)
    String responseMessage = parseResponseMessage(response);

    requestCount++;
    updateDisplay("HTTP Success!", requestCount, responseMessage);
  } else {
    Serial.printf("❌ HTTP Request Failed: %s\n", http.errorToString(httpResponseCode).c_str());
    updateDisplay("HTTP Failed!", requestCount, "No response");
  }

  http.end();
}

// Function to update OLED display with response message
void updateDisplay(String message, int count, String responseMsg) {
  display.clearDisplay();
  display.setCursor(0, 10);
  display.setTextSize(1);
  display.print(message);

  display.setCursor(0, 30);
  display.print("Requests: ");
  display.print(count);

  display.setCursor(0, 50);
  display.print("Resp: ");
  display.print(responseMsg);  // Show response message

  display.display();
}
  
  
void shutdownOLED() {
    Serial.println("🔴 Stopping Execution...");
    
    display.clearDisplay();
    display.setTextSize(1);
    display.setCursor(0, 20);
    display.println("Shutting down...");
    display.display();
    delay(2000);  // Show message briefly
    
    display.clearDisplay();
    display.display();
    Serial.println("✅ OLED Disconnected!");

    // esp_deep_sleep_start(); // Optional: Put ESP32 in deep sleep mode
}

// Function to extract "message" field from JSON response
String parseResponseMessage(String response) {
  StaticJsonDocument<200> doc;
  DeserializationError error = deserializeJson(doc, response);
  
  if (error) {
    Serial.print("❌ JSON Parsing Error: ");
    Serial.println(error.f_str());
    return "Parse Error";
  }

  if (doc.containsKey("carNo")) {
    return String(doc["carNo"].as<const char*>());
  }

  return "No message";
}