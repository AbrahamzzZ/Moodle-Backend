-- CreateTable
CREATE TABLE "UserPushToken" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "pushToken" TEXT NOT NULL,
    "platform" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "UserPushToken_userId_key" ON "UserPushToken"("userId");
