/*
  Warnings:

  - The primary key for the `ModClaim` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE `ModClaim` DROP PRIMARY KEY,
    ADD PRIMARY KEY (`modId`, `plattform`, `userId`);
