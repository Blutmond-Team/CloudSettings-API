/*
  Warnings:

  - You are about to drop the `Mod` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ModClaim` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ModStat` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `ModClaim` DROP FOREIGN KEY `ModClaim_modId_fkey`;

-- DropForeignKey
ALTER TABLE `ModClaim` DROP FOREIGN KEY `ModClaim_userId_fkey`;

-- DropForeignKey
ALTER TABLE `ModStat` DROP FOREIGN KEY `ModStat_modId_fkey`;

-- DropForeignKey
ALTER TABLE `ModStat` DROP FOREIGN KEY `ModStat_userId_fkey`;

-- DropTable
DROP TABLE `Mod`;

-- DropTable
DROP TABLE `ModClaim`;

-- DropTable
DROP TABLE `ModStat`;
