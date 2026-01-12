/*
  Warnings:

  - You are about to drop the column `timeFrom` on the `CourseSchedule` table. All the data in the column will be lost.
  - You are about to drop the column `timeTo` on the `CourseSchedule` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `CourseSchedule` DROP COLUMN `timeFrom`,
    DROP COLUMN `timeTo`;
