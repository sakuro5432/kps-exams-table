/*
  Warnings:

  - The values [SYSTEM] on the enum `ExamSchedule_reportBy` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `ExamSchedule` MODIFY `reportBy` ENUM('SEED', 'ADMIN', 'STUDENT') NOT NULL DEFAULT 'STUDENT';
