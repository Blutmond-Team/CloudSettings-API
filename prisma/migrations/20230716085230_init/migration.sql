/*
  Warnings:

  - You are about to drop the `UserActivity` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `UserActivity` DROP FOREIGN KEY `UserActivity_userId_fkey`;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `lastActivity` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- DropTable
DROP TABLE `UserActivity`;
