-- AlterTable
ALTER TABLE `detaildapem` MODIFY `status` ENUM('SAVED', 'ANTRI', 'PENDING', 'TOLAK', 'SETUJU', 'PROSES', 'BATAL', 'SELESAI') NOT NULL DEFAULT 'SAVED',
    MODIFY `statusCair` ENUM('SAVED', 'ANTRI', 'PENDING', 'TOLAK', 'SETUJU', 'PROSES', 'BATAL', 'SELESAI') NOT NULL DEFAULT 'ANTRI';
