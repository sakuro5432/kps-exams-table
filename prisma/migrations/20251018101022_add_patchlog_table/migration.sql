-- CreateTable
CREATE TABLE `PatchLog` (
    `id` VARCHAR(191) NOT NULL,
    `patchName` VARCHAR(191) NOT NULL,
    `version` VARCHAR(10) NOT NULL,
    `status` ENUM('SUCCESS', 'FAILED') NOT NULL,
    `message` VARCHAR(191) NULL,
    `durationMs` INTEGER NULL,
    `executedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
