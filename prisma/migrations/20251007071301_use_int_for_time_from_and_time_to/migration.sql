/*
  Warnings:

  - You are about to alter the column `timeFrom` on the `CourseSchedule` table. The data in that column could be lost. The data in that column will be cast from `VarChar(5)` to `UnsignedInt`.
  - You are about to alter the column `timeTo` on the `CourseSchedule` table. The data in that column could be lost. The data in that column will be cast from `VarChar(5)` to `UnsignedInt`.
  - You are about to drop the column `time` on the `ExamSchedule` table. All the data in the column will be lost.
  - Added the required column `timeFrom` to the `ExamSchedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeTo` to the `ExamSchedule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `CourseSchedule` MODIFY `timeFrom` INTEGER UNSIGNED NOT NULL,
    MODIFY `timeTo` INTEGER UNSIGNED NOT NULL;

-- AlterTable
ALTER TABLE `ExamSchedule` DROP COLUMN `time`,
    ADD COLUMN `timeFrom` INTEGER UNSIGNED NOT NULL,
    ADD COLUMN `timeTo` INTEGER UNSIGNED NOT NULL;
