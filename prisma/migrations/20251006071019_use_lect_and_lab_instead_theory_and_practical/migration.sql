/*
  Warnings:

  - You are about to alter the column `sectionType` on the `ExamSchedule` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(2))` to `Enum(EnumId(1))`.

*/
-- AlterTable
ALTER TABLE `ExamSchedule` MODIFY `sectionType` ENUM('LECT', 'LAB') NOT NULL DEFAULT 'LECT';
