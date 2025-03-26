/*
  Warnings:

  - You are about to drop the column `alamat` on the `dapem` table. All the data in the column will be lost.
  - You are about to drop the column `namaPemohon` on the `dapem` table. All the data in the column will be lost.
  - You are about to drop the column `nik` on the `dapem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `dapem` DROP COLUMN `alamat`,
    DROP COLUMN `namaPemohon`,
    DROP COLUMN `nik`,
    ADD COLUMN `detailDapemId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `DetailDapem` (
    `id` VARCHAR(191) NOT NULL,
    `berkasPengajuan` VARCHAR(191) NULL,
    `videoWawancara` VARCHAR(191) NULL,
    `status` ENUM('SAVED', 'ANTRI', 'PENDING', 'PROSES', 'BATAL', 'SELESAI') NOT NULL DEFAULT 'SAVED',
    `tanggalStatus` DATETIME(3) NOT NULL,
    `keterangan` TEXT NOT NULL,
    `statusCair` ENUM('SAVED', 'ANTRI', 'PENDING', 'PROSES', 'BATAL', 'SELESAI') NOT NULL DEFAULT 'ANTRI',
    `tanggalCair` DATETIME(3) NULL,
    `noAkad` VARCHAR(191) NULL,
    `tanggalAkad` DATETIME(3) NULL,
    `berkasAkad` VARCHAR(191) NULL,
    `buktiPencairan` VARCHAR(191) NULL,
    `nominalPencairan` INTEGER NULL,
    `buktiPencairan1` VARCHAR(191) NULL,
    `nominalPencairan1` INTEGER NULL,
    `buktiPencairan2` VARCHAR(191) NULL,
    `nominalPencairan2` INTEGER NULL,
    `fee` INTEGER NULL,
    `buktiFee` VARCHAR(191) NULL,
    `tujuanPenggunaan` VARCHAR(191) NULL,
    `isSave` BOOLEAN NOT NULL DEFAULT true,
    `userId` VARCHAR(191) NOT NULL,
    `dataDebiturId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `DetailDapem_noAkad_key`(`noAkad`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DataDebitur` (
    `id` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `nik` VARCHAR(191) NOT NULL,
    `noKK` VARCHAR(191) NOT NULL,
    `tanggalLahir` DATETIME(3) NOT NULL,
    `alamat` VARCHAR(191) NOT NULL,
    `kelurahan` VARCHAR(191) NOT NULL,
    `kecamatan` VARCHAR(191) NOT NULL,
    `kota` VARCHAR(191) NOT NULL,
    `provinsi` VARCHAR(191) NOT NULL,
    `kodePos` VARCHAR(191) NOT NULL,
    `geoLokasi` VARCHAR(191) NOT NULL,
    `noTelepon` VARCHAR(191) NOT NULL,
    `gender` ENUM('Laki_laki', 'Perempuan') NOT NULL,
    `statusKawin` ENUM('BELUMKAWIN', 'KAWIN', 'JANDA', 'DUDA') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DataKeluarga` (
    `id` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `noTelepon` VARCHAR(191) NOT NULL,
    `hubungan` VARCHAR(191) NOT NULL,
    `alamat` VARCHAR(191) NOT NULL,
    `gender` ENUM('Laki_laki', 'Perempuan') NOT NULL,
    `dataDebiturId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Dapem` ADD CONSTRAINT `Dapem_detailDapemId_fkey` FOREIGN KEY (`detailDapemId`) REFERENCES `DetailDapem`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DetailDapem` ADD CONSTRAINT `DetailDapem_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DetailDapem` ADD CONSTRAINT `DetailDapem_dataDebiturId_fkey` FOREIGN KEY (`dataDebiturId`) REFERENCES `DataDebitur`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DataKeluarga` ADD CONSTRAINT `DataKeluarga_dataDebiturId_fkey` FOREIGN KEY (`dataDebiturId`) REFERENCES `DataDebitur`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
