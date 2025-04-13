import { Dapem, Prisma } from "@prisma/client";
import { defaultPage, defaultPageSize } from "../utils/ServerUtils";
import prisma from "../Prisma";
import { IServiceResponse } from "../IInterfaces";

export const CreateDapem = async (
  dapem: Dapem
): Promise<IServiceResponse<Dapem>> => {
  const result = await prisma.dapem.create({
    data: {
      tanggal: dapem.tanggal,
      gajiBersih: dapem.gajiBersih,
      tenor: dapem.tenor,
      plafon: dapem.plafon,
      angsuran: dapem.angsuran,
      byAdmin: dapem.byAdmin,
      byTabungan: dapem.byTabungan,
      byMaterai: dapem.byMaterai,
      byTatalaksana: dapem.byTatalaksana,
      blokir: dapem.blokir,
      penalty: dapem.penalty,
      pelunasan: dapem.pelunasan,
      margin: dapem.margin,

      isActive: true,
      createdAt: dapem.createdAt,
      updatedAt: dapem.updatedAt,

      proPemId: dapem.proPemId,
      jePemId: dapem.jePemId,
      userId: dapem.userId,
      detailDapemId: dapem.detailDapemId,
    },
  });

  return { status: 201, msg: "Success", data: result };
};

export const UpdateDapem = async (
  dapem: Dapem
): Promise<IServiceResponse<Dapem>> => {
  const find = await prisma.dapem.findFirst({ where: { id: dapem.id } });
  if (!find) {
    return { status: 404, msg: "Data Pembiayaan Tidak Ditemukan" };
  }
  const result = await prisma.dapem.update({
    where: { id: dapem.id },
    data: {
      tanggal: dapem.tanggal ? dapem.tanggal : find.tanggal,
      gajiBersih: dapem.gajiBersih ? dapem.gajiBersih : find.gajiBersih,
      tenor: dapem.tenor ? dapem.tenor : find.tenor,
      plafon: dapem.plafon ? dapem.plafon : find.plafon,
      angsuran: dapem.angsuran ? dapem.angsuran : find.angsuran,
      byAdmin: dapem.byAdmin ? dapem.byAdmin : find.byAdmin,
      byTabungan: dapem.byTabungan ? dapem.byTabungan : find.byTabungan,
      byMaterai: dapem.byMaterai ? dapem.byMaterai : find.byMaterai,
      byTatalaksana: dapem.byTatalaksana
        ? dapem.byTatalaksana
        : find.byTatalaksana,
      blokir: dapem.blokir ? dapem.blokir : find.blokir,
      penalty: dapem.penalty ? dapem.penalty : find.penalty,
      pelunasan: dapem.pelunasan ? dapem.pelunasan : find.pelunasan,
      margin: dapem.margin ? dapem.margin : find.margin,

      isActive: true,
      createdAt: dapem.createdAt,
      updatedAt: new Date(),

      proPemId: dapem.proPemId ? dapem.proPemId : find.proPemId,
      jePemId: dapem.jePemId ? dapem.jePemId : find.jePemId,
      userId: dapem.userId ? dapem.userId : find.userId,
    },
  });

  return { status: 201, msg: "Success", data: result };
};

export const FindDapem = async (
  page: number,
  pageSize: number,
  filters?: Prisma.DapemWhereInput,
  includes?: Prisma.DapemInclude,
  orderBy?: Prisma.DapemOrderByWithRelationInput
) => {
  const skip = ((page || defaultPage) - 1) * (pageSize || defaultPageSize);
  return await prisma.dapem.findMany({
    where: filters,
    include: includes,
    skip: skip,
    take: pageSize || defaultPageSize,
    orderBy: orderBy,
  });
};
