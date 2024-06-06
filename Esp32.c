#include <Arduino.h>
#include <FlowSensor.h> 

#include <IOXhop_FirebaseESP32.h>
#include <WiFi.h>
#include <ArduinoJson.h>

#define WIFI_SSID "lab-inovacao"
#define WIFI_PASSWORD "inovacao@sme1505"
#define FIREBASE_HOST "https://projeto-iot-a8adb-default-rtdb.firebaseio.com/"
#define FIREBASE_AUTH "bkYHAoHNjEKEaemdg9LBTNGrKJ0TMCzOZmts0u6b"

#define type YFS201           // Modelo do sensor
#define pin 5                 // Pino do sensor de vasão
const int PIN_BUTTON = 2;     // Define o pino do botão
const float led = 13;

FlowSensor Sensor(type, pin); // Instanciando um objeto(sensor) do tipo FlowSensor nossa biblioteca;
unsigned long timebefore = 0; // Same type as millis()
unsigned long reset = 0;      // Valor do resete para sempre voltar ao 0.

void IRAM_ATTR count() {      // Criação da função para armazenar na IRAM do dispositivo, no nosso caso um contador.
  Sensor.count();
}

void setup() {

  Serial.begin(115200);
  Serial.println();

  pinMode(led, OUTPUT);
  digitalWrite(led, 0);
  Sensor.begin(count);
  pinMode(PIN_BUTTON, INPUT);

  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  Serial.print("Conectando ao wifi");

  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(300);
  }

  Serial.println();
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);

}

void loop() {
  // Essa condição tem uma função millis() que conta os millisegundo que codigo foi iniciado. Então ele é comparado com 1000 que representa um segundo em millisegundos.
  if (millis() - timebefore >= 1000) {
    Sensor.read();                            // Chamada para um método de leitura definido pela biblioteca
    Serial.print("Flow rate (L/minute) : ");
    Serial.println(Sensor.getFlowRate_m());   // Sensor.getFlowRate_m definido pela biblioteca para calcular litros por minuto (L/min), litros por segundo (L/s)
    Serial.print("Volume (L) : ");
    Serial.println(Sensor.getVolume());       // Sensor.getVolume definido pela biblioteca para calcular litros por minuto (L/min), litros por segundo (L/s)
    timebefore = millis();
  }

  // Reset Volume na hora da troca do garrafão. Só reseta se precionar o botão.
  int buttonState = digitalRead(PIN_BUTTON);

  if (buttonState == HIGH) {
    Sensor.resetVolume();
    reset = millis();
  }

  Firebase.setString("/bebedouro1/nome", "Garrafão 01"); // Envia o nome do garrafão para o firebase
  Firebase.setInt("/bebedouro1/vazao", Sensor.getFlowRate_m()); // Envia a vazão para o firebase

  //Alterações
  Firebase.setInt("/bebedouro1/volume", Sensor.getVolume()); // Envia o volume para o firebase
  // Envia o status do botão para o firebase

  delay(3000);

}
