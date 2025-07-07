-- CreateTable
CREATE TABLE "ShortLink" (
    "alias" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "ShortLink_url_key" ON "ShortLink"("url");
