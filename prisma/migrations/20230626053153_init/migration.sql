/*
  Warnings:

  - You are about to drop the column `loginTokenToken` on the `Login` table. All the data in the column will be lost.
  - Added the required column `loginId` to the `LoginToken` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Login` DROP FOREIGN KEY `Login_loginTokenToken_fkey`;

-- AlterTable
ALTER TABLE `Login` DROP COLUMN `loginTokenToken`;

-- AlterTable
ALTER TABLE `LoginToken` ADD COLUMN `loginId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `LoginToken` ADD CONSTRAINT `LoginToken_loginId_fkey` FOREIGN KEY (`loginId`) REFERENCES `Login`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
