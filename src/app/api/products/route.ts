import { NextRequest, NextResponse } from "next/server";
import { GetProps, getQueryUrl } from "@/components/utils/ServerUtils";
import {
  CreateProduct,
  DeleteProduct,
  FindProduct,
  UpdateProduct,
} from "@/components/services/ProductService";
import { ProPem } from "@prisma/client";

export const GET = async (req: NextRequest) => {
  const filter: GetProps = getQueryUrl(req);

  const data: ProPem[] = await FindProduct(filter.page, filter.pageSize, {
    isActive: true,
    name: { contains: filter.name },
  });
  return NextResponse.json({ msg: "Success", data }, { status: 200 });
};

export const POST = async (req: NextRequest) => {
  try {
    const data: ProPem = await req.json();
    const product = await CreateProduct(data);
    return NextResponse.json(
      {
        msg: product.msg,
        code: product.status,
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

export const PUT = async (req: NextRequest) => {
  const data: ProPem = await req.json();
  try {
    await UpdateProduct(data);
    return NextResponse.json(
      {
        msg: `Data Produk Pembiayaan ${data.name} berhasil diUpdate`,
        status: 200,
      },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { msg: "Internal Server Error", status: 500 },
      { status: 500 }
    );
  }
};

export const DELETE = async (req: NextRequest) => {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json(
      { msg: "Invalid ID. Mohon masukan id produk yang sesuai", status: 400 },
      { status: 400 }
    );
  }
  const del = await DeleteProduct(id);
  if (!del) {
    return NextResponse.json(
      { msg: "Invalid ID. Mohon masukan id produk yang sesuai", status: 400 },
      { status: 400 }
    );
  }
  return NextResponse.json(
    { msg: "Produk berhasil dihapus", status: 200 },
    { status: 200 }
  );
};
