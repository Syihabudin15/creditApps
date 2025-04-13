import { NotificationItems } from "@/components/IInterfaces";
import prisma from "@/components/Prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const data = await prisma.dapem.findMany({
    where: { isActive: true },
    include: {
      DetailDapem: true,
    },
  });
  const antrian = data.filter((d) => d.DetailDapem?.status === "ANTRI");
  const akad = data.filter(
    (d) =>
      d.DetailDapem?.status === "SETUJU" &&
      (d.DetailDapem.noAkad === null || d.DetailDapem.berkasAkad === null)
  );
  const cair = data.filter(
    (d) =>
      d.DetailDapem?.statusCair === "PROSES" &&
      (d.DetailDapem.noAkad !== null || d.DetailDapem.berkasAkad !== null)
  );
  return NextResponse.json(
    {
      msg: "Success",
      data: {
        akad: akad.length,
        antrian: antrian.length,
        cair: cair.length,
      } as NotificationItems,
    },
    { status: 200 }
  );
};
