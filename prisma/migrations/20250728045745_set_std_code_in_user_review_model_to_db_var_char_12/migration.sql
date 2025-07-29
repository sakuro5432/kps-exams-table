/*
  Warnings:

  - You are about to alter the column `stdCode` on the `UserReview` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(12)`.

*/
-- DropForeignKey
ALTER TABLE `UserReview` DROP FOREIGN KEY `UserReview_stdCode_fkey`;

-- DropIndex
DROP INDEX `UserReview_stdCode_fkey` ON `UserReview`;

-- AlterTable
ALTER TABLE `UserReview` MODIFY `stdCode` VARCHAR(12) NOT NULL;

-- AddForeignKey
ALTER TABLE `UserReview` ADD CONSTRAINT `UserReview_stdCode_fkey` FOREIGN KEY (`stdCode`) REFERENCES `User`(`stdCode`) ON DELETE RESTRICT ON UPDATE CASCADE;
