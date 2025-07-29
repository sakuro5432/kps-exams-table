/*
  Warnings:

  - You are about to drop the `Copen` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_copenId_fkey`;

-- DropIndex
DROP INDEX `User_copenId_fkey` ON `User`;

-- DropTable
DROP TABLE `Copen`;
