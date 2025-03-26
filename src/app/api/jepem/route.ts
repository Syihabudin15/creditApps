import { NextRequest, NextResponse } from "next/server";
import { GetProps, getQueryUrl } from "@/components/utils/ServerUtils";
import { JePem } from "@prisma/client";
import {
  CreateJePem,
  DeleteJePem,
  FindJePem,
} from "@/components/services/JenisService";

export const GET = async (req: NextRequest) => {
  const filter: GetProps = getQueryUrl(req);

  const data: JePem[] = await FindJePem(filter.page, filter.pageSize, {
    isActive: true,
    name: { contains: filter.name },
  });
  return NextResponse.json({ msg: "Success", data }, { status: 200 });
};

export const POST = async (req: NextRequest) => {
  try {
    const data: JePem = await req.json();
    const jepem = await CreateJePem(data);
    return NextResponse.json(
      {
        msg: jepem.msg,
        code: jepem.code,
      },
      { status: 201 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { msg: "Internal Server Error", code: 500 },
      { status: 500 }
    );
  }
};

export const DELETE = async (req: NextRequest) => {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json(
      {
        msg: "Invalid ID. Mohon masukan id Jenis Pembiayaan yang sesuai",
        status: 400,
      },
      { status: 400 }
    );
  }
  const del = await DeleteJePem(id);
  if (!del) {
    return NextResponse.json(
      {
        msg: "Invalid ID. Mohon masukan id Jenis Pembiayaan yang sesuai",
        status: 400,
      },
      { status: 400 }
    );
  }
  return NextResponse.json(
    { msg: "Jenis Pembiayaan berhasil dihapus", status: 200 },
    { status: 200 }
  );
};
