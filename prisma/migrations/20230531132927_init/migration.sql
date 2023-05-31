-- DropForeignKey
ALTER TABLE `Option` DROP FOREIGN KEY `Option_userId_fkey`;

-- AddForeignKey
ALTER TABLE `Option` ADD CONSTRAINT `Option_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
