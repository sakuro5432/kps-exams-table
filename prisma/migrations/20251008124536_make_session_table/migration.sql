-- CreateTable
CREATE TABLE `Session` (
    `id` VARCHAR(100) NOT NULL,
    `stdCode` VARCHAR(100) NOT NULL,
    `ip` VARCHAR(45) NULL,
    `userAgent` TEXT NULL,
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `expiredAt` DATETIME(0) NOT NULL,
    `revokedAt` DATETIME(0) NULL,

    INDEX `Session_stdCode_idx`(`stdCode`),
    INDEX `Session_expiredAt_idx`(`expiredAt`),
    INDEX `Session_stdCode_expiredAt_idx`(`stdCode`, `expiredAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Session` ADD CONSTRAINT `Session_stdCode_fkey` FOREIGN KEY (`stdCode`) REFERENCES `User`(`stdCode`) ON DELETE RESTRICT ON UPDATE CASCADE;
