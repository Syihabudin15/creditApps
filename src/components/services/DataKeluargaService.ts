import { DataKeluarga } from "@prisma/client";
import prisma from "../Prisma";
import { IServiceResponse } from "../IInterfaces";

export const CreateKeluarga = async (
  data: DataKeluarga
): Promise<IServiceResponse<DataKeluarga>> => {
  const find = await prisma.dataKeluarga.findFirst({
    where: {
      OR: [
        { AND: [{ nama: data.nama }, { dataDebiturId: data.dataDebiturId }] },
        { id: data.id },
      ],
    },
  });
  if (find) {
    const updated = await prisma.dataKeluarga.update({
      where: { id: find.id },
      data: {
        nama: data.nama ? data.nama : find.nama,
        noTelepon: data.noTelepon ? data.noTelepon : find.noTelepon,
        hubungan: data.hubungan ? data.hubungan : find.hubungan,
        alamat: data.alamat ? data.alamat : find.alamat,
        gender: data.gender ? data.gender : find.gender,
      },
    });
    return { status: 201, msg: "Success", data: updated };
  }
  const result = await prisma.dataKeluarga.create({
    data: {
      nama: data.nama,
      noTelepon: data.noTelepon,
      hubungan: data.hubungan,
      alamat: data.alamat,
      gender: data.gender,
      dataDebiturId: data.dataDebiturId,
    },
  });

  return { status: 201, msg: "Success", data: result };
};
