/*
  Warnings:

  - You are about to drop the `Logins` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Logins` DROP FOREIGN KEY `Logins_userId_fkey`;

-- DropTable
DROP TABLE `Logins`;

-- CreateTable
CREATE TABLE `Login` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `verified` BOOLEAN NOT NULL DEFAULT false,
    `loginTokenToken` VARCHAR(191) NULL,

    UNIQUE INDEX `Login_loginTokenToken_key`(`loginTokenToken`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LoginToken` (
    `token` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Login` ADD CONSTRAINT `Login_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Login` ADD CONSTRAINT `Login_loginTokenToken_fkey` FOREIGN KEY (`loginTokenToken`) REFERENCES `LoginToken`(`token`) ON DELETE SET NULL ON UPDATE CASCADE;
