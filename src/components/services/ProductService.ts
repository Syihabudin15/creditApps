import { Prisma, ProPem } from "@prisma/client";
import { IServiceResponse } from "../IInterfaces";
import prisma from "../Prisma";
import { defaultPage, defaultPageSize } from "../utils/ServerUtils";

export const CreateProduct = async (
  data: ProPem
): Promise<IServiceResponse<ProPem>> => {
  const result = await prisma.proPem.create({
    data: {
      name: data.name,
      maxTenor: data.maxTenor,
      maxPlafon: data.maxPlafon,
      byAdmin: data.byAdmin,
      byTabungan: data.byTabungan,
      byMaterai: data.byMaterai,
      byTatalaksana: data.byTatalaksana,
      margin: data.margin,
      unit: data.unit,
    },
  });
  return {
    code: 201,
    data: result,
    msg: "Produk berhasil ditambahkan",
  };
};

export const FindProduct = async (
  page: number,
  pageSize: number,
  filters?: Prisma.ProPemWhereInput,
  includes?: Prisma.ProPemInclude,
  orderBy?: Prisma.ProPemOrderByWithRelationInput
) => {
  const skip = ((page || defaultPage) - 1) * (pageSize || defaultPageSize);

  return await prisma.proPem.findMany({
    where: filters,
    include: includes,
    skip: skip,
    take: parseInt(pageSize.toString()) || defaultPageSize,
    orderBy: orderBy,
  });
};

export const DeleteProduct = async (id: string) => {
  const find = await prisma.proPem.findFirst({ where: { id: id } });
  if (find) {
    await prisma.proPem.update({
      where: { id: id },
      data: {
        isActive: false,
        updatedAt: new Date(),
      },
    });
    return find;
  }
  return null;
};
