-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ShortLink" (
    "alias" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_ShortLink" ("alias", "count", "createdAt", "url") SELECT "alias", "count", "createdAt", "url" FROM "ShortLink";
DROP TABLE "ShortLink";
ALTER TABLE "new_ShortLink" RENAME TO "ShortLink";
CREATE UNIQUE INDEX "ShortLink_url_key" ON "ShortLink"("url");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
