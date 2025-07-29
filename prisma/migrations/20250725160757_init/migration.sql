-- CreateTable
CREATE TABLE `User` (
    `stdCode` VARCHAR(12) NOT NULL,
    `loginName` VARCHAR(12) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `loggedCount` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `stdId` VARCHAR(50) NOT NULL,
    `titleTh` VARCHAR(50) NOT NULL,
    `firstNameTh` VARCHAR(100) NOT NULL,
    `middleNameTh` VARCHAR(100) NULL,
    `lastNameTh` VARCHAR(100) NOT NULL,
    `copenId` VARCHAR(50) NOT NULL,
    `campusCode` VARCHAR(10) NOT NULL,
    `facultyCode` VARCHAR(10) NOT NULL,
    `departmentCode` VARCHAR(10) NOT NULL,
    `majorCode` VARCHAR(10) NOT NULL,
    `nationCode` VARCHAR(10) NOT NULL,
    `studentStatusCode` VARCHAR(10) NOT NULL,
    `studentTypeCode` VARCHAR(10) NOT NULL,
    `edulevelCode` VARCHAR(10) NOT NULL,
    `studentYear` VARCHAR(10) NOT NULL,
    `advisorId` VARCHAR(50) NOT NULL,
    `email` VARCHAR(100) NULL,
    `mobileNo` VARCHAR(15) NULL,
    `requestUpdateAt` DATETIME(3) NULL,

    PRIMARY KEY (`stdCode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Copen` (
    `copenId` VARCHAR(50) NOT NULL,
    `copenNameTh` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`copenId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Campus` (
    `campusCode` VARCHAR(10) NOT NULL,
    `campusNameTh` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`campusCode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Faculty` (
    `facultyCode` VARCHAR(10) NOT NULL,
    `facultyNameTh` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`facultyCode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Department` (
    `departmentCode` VARCHAR(10) NOT NULL,
    `departmentNameTh` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`departmentCode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Major` (
    `majorCode` VARCHAR(10) NOT NULL,
    `majorNameTh` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`majorCode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Advisor` (
    `advisorId` VARCHAR(50) NOT NULL,
    `advisorNameTh` VARCHAR(100) NOT NULL,
    `positionTh` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`advisorId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ExamSchedule` (
    `id` VARCHAR(191) NOT NULL,
    `dateTh` VARCHAR(50) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `time` VARCHAR(50) NOT NULL,
    `subjectCode` VARCHAR(50) NOT NULL,
    `sectionCode` VARCHAR(50) NOT NULL,
    `room` VARCHAR(50) NOT NULL,
    `studentIdRange` VARCHAR(50) NULL,
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RegisteredCourse` (
    `id` VARCHAR(191) NOT NULL,
    `sectionId` INTEGER NOT NULL,
    `stdCode` VARCHAR(12) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    INDEX `RegisteredCourse_stdCode_idx`(`stdCode`),
    INDEX `RegisteredCourse_sectionId_idx`(`sectionId`),
    UNIQUE INDEX `RegisteredCourse_stdCode_sectionId_key`(`stdCode`, `sectionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CourseSchedule` (
    `sectionId` INTEGER NOT NULL,
    `groupHeader` VARCHAR(50) NOT NULL,
    `weekStartDay` DATETIME(3) NOT NULL,
    `weekEndDay` DATETIME(3) NOT NULL,
    `subjectCode` VARCHAR(50) NOT NULL,
    `subjectNameTh` VARCHAR(100) NOT NULL,
    `sectionCode` VARCHAR(10) NOT NULL,
    `sectionType` VARCHAR(6) NOT NULL,
    `sectionTypeTh` VARCHAR(50) NOT NULL,
    `stdStatusTh` VARCHAR(50) NOT NULL,
    `teacherName` VARCHAR(100) NULL,
    `timeFrom` VARCHAR(5) NOT NULL,
    `timeTo` VARCHAR(5) NOT NULL,
    `dayW` VARCHAR(10) NOT NULL,
    `roomNameTh` VARCHAR(50) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    INDEX `CourseSchedule_subjectCode_idx`(`subjectCode`),
    INDEX `CourseSchedule_sectionId_idx`(`sectionId`),
    PRIMARY KEY (`sectionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserExamSchedule` (
    `id` VARCHAR(191) NOT NULL,
    `stdCode` VARCHAR(12) NOT NULL,
    `examScheduleId` VARCHAR(50) NOT NULL,
    `sectionId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    INDEX `UserExamSchedule_stdCode_idx`(`stdCode`),
    INDEX `UserExamSchedule_examScheduleId_idx`(`examScheduleId`),
    UNIQUE INDEX `UserExamSchedule_stdCode_examScheduleId_sectionId_key`(`stdCode`, `examScheduleId`, `sectionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RequestUpdate` (
    `id` VARCHAR(191) NOT NULL,
    `stdCode` VARCHAR(12) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_advisorId_fkey` FOREIGN KEY (`advisorId`) REFERENCES `Advisor`(`advisorId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_majorCode_fkey` FOREIGN KEY (`majorCode`) REFERENCES `Major`(`majorCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_departmentCode_fkey` FOREIGN KEY (`departmentCode`) REFERENCES `Department`(`departmentCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_facultyCode_fkey` FOREIGN KEY (`facultyCode`) REFERENCES `Faculty`(`facultyCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_campusCode_fkey` FOREIGN KEY (`campusCode`) REFERENCES `Campus`(`campusCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_copenId_fkey` FOREIGN KEY (`copenId`) REFERENCES `Copen`(`copenId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RegisteredCourse` ADD CONSTRAINT `RegisteredCourse_sectionId_fkey` FOREIGN KEY (`sectionId`) REFERENCES `CourseSchedule`(`sectionId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RegisteredCourse` ADD CONSTRAINT `RegisteredCourse_stdCode_fkey` FOREIGN KEY (`stdCode`) REFERENCES `User`(`stdCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserExamSchedule` ADD CONSTRAINT `UserExamSchedule_stdCode_fkey` FOREIGN KEY (`stdCode`) REFERENCES `User`(`stdCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserExamSchedule` ADD CONSTRAINT `UserExamSchedule_examScheduleId_fkey` FOREIGN KEY (`examScheduleId`) REFERENCES `ExamSchedule`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserExamSchedule` ADD CONSTRAINT `UserExamSchedule_sectionId_fkey` FOREIGN KEY (`sectionId`) REFERENCES `CourseSchedule`(`sectionId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RequestUpdate` ADD CONSTRAINT `RequestUpdate_stdCode_fkey` FOREIGN KEY (`stdCode`) REFERENCES `User`(`stdCode`) ON DELETE RESTRICT ON UPDATE CASCADE;
