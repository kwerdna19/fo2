-- CreateTable
CREATE TABLE "Mob" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "desc" TEXT,
    "level" INTEGER NOT NULL,
    "health" INTEGER NOT NULL,
    "goldMin" INTEGER NOT NULL,
    "goldMax" INTEGER NOT NULL,
    "spriteUrl" TEXT NOT NULL,
    "boss" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "Loot" (
    "mobId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "dropRate" DECIMAL,

    PRIMARY KEY ("mobId", "itemId"),
    CONSTRAINT "Loot_mobId_fkey" FOREIGN KEY ("mobId") REFERENCES "Mob" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Loot_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Item" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "desc" TEXT,
    "spriteUrl" TEXT NOT NULL,
    "slot" TEXT,
    "levelReq" INTEGER,
    "consumable" BOOLEAN NOT NULL DEFAULT false,
    "sellPrice" INTEGER
);

-- CreateIndex
CREATE UNIQUE INDEX "Mob_name_key" ON "Mob"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Item_name_key" ON "Item"("name");
