/*
  Warnings:

  - Made the column `feeRequestId` on table `Payment` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_feeRequestId_fkey";

-- AlterTable
ALTER TABLE "Payment" ALTER COLUMN "feeRequestId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_feeRequestId_fkey" FOREIGN KEY ("feeRequestId") REFERENCES "FeeRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
