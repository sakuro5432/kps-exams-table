-- AlterTable
ALTER TABLE `ExamSchedule` MODIFY `sectionType` ENUM('LECT', 'LAB') NULL DEFAULT 'LECT';
