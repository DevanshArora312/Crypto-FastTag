#include "RFIDUtils.h"
#include <Arduino.h>

// Initialize RFID (SPI and MFRC522)
void setupRFID(MFRC522 &mfrc522) {
    SPI.begin();       // Start SPI bus
    mfrc522.PCD_Init(); // Init MFRC522
    Serial.println("RFID reader initialized.");
}

// Write 16 bytes to the RFID card at the given block address
bool writeToRFID(MFRC522 &mfrc522, byte blockAddr, byte *data) {
    if (!mfrc522.PICC_IsNewCardPresent() || !mfrc522.PICC_ReadCardSerial()) {
        return false;  // No card found
    }

    MFRC522::StatusCode status;

    // Authenticate with key A
    MFRC522::MIFARE_Key key;
    for (byte i = 0; i < 6; i++) key.keyByte[i] = 0xFF; // Default key

    status = mfrc522.PCD_Authenticate(MFRC522::PICC_CMD_MF_AUTH_KEY_A, blockAddr, &key, &(mfrc522.uid));
    if (status != MFRC522::STATUS_OK) {
        Serial.print("Auth failed: ");
        Serial.println(mfrc522.GetStatusCodeName(status));
        return false;
    }

    // Write data (16 bytes)
    status = mfrc522.MIFARE_Write(blockAddr, data, 16);
    if (status != MFRC522::STATUS_OK) {
        Serial.print("Write failed: ");
        Serial.println(mfrc522.GetStatusCodeName(status));
        return false;
    }

    Serial.println("Write successful.");
    mfrc522.PICC_HaltA();      // Stop reading
    mfrc522.PCD_StopCrypto1(); // Stop encryption on PCD
    return true;
}

// Read 16 bytes from the RFID card at the given block address
bool readFromRFID(MFRC522 &mfrc522, byte blockAddr, byte *buffer) {
    if (!mfrc522.PICC_IsNewCardPresent() || !mfrc522.PICC_ReadCardSerial()) {
        return false;  // No card found
    }

    MFRC522::StatusCode status;

    // Authenticate with key A
    MFRC522::MIFARE_Key key;
    for (byte i = 0; i < 6; i++) key.keyByte[i] = 0xFF; // Default key

    status = mfrc522.PCD_Authenticate(MFRC522::PICC_CMD_MF_AUTH_KEY_A, blockAddr, &key, &(mfrc522.uid));
    if (status != MFRC522::STATUS_OK) {
        Serial.print("Auth failed: ");
        Serial.println(mfrc522.GetStatusCodeName(status));
        return false;
    }

    byte size = 18;
    status = mfrc522.MIFARE_Read(blockAddr, buffer, &size);
    if (status != MFRC522::STATUS_OK) {
        Serial.print("Read failed: ");
        Serial.println(mfrc522.GetStatusCodeName(status));
        return false;
    }

    Serial.print("Read data: ");
    for (byte i = 0; i < 16; i++) {
        Serial.print(buffer[i], HEX);
        Serial.print(" ");
    }
    Serial.println();

    mfrc522.PICC_HaltA();      // Stop reading
    mfrc522.PCD_StopCrypto1(); // Stop encryption on PCD
    return true;
}
