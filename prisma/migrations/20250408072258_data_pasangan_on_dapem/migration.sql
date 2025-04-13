/*
  Warnings:

  - You are about to drop the column `isSave` on the `detaildapem` table. All the data in the column will be lost.
  - Added the required column `alamatPekerjaan` to the `DataDebitur` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pekerjaan` to the `DataDebitur` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `datadebitur` ADD COLUMN `alamatPasangan` VARCHAR(191) NULL,
    ADD COLUMN `alamatPekerjaan` TEXT NOT NULL,
    ADD COLUMN `namaPasangan` VARCHAR(191) NULL,
    ADD COLUMN `nikPasangan` VARCHAR(191) NULL,
    ADD COLUMN `noTeleponPasangan` VARCHAR(191) NULL,
    ADD COLUMN `pekerjaan` VARCHAR(191) NOT NULL,
    ADD COLUMN `pekerjaanPasangan` VARCHAR(191) NULL,
    ADD COLUMN `tanggalLahirPasangan` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `detaildapem` DROP COLUMN `isSave`;
