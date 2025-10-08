/*
  Warnings:

  - You are about to drop the column `dateTh` on the `ExamSchedule` table. All the data in the column will be lost.
  - Made the column `sectionType` on table `ExamSchedule` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `ExamSchedule` DROP COLUMN `dateTh`,
    MODIFY `sectionType` ENUM('THEORY', 'PRACTICAL') NOT NULL DEFAULT 'THEORY';
