CREATE TABLE "GoogleDriveEvidence" (
  "id" TEXT NOT NULL,
  "memberId" TEXT NOT NULL,
  "fileId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "url" TEXT,
  "mimeType" TEXT,
  "sourceType" TEXT NOT NULL DEFAULT 'drive',
  "matchedBy" TEXT NOT NULL,
  "matchConfidence" TEXT,
  "projectName" TEXT,
  "role" TEXT,
  "contentExcerpt" TEXT,
  "summary" TEXT,
  "occurredAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "GoogleDriveEvidence_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "GoogleDriveEvidence_memberId_fileId_key" ON "GoogleDriveEvidence"("memberId", "fileId");
CREATE INDEX "GoogleDriveEvidence_memberId_createdAt_idx" ON "GoogleDriveEvidence"("memberId", "createdAt");
CREATE INDEX "GoogleDriveEvidence_fileId_idx" ON "GoogleDriveEvidence"("fileId");

ALTER TABLE "GoogleDriveEvidence"
  ADD CONSTRAINT "GoogleDriveEvidence_memberId_fkey"
  FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;
