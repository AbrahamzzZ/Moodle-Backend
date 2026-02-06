-- CreateTable
CREATE TABLE "ForumReplyStatus" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "courseId" INTEGER NOT NULL,
    "forumId" INTEGER NOT NULL,
    "discussionId" INTEGER NOT NULL,
    "replied" BOOLEAN NOT NULL DEFAULT false,
    "repliedAt" DATETIME
);

-- CreateIndex
CREATE UNIQUE INDEX "ForumReplyStatus_userId_discussionId_key" ON "ForumReplyStatus"("userId", "discussionId");
