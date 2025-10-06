/*
  Warnings:

  - Made the column `sectionType` on table `ExamSchedule` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `ExamSchedule` MODIFY `sectionType` ENUM('LECT', 'LAB') NOT NULL DEFAULT 'LECT';
