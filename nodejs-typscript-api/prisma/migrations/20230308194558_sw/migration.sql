-- CreateTable
CREATE TABLE `Planets` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `climate` VARCHAR(191) NULL,
    `terrain` VARCHAR(191) NULL,
    `population` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Species` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `classification` VARCHAR(191) NULL,
    `averageHeight` VARCHAR(191) NULL,
    `averageLifespan` VARCHAR(191) NULL,
    `language` VARCHAR(191) NULL,
    `homeworld` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `People` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `height` VARCHAR(191) NULL,
    `mass` VARCHAR(191) NULL,
    `hair_color` VARCHAR(191) NULL,
    `skin_color` VARCHAR(191) NULL,
    `eye_color` VARCHAR(191) NULL,
    `birth_year` VARCHAR(191) NULL,
    `gender` VARCHAR(191) NULL,
    `homeworldId` INTEGER NULL,
    `speciesId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `People` ADD CONSTRAINT `People_homeworldId_fkey` FOREIGN KEY (`homeworldId`) REFERENCES `Planets`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `People` ADD CONSTRAINT `People_speciesId_fkey` FOREIGN KEY (`speciesId`) REFERENCES `Species`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
