-- CreateTable
CREATE TABLE "ForumReminder" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "courseId" INTEGER NOT NULL,
    "forumId" INTEGER NOT NULL,
    "sentAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "ForumReminder_userId_forumId_key" ON "ForumReminder"("userId", "forumId");
