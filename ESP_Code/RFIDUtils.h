#ifndef RFIDUTILS_H
#define RFIDUTILS_H

#include <MFRC522.h>

// Function prototypes
void setupRFID(MFRC522 &mfrc522);
bool writeToRFID(MFRC522 &mfrc522, byte blockAddr, byte *data);
bool readFromRFID(MFRC522 &mfrc522, byte blockAddr, byte *buffer);

#endif