import prisma from "@/components/Prisma";
import { NextRequest, NextResponse } from "next/server";
import {
  CreateUser,
  DeleteUser,
  FindUser,
  UpdateUser,
} from "@/components/services/UserService";
import { CreateMenu, UpdateMenu } from "@/components/services/MenuService";
import { IUser } from "@/components/IInterfaces";
import { GetProps, getQueryUrl } from "@/components/utils/ServerUtils";

export const GET = async (req: NextRequest) => {
  const filter: GetProps = getQueryUrl(req);
  const data = await FindUser(
    filter.page,
    filter.pageSize,
    {
      OR: [
        { namaLengkap: { contains: filter.name } },
        { nip: { contains: filter.name } },
      ],
    },
    { UserMenu: true },
    { createdAt: "desc" }
  );
  return NextResponse.json({ msg: "Success", data }, { status: 200 });
};

export const POST = async (req: NextRequest) => {
  try {
    const data: IUser = await req.json();
    const trx = await prisma.$transaction(async (tx) => {
      const user = await CreateUser(data);
      await CreateMenu(data.UserMenu, user.data ? user.data.id : "");
      return user;
    });
    if (trx.status !== 201) {
      return NextResponse.json(
        { msg: trx.msg, status: trx.status },
        { status: trx.status }
      );
    }
    return NextResponse.json(
      {
        msg: "Berhasil menambahkan data karyawan baru",
        status: trx.status,
      },
      { status: 201 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { msg: "Username, email atau no telepon sudah digunakan!", code: 500 },
      { status: 500 }
    );
  }
};

export const PUT = async (req: NextRequest) => {
  try {
    const data: IUser = await req.json();
    const trx = await prisma.$transaction(async (tx) => {
      const user = await UpdateUser(data);
      await UpdateMenu(data.UserMenu, data.id);
      return user;
    });
    return NextResponse.json(
      {
        msg: trx.msg,
        status: trx.status,
      },
      { status: trx.status }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { msg: "Username, email atau no telepon sudah digunakan!", code: 500 },
      { status: 500 }
    );
  }
};

export const DELETE = async (req: NextRequest) => {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json(
      { msg: "Invalid ID. Mohon masukan id user yang valid!", status: 404 },
      { status: 404 }
    );
  }
  await DeleteUser(id);
  return NextResponse.json(
    { msg: "Data User berhasil dihapus", status: 200 },
    { status: 200 }
  );
};
