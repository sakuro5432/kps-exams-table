/*
  Warnings:

  - You are about to drop the column `groupHeader` on the `CourseSchedule` table. All the data in the column will be lost.
  - You are about to drop the column `weekEndDay` on the `CourseSchedule` table. All the data in the column will be lost.
  - You are about to drop the column `weekStartDay` on the `CourseSchedule` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `CourseSchedule` DROP COLUMN `groupHeader`,
    DROP COLUMN `weekEndDay`,
    DROP COLUMN `weekStartDay`;
