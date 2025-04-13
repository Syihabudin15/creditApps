import { DetailDapem } from "@prisma/client";
import prisma from "../Prisma";
import { IServiceResponse } from "../IInterfaces";

export const CreateDetailDapem = async (
  detailDapem: DetailDapem
): Promise<IServiceResponse<DetailDapem>> => {
  const result = await prisma.detailDapem.create({
    data: {
      berkasPengajuan: detailDapem.berkasPengajuan,
      videoWawancara: detailDapem.videoWawancara,
      status: detailDapem.status,
      fee: detailDapem.fee,
      tujuanPenggunaan: detailDapem.tujuanPenggunaan,
      userId: detailDapem.userId,
      dataDebiturId: detailDapem.dataDebiturId,
      tanggalStatus: detailDapem.tanggalStatus,
      keterangan: detailDapem.keterangan,
      statusCair: detailDapem.statusCair,
      tanggalCair: detailDapem.tanggalCair,
      noAkad: detailDapem.noAkad,
      tanggalAkad: detailDapem.tanggalAkad,
      berkasAkad: detailDapem.berkasAkad,
      buktiPencairan: detailDapem.buktiPencairan,
      nominalPencairan: detailDapem.nominalPencairan,
      buktiPencairan1: detailDapem.buktiPencairan1,
      nominalPencairan1: detailDapem.nominalPencairan1,
      buktiPencairan2: detailDapem.buktiPencairan2,
      nominalPencairan2: detailDapem.nominalPencairan2,
      buktiFee: detailDapem.buktiFee,
      pemeriksa: detailDapem.pemeriksa,
    },
  });

  return { status: 201, msg: "Success", data: result };
};
export const UpdateDetailDapem = async (
  detailDapem: DetailDapem
): Promise<IServiceResponse<DetailDapem>> => {
  const find = await prisma.detailDapem.findFirst({
    where: { id: detailDapem.id },
  });
  if (!find) {
    return { status: 404, msg: "Detail Data Pembiayaan Not Found" };
  }
  const result = await prisma.detailDapem.update({
    where: { id: find.id },
    data: {
      berkasPengajuan: detailDapem.berkasPengajuan
        ? detailDapem.berkasPengajuan
        : find.berkasPengajuan,
      videoWawancara: detailDapem.videoWawancara
        ? detailDapem.videoWawancara
        : find.videoWawancara,
      status: detailDapem.status ? detailDapem.status : find.status,
      fee: detailDapem.fee ? detailDapem.fee : find.fee,
      tujuanPenggunaan: detailDapem.tujuanPenggunaan
        ? detailDapem.tujuanPenggunaan
        : find.tujuanPenggunaan,
      userId: detailDapem.userId ? detailDapem.userId : find.userId,
      dataDebiturId: detailDapem.dataDebiturId
        ? detailDapem.dataDebiturId
        : find.dataDebiturId,
      tanggalStatus: detailDapem.tanggalStatus
        ? detailDapem.tanggalStatus
        : find.tanggalStatus,
      keterangan: detailDapem.keterangan
        ? detailDapem.keterangan
        : find.keterangan,
      statusCair: detailDapem.statusCair
        ? detailDapem.statusCair
        : find.statusCair,
      tanggalCair: detailDapem.tanggalCair
        ? detailDapem.tanggalCair
        : find.tanggalCair,
      noAkad: detailDapem.noAkad ? detailDapem.noAkad : find.noAkad,
      tanggalAkad: detailDapem.tanggalAkad
        ? detailDapem.tanggalAkad
        : find.tanggalAkad,
      berkasAkad: detailDapem.berkasAkad
        ? detailDapem.berkasAkad
        : find.berkasAkad,
      buktiPencairan: detailDapem.buktiPencairan
        ? detailDapem.buktiPencairan
        : find.buktiPencairan,
      nominalPencairan: detailDapem.nominalPencairan
        ? detailDapem.nominalPencairan
        : find.nominalPencairan,
      buktiPencairan1: detailDapem.buktiPencairan1
        ? detailDapem.buktiPencairan1
        : find.buktiPencairan1,
      nominalPencairan1: detailDapem.nominalPencairan1
        ? detailDapem.nominalPencairan1
        : find.nominalPencairan1,
      buktiPencairan2: detailDapem.buktiPencairan2
        ? detailDapem.buktiPencairan2
        : find.buktiPencairan2,
      nominalPencairan2: detailDapem.nominalPencairan2
        ? detailDapem.nominalPencairan2
        : find.nominalPencairan2,
      buktiFee: detailDapem.buktiFee ? detailDapem.buktiFee : find.buktiFee,
      pemeriksa: detailDapem.pemeriksa ? detailDapem.pemeriksa : find.pemeriksa,
    },
  });

  return { status: 201, msg: "Success", data: result };
};
