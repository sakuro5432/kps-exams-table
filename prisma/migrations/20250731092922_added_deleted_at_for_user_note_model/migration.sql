/*
  Warnings:

  - You are about to drop the column `created` on the `UserNote` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `UserNote` DROP COLUMN `created`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `deletedAt` DATETIME(3) NULL;
