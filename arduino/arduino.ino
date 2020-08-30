#include <SoftwareSerial.h>     
#include <Adafruit_Sensor.h>
#include <DHT.h>            

#define DHTPIN 5
#define DHTTYPE DHT11 

#define SSID "wifi name"
#define PASS "wifi password"
#define IP "server address"
#define PORT "5001" 

// Each hour = 3600000
#define DELAY 360000
    
SoftwareSerial espSerial =  SoftwareSerial(2,3);   // arduino RX pin=2  arduino TX pin=3
DHT dht = DHT(DHTPIN, DHTTYPE);

const char* correct_status = "OK";
const char* wrong_status = "Error";

unsigned long lastTimeMillis = 0;

void setup() {
  // Setup interfaces
  dht.begin();
  Serial.begin(74880);
  espSerial.begin(115200);
  delay(2000);

  // Connect to Wifi
  boolean OK_found = false;
  while(not OK_found){
    espSerial.println("AT");
    delay(1000);
    boolean wifiConnected = false;
    if(espSerial.find(*correct_status)){
      OK_found = true;
      do{
        wifiConnected = connectWiFi();
      }while(not wifiConnected);
      Serial.println("Wifi Connected");
      Serial.println("----------");
      return;
    }
    Serial.println("Didn't get OK at AT command. Next attempt in 60 seconds.");
    delay(60000);
  }  
}

void loop() {
  // Repeat every DELAY seconds
  if (millis() - lastTimeMillis > DELAY) {
    lastTimeMillis = millis();
    
    float h = dht.readHumidity();
    float t = dht.readTemperature();
    
    if (isnan(h)){
      Serial.println("Failed to read humidity from DHT sensor!");
    } 
    else if (isnan(t)){
      Serial.println("Failed to read temperature from DHT sensor!");
    }
    
    // Print humidity and temeperature values to Serial
    Serial.print("Data got from DHT sensor: ");
    Serial.print("humidity: ");
    Serial.print(h);
    Serial.print(" %, ");
    Serial.print("temperature: ");
    Serial.print(t);
    Serial.print(" \xC2\xB0");
    Serial.println("C");    

    // Send data as GET request to IP:PORT
    String cmd = "AT+CIPMUX=1";
    espSerial.println(cmd);
    delay(1000);
    
    cmd = "AT+CIPSTART=4,\"TCP\",\"";
    cmd += IP;
    cmd += "\",";
    cmd += PORT;
    espSerial.println(cmd);
    delay(1000);

    cmd = "GET /api/update?";
    cmd = "humidity=";
    cmd += String(h);
    cmd += "&temperature=";
    cmd += String(t);
    espSerial.println("AT+CIPSEND=4," + String(cmd.length() + 4));
    delay(1000);

    espSerial.println(cmd);
    delay(1000);
    espSerial.println(""); 

    // Print status to user
    Serial.print("Data was send to server ");
    Serial.print(IP);
    Serial.print(":");
    Serial.println(PORT);
    Serial.println("----------");
  }
}

boolean connectWiFi(){
  // Connect to Wifi network with SSID and PASS credentials
  espSerial.println("AT+CWMODE=1");
  delay(2000);
  String cmd="AT+CWJAP=\"";
  cmd+=SSID;
  cmd+="\",\"";
  cmd+=PASS;
  cmd+="\"";
  espSerial.println(cmd);
  delay(5000);
  if(espSerial.find(*correct_status)){
    return true;
  } else{
    return false;
  }
  return false;
}