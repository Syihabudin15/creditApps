import { JePem, Prisma } from "@prisma/client";
import { IServiceResponse } from "../IInterfaces";
import prisma from "../Prisma";
import { defaultPage, defaultPageSize } from "../utils/ServerUtils";

export const CreateJePem = async (
  data: JePem
): Promise<IServiceResponse<JePem>> => {
  const result = await prisma.jePem.create({
    data: {
      name: data.name,
      penalty: data.penalty,
    },
  });
  return {
    code: 201,
    data: result,
    msg: "Jenis Biaya berhasil ditambahkan",
  };
};

export const FindJePem = async (
  page: number,
  pageSize: number,
  filters?: Prisma.JePemWhereInput,
  includes?: Prisma.JePemInclude,
  orderBy?: Prisma.JePemOrderByWithRelationInput
) => {
  const skip = ((page || defaultPage) - 1) * (pageSize || defaultPageSize);

  return await prisma.jePem.findMany({
    where: filters,
    include: includes,
    skip: skip,
    take: parseInt(pageSize.toString()) || defaultPageSize,
    orderBy: orderBy,
  });
};

export const DeleteJePem = async (id: string) => {
  const find = await prisma.jePem.findFirst({ where: { id: id } });
  if (find) {
    await prisma.jePem.update({
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
