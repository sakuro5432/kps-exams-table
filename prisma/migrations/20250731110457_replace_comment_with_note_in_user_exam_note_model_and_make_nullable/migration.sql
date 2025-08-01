/*
  Warnings:

  - You are about to drop the column `comment` on the `UserExamNote` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `UserExamNote` DROP COLUMN `comment`,
    ADD COLUMN `note` VARCHAR(50) NULL;
