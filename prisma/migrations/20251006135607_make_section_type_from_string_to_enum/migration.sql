/*
  Warnings:

  - You are about to drop the column `sectionTypeTh` on the `CourseSchedule` table. All the data in the column will be lost.
  - You are about to alter the column `sectionType` on the `CourseSchedule` table. The data in that column could be lost. The data in that column will be cast from `VarChar(6)` to `Enum(EnumId(4))`.

*/
-- AlterTable
ALTER TABLE `CourseSchedule` DROP COLUMN `sectionTypeTh`,
    MODIFY `sectionType` ENUM('LECT', 'LAB') NOT NULL DEFAULT 'LECT';
