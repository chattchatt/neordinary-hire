-- Store message-level Discord evidence for admin-only candidate review.
CREATE TABLE "DiscordActivityEvidence" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "channelName" TEXT NOT NULL,
    "messageType" TEXT NOT NULL DEFAULT 'message',
    "contentExcerpt" TEXT NOT NULL,
    "messageUrl" TEXT,
    "occurredAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DiscordActivityEvidence_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "DiscordActivityEvidence_memberId_messageId_key" ON "DiscordActivityEvidence"("memberId", "messageId");
CREATE INDEX "DiscordActivityEvidence_memberId_occurredAt_idx" ON "DiscordActivityEvidence"("memberId", "occurredAt");
CREATE INDEX "DiscordActivityEvidence_channelId_occurredAt_idx" ON "DiscordActivityEvidence"("channelId", "occurredAt");

ALTER TABLE "DiscordActivityEvidence" ADD CONSTRAINT "DiscordActivityEvidence_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;
