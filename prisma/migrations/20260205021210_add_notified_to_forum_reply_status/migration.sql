-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ForumReplyStatus" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "courseId" INTEGER NOT NULL,
    "forumId" INTEGER NOT NULL,
    "discussionId" INTEGER NOT NULL,
    "replied" BOOLEAN NOT NULL DEFAULT false,
    "repliedAt" DATETIME,
    "notified" BOOLEAN NOT NULL DEFAULT false,
    "notifiedAt" DATETIME
);
INSERT INTO "new_ForumReplyStatus" ("courseId", "discussionId", "forumId", "id", "replied", "repliedAt", "userId") SELECT "courseId", "discussionId", "forumId", "id", "replied", "repliedAt", "userId" FROM "ForumReplyStatus";
DROP TABLE "ForumReplyStatus";
ALTER TABLE "new_ForumReplyStatus" RENAME TO "ForumReplyStatus";
CREATE UNIQUE INDEX "ForumReplyStatus_userId_discussionId_key" ON "ForumReplyStatus"("userId", "discussionId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
