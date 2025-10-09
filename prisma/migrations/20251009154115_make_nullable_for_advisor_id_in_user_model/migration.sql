-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_advisorId_fkey`;

-- DropIndex
DROP INDEX `User_advisorId_fkey` ON `User`;

-- AlterTable
ALTER TABLE `User` MODIFY `advisorId` VARCHAR(50) NULL;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_advisorId_fkey` FOREIGN KEY (`advisorId`) REFERENCES `Advisor`(`advisorId`) ON DELETE SET NULL ON UPDATE CASCADE;
