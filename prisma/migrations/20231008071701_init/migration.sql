-- CreateTable
CREATE TABLE `Mod` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ModStat` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `modId` VARCHAR(191) NOT NULL,
    `version` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modLoader` ENUM('FORGE', 'NEO', 'FABRIC', 'QUILT', 'UNKNOWN') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ModClaim` (
    `id` VARCHAR(191) NOT NULL,
    `modId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `apiKey` VARCHAR(191) NOT NULL,
    `plattform` ENUM('CURSEFORGE', 'MODRINTH') NOT NULL,

    PRIMARY KEY (`id`, `plattform`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ModStat` ADD CONSTRAINT `ModStat_modId_fkey` FOREIGN KEY (`modId`) REFERENCES `Mod`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ModStat` ADD CONSTRAINT `ModStat_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ModClaim` ADD CONSTRAINT `ModClaim_modId_fkey` FOREIGN KEY (`modId`) REFERENCES `Mod`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ModClaim` ADD CONSTRAINT `ModClaim_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
