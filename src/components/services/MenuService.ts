import prisma from "@/components/Prisma";
import { UserMenu } from "@prisma/client";
import { IServiceResponse } from "../IInterfaces";

export const CreateMenu = async (
  userMenu: UserMenu[],
  userId: string
): Promise<IServiceResponse<UserMenu[]>> => {
  const find = await prisma.user.findFirst({ where: { id: userId } });
  if (!find) return { status: 400, msg: "User tidak ditemukan" };

  await prisma.userMenu.createMany({
    data: userMenu.map((um) => {
      return { path: um.path, access: um.access, userId: userId };
    }),
  });
  return { status: 201, msg: "Success", data: userMenu };
};

export const UpdateMenu = async (userMenu: UserMenu[], userId: string) => {
  const find = await prisma.user.findFirst({ where: { id: userId } });
  if (!find) throw new Error("User tidak ditemukan");
  await prisma.userMenu.deleteMany({
    where: { userId: userId },
  });
  const result = await prisma.userMenu.createMany({
    data: userMenu.map((um) => {
      return { path: um.path, access: um.access, userId: userId };
    }),
  });
  return result;
};
