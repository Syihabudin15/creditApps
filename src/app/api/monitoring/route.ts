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
        status: { not: "SAVED" },
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

// export const POST = async (req: NextRequest) => {
//   const data: IDapem = await req.json();
//   try {
//     await prisma.$transaction(async () => {
//       const debitur = await CreateDebitur(data.DetailDapem.DataDebitur);
//       await CreateKeluarga({
//         ...data.DetailDapem.DataDebitur.DataKeluarga[0],
//         dataDebiturId: debitur.data?.id || "",
//       });
//       const detailDapem = await CreateDetailDapem({
//         ...data.DetailDapem,
//         dataDebiturId: debitur.data?.id || "",
//       });
//       await CreateDapem({
//         ...data,
//         detailDapemId: detailDapem.data?.id || "",
//       });
//     });
//     return NextResponse.json(
//       { status: 201, msg: "Data pengajuan berhasil ditambahkan", data },
//       { status: 201 }
//     );
//   } catch (err) {
//     console.log(err);
//     return NextResponse.json(
//       { status: 500, msg: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// };

// export const PUT = async (req: NextRequest) => {
//   const data: IDapem = await req.json();
//   try {
//     await prisma.$transaction(async () => {
//       const debitur = await CreateDebitur(data.DetailDapem.DataDebitur);
//       await CreateKeluarga({
//         ...data.DetailDapem.DataDebitur.DataKeluarga[0],
//         dataDebiturId: debitur.data?.id || "",
//       });
//       await UpdateDetailDapem(data.DetailDapem);
//       await UpdateDapem(data);
//     });
//     return NextResponse.json(
//       { status: 201, msg: "Data pengajuan berhasil diUpdate", data },
//       { status: 201 }
//     );
//   } catch (err) {
//     console.log(err);
//     return NextResponse.json(
//       { status: 500, msg: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// };

// export const DELETE = async (req: NextRequest) => {
//   const id = req.nextUrl.searchParams.get("id");
//   const action: "DEL" | "SEND" =
//     <any>req.nextUrl.searchParams.get("action") || "SEND";
//   // DeleteDapem
//   // Delete Detail Dapem
//   try {
//   } catch (err) {
//     console.log(err);
//     return NextResponse.json(
//       { status: 500, msg: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// };
