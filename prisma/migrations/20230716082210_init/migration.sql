/*
  Warnings:

  - You are about to drop the column `lastActivity` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `lastActivity`;

-- CreateTable
CREATE TABLE `UserActivity` (
    `userId` VARCHAR(191) NOT NULL,
    `timeStamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`userId`, `timeStamp`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserActivity` ADD CONSTRAINT `UserActivity_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
