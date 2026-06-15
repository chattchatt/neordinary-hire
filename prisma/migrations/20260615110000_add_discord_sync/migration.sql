-- Add Discord identity and activity sync fields for Ne(o)rdinary Hire.
ALTER TABLE "Member"
  ADD COLUMN "hireLinkCode" TEXT,
  ADD COLUMN "discordUserId" TEXT,
  ADD COLUMN "discordUsername" TEXT,
  ADD COLUMN "discordDisplayName" TEXT,
  ADD COLUMN "discordNickname" TEXT,
  ADD COLUMN "discordRoles" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "discordJoinedAt" TIMESTAMP(3),
  ADD COLUMN "lastDiscordActiveAt" TIMESTAMP(3),
  ADD COLUMN "discordActivitySummary" TEXT,
  ADD COLUMN "discordLinkedAt" TIMESTAMP(3),
  ADD COLUMN "activityConsentAt" TIMESTAMP(3);

CREATE UNIQUE INDEX "Member_hireLinkCode_key" ON "Member"("hireLinkCode");
CREATE UNIQUE INDEX "Member_discordUserId_key" ON "Member"("discordUserId");

CREATE TABLE "MemberActivity" (
  "id" TEXT NOT NULL,
  "memberId" TEXT NOT NULL,
  "source" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "summary" TEXT NOT NULL,
  "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "MemberActivity_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "MemberActivity_memberId_occurredAt_idx" ON "MemberActivity"("memberId", "occurredAt");
ALTER TABLE "MemberActivity" ADD CONSTRAINT "MemberActivity_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;
