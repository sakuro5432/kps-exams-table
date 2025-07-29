-- AlterTable
ALTER TABLE `ExamSchedule` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `isCorrectCount` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `status` VARCHAR(191) NOT NULL DEFAULT 'approved';

-- CreateTable
CREATE TABLE `UserReview` (
    `id` VARCHAR(191) NOT NULL,
    `examScheduleId` VARCHAR(191) NOT NULL,
    `comment` VARCHAR(50) NULL,
    `isCorrect` BOOLEAN NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `stdCode` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserReview` ADD CONSTRAINT `UserReview_examScheduleId_fkey` FOREIGN KEY (`examScheduleId`) REFERENCES `ExamSchedule`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserReview` ADD CONSTRAINT `UserReview_stdCode_fkey` FOREIGN KEY (`stdCode`) REFERENCES `User`(`stdCode`) ON DELETE RESTRICT ON UPDATE CASCADE;
