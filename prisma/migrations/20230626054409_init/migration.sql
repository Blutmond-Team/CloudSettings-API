/*
  Warnings:

  - The primary key for the `Login` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Login` table. All the data in the column will be lost.
  - You are about to drop the column `loginId` on the `LoginToken` table. All the data in the column will be lost.
  - Added the required column `serverid` to the `Login` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serverId` to the `LoginToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `LoginToken` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `LoginToken` DROP FOREIGN KEY `LoginToken_loginId_fkey`;

-- AlterTable
ALTER TABLE `Login` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `serverid` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`serverid`, `userId`);

-- AlterTable
ALTER TABLE `LoginToken` DROP COLUMN `loginId`,
    ADD COLUMN `serverId` VARCHAR(191) NOT NULL,
    ADD COLUMN `userId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `LoginToken` ADD CONSTRAINT `LoginToken_serverId_userId_fkey` FOREIGN KEY (`serverId`, `userId`) REFERENCES `Login`(`serverid`, `userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LoginToken` ADD CONSTRAINT `LoginToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
