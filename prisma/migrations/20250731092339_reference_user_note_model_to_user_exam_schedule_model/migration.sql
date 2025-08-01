/*
  Warnings:

  - Added the required column `userExamId` to the `UserNote` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `UserNote` ADD COLUMN `userExamId` VARCHAR(50) NOT NULL;

-- AddForeignKey
ALTER TABLE `UserNote` ADD CONSTRAINT `UserNote_userExamId_fkey` FOREIGN KEY (`userExamId`) REFERENCES `UserExamSchedule`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
