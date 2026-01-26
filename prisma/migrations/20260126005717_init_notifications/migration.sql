-- CreateTable
CREATE TABLE "ForumReminder" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "discussionId" INTEGER NOT NULL,
    "forumId" INTEGER NOT NULL,
    "notified" BOOLEAN NOT NULL DEFAULT false,
    "replied" BOOLEAN NOT NULL DEFAULT false,
    "lastChecked" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "ForumReminder_userId_discussionId_key" ON "ForumReminder"("userId", "discussionId");
