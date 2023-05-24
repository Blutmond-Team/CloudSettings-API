/*
  Warnings:

  - Added the required column `key` to the `Option` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Option` ADD COLUMN `key` VARCHAR(191) NOT NULL;
