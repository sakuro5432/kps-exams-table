/*
  Warnings:

  - You are about to drop the `UserNote` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `UserNote` DROP FOREIGN KEY `UserNote_stdCode_fkey`;

-- DropForeignKey
ALTER TABLE `UserNote` DROP FOREIGN KEY `UserNote_userExamId_fkey`;

-- DropTable
DROP TABLE `UserNote`;

-- CreateTable
CREATE TABLE `UserExamNote` (
    `id` VARCHAR(191) NOT NULL,
    `comment` VARCHAR(50) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deletedAt` DATETIME(3) NULL,
    `userExamId` VARCHAR(50) NOT NULL,
    `stdCode` VARCHAR(12) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserExamNote` ADD CONSTRAINT `UserExamNote_stdCode_fkey` FOREIGN KEY (`stdCode`) REFERENCES `User`(`stdCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserExamNote` ADD CONSTRAINT `UserExamNote_userExamId_fkey` FOREIGN KEY (`userExamId`) REFERENCES `UserExamSchedule`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
