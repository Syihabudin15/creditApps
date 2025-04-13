import { DataDebitur } from "@prisma/client";
import prisma from "../Prisma";
import { IServiceResponse } from "../IInterfaces";

export const CreateDebitur = async (
  data: DataDebitur
): Promise<IServiceResponse<DataDebitur>> => {
  const find = await prisma.dataDebitur.findFirst({
    where: {
      OR: [{ nik: data.nik }, { id: data.id }],
    },
  });
  if (find) {
    const updated = await prisma.dataDebitur.update({
      where: { id: data.id },
      data: {
        nama: data.nama ? data.nama : find.nama,
        nik: data.nik ? data.nik : find.nik,
        noKK: data.noKK ? data.noKK : find.noKK,
        tanggalLahir: data.tanggalLahir ? data.tanggalLahir : find.tanggalLahir,
        alamat: data.alamat ? data.alamat : find.alamat,
        kelurahan: data.kelurahan ? data.kelurahan : find.kelurahan,
        kecamatan: data.kecamatan ? data.kecamatan : find.kecamatan,
        kota: data.kota ? data.kota : find.kota,
        provinsi: data.provinsi ? data.provinsi : find.provinsi,
        kodePos: data.kodePos ? data.kodePos : find.kodePos,
        geoLokasi: data.geoLokasi ? data.geoLokasi : find.geoLokasi,
        noTelepon: data.noTelepon ? data.noTelepon : find.noTelepon,
        gender: data.gender ? data.gender : find.gender,
        pekerjaan: data.pekerjaan ? data.pekerjaan : find.pekerjaan,
        alamatPekerjaan: data.alamatPekerjaan
          ? data.alamatPekerjaan
          : find.alamatPekerjaan,
        statusKawin: data.statusKawin ? data.statusKawin : find.statusKawin,
        namaPasangan: data.namaPasangan ? data.namaPasangan : find.namaPasangan,
        nikPasangan: data.nikPasangan ? data.nikPasangan : find.nikPasangan,
        tanggalLahirPasangan: data.tanggalLahirPasangan
          ? data.tanggalLahirPasangan
          : find.tanggalLahirPasangan,
        alamatPasangan: data.alamatPasangan
          ? data.alamatPasangan
          : find.alamatPasangan,
        noTeleponPasangan: data.noTelepon ? data.noTelepon : find.noTelepon,
        pekerjaanPasangan: data.pekerjaanPasangan
          ? data.pekerjaanPasangan
          : find.pekerjaanPasangan,
      },
    });
    return { status: 201, msg: "Success", data: updated };
  }
  const result = await prisma.dataDebitur.create({
    data: {
      nama: data.nama,
      nik: data.nik,
      noKK: data.noKK,
      tanggalLahir: data.tanggalLahir,
      alamat: data.alamat,
      kelurahan: data.kelurahan,
      kecamatan: data.kecamatan,
      kota: data.kota,
      provinsi: data.provinsi,
      kodePos: data.kodePos,
      geoLokasi: data.geoLokasi,
      noTelepon: data.noTelepon,
      gender: data.gender,
      pekerjaan: data.pekerjaan,
      alamatPekerjaan: data.alamatPekerjaan,
      statusKawin: data.statusKawin,
      namaPasangan: data.namaPasangan,
      nikPasangan: data.nikPasangan,
      tanggalLahirPasangan: data.tanggalLahirPasangan,
      alamatPasangan: data.alamatPasangan,
      noTeleponPasangan: data.noTelepon,
      pekerjaanPasangan: data.pekerjaanPasangan,
    },
  });

  return { status: 201, msg: "Success", data: result };
};
