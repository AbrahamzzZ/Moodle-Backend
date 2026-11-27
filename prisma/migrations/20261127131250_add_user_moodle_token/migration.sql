-- CreateTable
CREATE TABLE "UserMoodleToken" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "UserMoodleToken_userId_key" ON "UserMoodleToken"("userId");
