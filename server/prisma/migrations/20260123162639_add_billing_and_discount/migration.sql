-- AlterTable
ALTER TABLE "Batch" ADD COLUMN     "billingCycle" TEXT,
ADD COLUMN     "customDuration" INTEGER;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "discount" INTEGER NOT NULL DEFAULT 0;
