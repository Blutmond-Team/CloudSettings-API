-- DropForeignKey
ALTER TABLE `Login` DROP FOREIGN KEY `Login_loginTokenToken_fkey`;

-- AddForeignKey
ALTER TABLE `Login` ADD CONSTRAINT `Login_loginTokenToken_fkey` FOREIGN KEY (`loginTokenToken`) REFERENCES `LoginToken`(`token`) ON DELETE CASCADE ON UPDATE CASCADE;
