import { FindDapem } from "@/components/services/DapemService";
import { GetProps, getQueryUrl } from "@/components/utils/ServerUtils";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const filter: GetProps = getQueryUrl(req);

  const data = await FindDapem(
    filter.page,
    filter.pageSize,
    {
      isActive: true,
      DetailDapem: {
        OR: [
          { statusCair: "SELESAI" },
          { statusCair: "PROSES", berkasAkad: { not: null } },
        ],
      },
      tanggal: {
        gte: new Date(filter.tanggal[0]).toISOString(),
        lte: new Date(filter.tanggal[1]).toISOString(),
      },
      OR: [
        {
          DetailDapem: {
            DataDebitur: {
              OR: [
                { nama: filter.name },
                { nik: filter.name },
                { noKK: filter.name },
              ],
            },
          },
        },
      ],
    },
    {
      DetailDapem: {
        include: {
          DataDebitur: { include: { DataKeluarga: true } },
          User: true,
        },
      },
      ProPem: true,
      User: true,
      JePem: true,
    },
    { createdAt: "desc" }
  );
  return NextResponse.json({ msg: "Success", data }, { status: 200 });
};
