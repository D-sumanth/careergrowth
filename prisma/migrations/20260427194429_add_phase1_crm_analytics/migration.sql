-- AlterTable
ALTER TABLE "Inquiry" ADD COLUMN     "campaign" TEXT,
ADD COLUMN     "followUpAt" TIMESTAMP(3),
ADD COLUMN     "internalNotes" TEXT,
ADD COLUMN     "medium" TEXT,
ADD COLUMN     "referrer" TEXT,
ADD COLUMN     "source" TEXT;

-- AlterTable
ALTER TABLE "NewsletterSubscriber" ADD COLUMN     "campaign" TEXT,
ADD COLUMN     "medium" TEXT,
ADD COLUMN     "referrer" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "acquisitionCampaign" TEXT,
ADD COLUMN     "acquisitionMedium" TEXT,
ADD COLUMN     "acquisitionReferrer" TEXT,
ADD COLUMN     "acquisitionSource" TEXT;
