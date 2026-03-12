-- CreateTable
CREATE TABLE "Participant" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "phone" TEXT
);

-- CreateTable
CREATE TABLE "Ride" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "driverId" INTEGER NOT NULL,
    CONSTRAINT "Ride_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Participant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RidePassenger" (
    "rideId" INTEGER NOT NULL,
    "passengerId" INTEGER NOT NULL,

    PRIMARY KEY ("rideId", "passengerId"),
    CONSTRAINT "RidePassenger_rideId_fkey" FOREIGN KEY ("rideId") REFERENCES "Ride" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RidePassenger_passengerId_fkey" FOREIGN KEY ("passengerId") REFERENCES "Participant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
