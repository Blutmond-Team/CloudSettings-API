/*
  Warnings:

  - The primary key for the `Login` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `serverid` on the `Login` table. All the data in the column will be lost.
  - Added the required column `serverId` to the `Login` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `LoginToken` DROP FOREIGN KEY `LoginToken_serverId_userId_fkey`;

-- AlterTable
ALTER TABLE `Login` DROP PRIMARY KEY,
    DROP COLUMN `serverid`,
    ADD COLUMN `serverId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`serverId`, `userId`);

-- AddForeignKey
ALTER TABLE `LoginToken` ADD CONSTRAINT `LoginToken_serverId_userId_fkey` FOREIGN KEY (`serverId`, `userId`) REFERENCES `Login`(`serverId`, `userId`) ON DELETE RESTRICT ON UPDATE CASCADE;
