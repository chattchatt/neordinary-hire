-- AlterTable: add isQuickRegister flag to Member
ALTER TABLE "Member" ADD COLUMN "isQuickRegister" BOOLEAN NOT NULL DEFAULT false;
