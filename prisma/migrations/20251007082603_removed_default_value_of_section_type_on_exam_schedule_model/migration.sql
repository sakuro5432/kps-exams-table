/*
  Warnings:

  - You are about to alter the column `dayW` on the `CourseSchedule` table. The data in that column could be lost. The data in that column will be cast from `VarChar(10)` to `Enum(EnumId(5))`.

*/
-- AlterTable
ALTER TABLE `CourseSchedule` MODIFY `teacherName` TEXT NULL,
    MODIFY `dayW` ENUM('MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN') NOT NULL;

-- AlterTable
ALTER TABLE `ExamSchedule` ALTER COLUMN `sectionType` DROP DEFAULT;
