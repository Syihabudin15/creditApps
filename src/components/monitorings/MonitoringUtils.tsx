"use client";
import {
  DatePicker,
  Input,
  Table,
  TableProps,
  Tooltip,
  Typography,
} from "antd";
import moment from "moment";
import { IDRFormat } from "../utils/FunctionUtils";
import { ViewArchive, CreateAkad } from "../utils";
import { useEffect, useState } from "react";
import { IDapem } from "../IInterfaces";
import { CreateOrUpdate, ModalDelete } from "../submissions";
import { ERole, User } from "@prisma/client";
import { useUser } from "../contexts/UserContext";
const { RangePicker } = DatePicker;
const { Paragraph } = Typography;

export const UI = () => {
  const [data, setData] = useState<IDapem[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState<string>();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [rangeDate, setRangeDate] = useState<string[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const user = useUser();

  const getData = async () => {
    setLoading(true);
    await fetch(
      `/api/monitoring?page=${page}&pageSize=${pageSize}${
        rangeDate && rangeDate.length === 2 ? "&rangeDate=" + rangeDate : ""
      }${search ? "&name=" + search : ""}`
    )
      .then((res) => res.json())
      .then((res) => {
        setData(res.data.map((d: IDapem, i: any) => ({ ...d, key: i })));
      })
      .catch((err) => console.log(err));
    const res = await fetch(`/api/users`);
    const { data } = await res.json();
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    let timeout: any;
    (async () => {
      timeout = setTimeout(async () => {
        await getData();
      }, 200);
    })();
    return () => clearTimeout(timeout);
  }, [search, page, pageSize, rangeDate]);
  return (
    <div className="p-1 bg-gray-50 border w-full">
      <TableMonitoring
        dataSource={data}
        loading={loading}
        page={page}
        pageSize={pageSize}
        setPage={setPage}
        setPageSize={setPageSize}
        setSearch={setSearch}
        getData={getData}
        setRangeDate={setRangeDate}
        users={users}
        role={user.role}
      />
    </div>
  );
};

export const TableMonitoring = ({
  dataSource,
  loading,
  setPage,
  page,
  pageSize,
  setPageSize,
  setSearch,
  getData,
  setRangeDate,
  users,
  role,
}: {
  dataSource: IDapem[];
  loading: boolean;
  setPage: Function;
  page: number;
  pageSize: number;
  setPageSize: Function;
  setSearch: Function;
  getData: Function;
  setRangeDate: Function;
  users: User[];
  role: ERole;
}) => {
  const columns: TableProps<IDapem>["columns"] = [
    {
      title: "NO",
      dataIndex: "no",
      key: "no",
      width: 30,
      className: "text-xs text-center",
      onHeaderCell: () => {
        return {
          ["style"]: {
            textAlign: "center",
            fontSize: 12,
          },
        };
      },
      render(value, record, index) {
        return <>{(page - 1) * pageSize + (index + 1)}</>;
      },
    },
    {
      title: "NAMA PEMOHON",
      dataIndex: "namaPemohon",
      key: "namaPemohon",
      className: "text-xs",
      width: 200,
      onHeaderCell: () => {
        return {
          ["style"]: {
            textAlign: "center",
            fontSize: 12,
          },
        };
      },
      render(value, record, index) {
        return <>{record.DetailDapem.DataDebitur.nama}</>;
      },
    },
    {
      title: "NOMOR NIK",
      dataIndex: "nik",
      key: "nik",
      className: "text-xs",
      width: 150,
      onHeaderCell: () => {
        return {
          ["style"]: {
            textAlign: "center",
            fontSize: 12,
          },
        };
      },
      render(value, record, index) {
        return <>{record.DetailDapem.DataDebitur.nik}</>;
      },
    },
    {
      title: "PRODUK PEMBIAYAAN",
      dataIndex: "produk",
      key: "produk",
      className: "text-xs",
      width: 130,
      onHeaderCell: () => {
        return {
          ["style"]: {
            textAlign: "center",
            fontSize: 12,
          },
        };
      },
      render(value, record, index) {
        return <>{record.ProPem.name}</>;
      },
    },
    {
      title: "JENIS PEMBIAYAAN",
      dataIndex: "jenis",
      key: "jenis",
      className: "text-xs",
      width: 120,
      onHeaderCell: () => {
        return {
          ["style"]: {
            textAlign: "center",
            fontSize: 12,
          },
        };
      },
      render(value, record, index) {
        return <>{record.JePem.name}</>;
      },
    },
    {
      title: "PLAFON",
      dataIndex: "plafon",
      key: "plafon",
      width: 130,
      className: "text-right text-xs",
      onHeaderCell: () => {
        return {
          ["style"]: {
            textAlign: "center",
            fontSize: 12,
          },
        };
      },
      sorter: (a: IDapem, b: IDapem) => a.plafon - b.plafon,
      render(value, record, index) {
        return <div>{IDRFormat(record.plafon)}</div>;
      },
    },
    {
      title: "TENOR",
      dataIndex: "tenor",
      key: "tenor",
      width: 80,
      className: "text-center text-xs",
      onHeaderCell: () => {
        return {
          ["style"]: {
            textAlign: "center",
            fontSize: 12,
          },
        };
      },
      render(value, record, index) {
        return <div>{record.tenor}</div>;
      },
    },
    {
      title: "TGL PENGAJUAN",
      dataIndex: "tanggalPengajuan",
      key: "tanggalPengajuan",
      width: 100,
      className: "text-center text-xs",
      onHeaderCell: () => {
        return {
          ["style"]: {
            textAlign: "center",
            fontSize: 12,
          },
        };
      },
      render(value, record, index) {
        return <div>{moment(record.tanggal).format("DD/MM/YYYY")}</div>;
      },
    },
    {
      title: "AKAD KREDIT",
      dataIndex: "akad",
      className: "text-xs",
      key: "akad",
      onHeaderCell: () => {
        return {
          ["style"]: {
            textAlign: "center",
            background: "oklch(0.795 0.184 86.047)",
            color: "oklch(0.967 0.003 264.542)",
            fontSize: 12,
          },
        };
      },
      children: [
        {
          title: "CETAK",
          dataIndex: "cetakAkad",
          key: "cetakAkad",
          className: "text-xs",
          width: 80,
          onHeaderCell: () => {
            return {
              ["style"]: {
                textAlign: "center",
                background: "oklch(0.795 0.184 86.047)",
                color: "oklch(0.967 0.003 264.542)",
                fontSize: 12,
              },
            };
          },
          render(value, record, index) {
            return (
              <div className="flex justify-center gap-1">
                <CreateAkad currData={record} />
                <ViewArchive
                  src={record.DetailDapem.berkasAkad || ""}
                  title={
                    "Berkas Akad " +
                    record.DetailDapem.DataDebitur.nama.toUpperCase()
                  }
                />
              </div>
            );
          },
        },
        {
          title: "TANGGAL",
          dataIndex: "tanggalAkad",
          key: "tanggalAkad",
          className: "text-xs text-center",
          width: 100,
          onHeaderCell: () => {
            return {
              ["style"]: {
                textAlign: "center",
                background: "oklch(0.795 0.184 86.047)",
                color: "oklch(0.967 0.003 264.542)",
                fontSize: 12,
              },
            };
          },
          render(value, record, index) {
            return (
              <>
                {record.DetailDapem.tanggalAkad &&
                  moment(record.DetailDapem.tanggalAkad).format("DD/MM/YYYY")}
              </>
            );
          },
        },
      ],
    },
    {
      title: "STATUS PENGAJUAN",
      dataIndex: "statusPengajuan",
      key: "statusPengajuan",
      className: "text-xs",
      onHeaderCell: () => {
        return {
          ["style"]: {
            textAlign: "center",
            background: "oklch(0.685 0.169 237.323)",
            color: "oklch(0.967 0.003 264.542)",
            fontSize: 12,
          },
        };
      },
      children: [
        {
          title: "STATUS",
          dataIndex: "statusApproval",
          key: "statusApproval",
          className: "text-xs text-center",
          width: 100,
          onHeaderCell: () => {
            return {
              ["style"]: {
                textAlign: "center",
                background: "oklch(0.685 0.169 237.323)",
                color: "oklch(0.967 0.003 264.542)",
                fontSize: 12,
              },
            };
          },
          render(value, record, index) {
            return (
              <div className="flex justify-center text-xs text-gray-50 font-bold ">
                {record.DetailDapem.status === "ANTRI" && (
                  <div className="w-[90%] bg-orange-500 py-1 px-2 rounded-sm">
                    {record.DetailDapem.status}
                  </div>
                )}
                {record.DetailDapem.status === "PENDING" && (
                  <div className="w-[90%] bg-yellow-500 py-1 px-2 rounded-sm">
                    {record.DetailDapem.status}
                  </div>
                )}
                {record.DetailDapem.status === "TOLAK" && (
                  <div className="w-[90%] bg-red-500 py-1 px-2 rounded-sm">
                    {record.DetailDapem.status}
                  </div>
                )}
                {record.DetailDapem.status === "SETUJU" && (
                  <div className="w-[90%] bg-green-500 py-1 px-2 rounded-sm">
                    {record.DetailDapem.status}
                  </div>
                )}
              </div>
            );
          },
        },
        {
          title: "KETERANGAN",
          dataIndex: "ketApproval",
          key: "ketApproval",
          className: "text-xs",
          width: 200,
          onHeaderCell: () => {
            return {
              ["style"]: {
                textAlign: "center",
                background: "oklch(0.685 0.169 237.323)",
                color: "oklch(0.967 0.003 264.542)",
                fontSize: 12,
              },
            };
          },
          render(value, record, index) {
            return (
              <Paragraph
                ellipsis={{
                  rows: 2,
                  expandable: "collapsible",
                }}
                className="text-xs"
              >
                {record.DetailDapem.keterangan}
              </Paragraph>
            );
          },
        },
        {
          title: "TANGGAL",
          dataIndex: "tanggalApproval",
          key: "tanggalApproval",
          className: "text-xs text-center",
          width: 100,
          onHeaderCell: () => {
            return {
              ["style"]: {
                textAlign: "center",
                background: "oklch(0.685 0.169 237.323)",
                color: "oklch(0.967 0.003 264.542)",
                fontSize: 12,
              },
            };
          },
          render(value, record, index) {
            return (
              <>
                {record.DetailDapem.tanggalStatus &&
                  moment(record.DetailDapem.tanggalStatus).format("DD/MM/YYYY")}
              </>
            );
          },
        },
      ],
    },
    {
      title: "STATUS PENCAIRAN",
      dataIndex: "statusPencairan",
      key: "statusPencairan",
      className: "text-xs text-center",
      onHeaderCell: () => {
        return {
          ["style"]: {
            textAlign: "center",
            background: "oklch(0.723 0.219 149.579)",
            color: "oklch(0.967 0.003 264.542)",
            fontSize: 12,
          },
        };
      },
      children: [
        {
          title: "STATUS",
          dataIndex: "statusPencairan",
          key: "statusPencairan",
          className: "text-xs text-center",
          width: 100,
          onHeaderCell: () => {
            return {
              ["style"]: {
                textAlign: "center",
                background: "oklch(0.723 0.219 149.579)",
                color: "oklch(0.967 0.003 264.542)",
                fontSize: 12,
              },
            };
          },
          render(value, record, index) {
            return (
              <div className="flex justify-center text-xs text-gray-50 font-bold ">
                {record.DetailDapem.statusCair === "ANTRI" && (
                  <div className="w-[90%] bg-orange-500 py-1 px-2 rounded-sm">
                    {record.DetailDapem.statusCair}
                  </div>
                )}
                {record.DetailDapem.statusCair === "PENDING" && (
                  <div className="w-[90%] bg-yellow-500 py-1 px-2 rounded-sm">
                    {record.DetailDapem.statusCair}
                  </div>
                )}
                {record.DetailDapem.statusCair === "PROSES" && (
                  <div className="w-[90%] bg-blue-500 py-1 px-2 rounded-sm">
                    {record.DetailDapem.statusCair}
                  </div>
                )}
                {record.DetailDapem.statusCair === "BATAL" && (
                  <div className="w-[90%] bg-red-500 py-1 px-2 rounded-sm">
                    {record.DetailDapem.statusCair}
                  </div>
                )}
                {record.DetailDapem.statusCair === "SELESAI" && (
                  <div className="w-[90%] bg-green-500 py-1 px-2 rounded-sm">
                    {record.DetailDapem.statusCair}
                  </div>
                )}
              </div>
            );
          },
        },
        {
          title: "TANGGAL ",
          dataIndex: "tanggalPencairan",
          key: "tanggalPencairan",
          className: "text-xs",
          width: 100,
          onHeaderCell: () => {
            return {
              ["style"]: {
                textAlign: "center",
                background: "oklch(0.723 0.219 149.579)",
                color: "oklch(0.967 0.003 264.542)",
                fontSize: 12,
              },
            };
          },
          render(value, record, index) {
            return (
              <>
                {record.DetailDapem.tanggalCair &&
                  moment(record.DetailDapem.tanggalCair).format("DD/MM/YYYY")}
              </>
            );
          },
        },
      ],
    },
    {
      title: "AKSI",
      dataIndex: "aksi",
      key: "aksi",
      width: 100,
      className: "text-center text-xs",
      onHeaderCell: () => {
        return {
          ["style"]: {
            textAlign: "center",
            fontSize: 12,
          },
        };
      },
      render(value, record, index) {
        return (
          <div className="flex justify-center gap-2">
            <Tooltip title="Update">
              <CreateOrUpdate
                action={
                  role === "ADMIN"
                    ? "Update"
                    : role === "MARKETING"
                    ? "View"
                    : "Proses"
                }
                currData={record}
                users={users}
                getData={getData}
              />
            </Tooltip>
            <Tooltip title="Hapus">
              <ModalDelete data={record} getData={getData} />
            </Tooltip>
          </div>
        );
      },
    },
  ];
  return (
    <div>
      <Table
        columns={columns}
        size="small"
        bordered
        loading={loading}
        dataSource={dataSource}
        scroll={{ x: "max-content", y: 370 }}
        pagination={{
          size: "small",
          pageSizeOptions: [20, 50, 100, 500, 1000, 10000],
          defaultPageSize: pageSize,
          onChange(page, pageSize) {
            setPage(page);
            setPageSize(pageSize);
          },
        }}
        title={() => (
          <div>
            <div className="font-bold text-xl text-green-500 border-b">
              Monitoring
            </div>
            <div className="py-1 flex flex-col sm:flex-row gap-2 justify-between sm:items-end">
              <div className="flex-1 flex items-end gap-2 flex-wrap">
                <RangePicker
                  size="small"
                  onChange={(_, dateString) =>
                    setRangeDate([dateString[0], dateString[1]])
                  }
                />
              </div>
              <div className="flex-2">
                <Input.Search
                  placeholder="search"
                  size="small"
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}
        summary={(pageData) => {
          let plafond = 0;

          pageData.forEach((pd, i) => {
            plafond += pd.plafon;
          });
          return (
            <Table.Summary.Row className="bg-blue-500 text-white text-center text-xs">
              <Table.Summary.Cell index={1} className="text-center">
                Summary
                <></>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2}></Table.Summary.Cell>
              <Table.Summary.Cell index={3}></Table.Summary.Cell>
              <Table.Summary.Cell index={4}></Table.Summary.Cell>
              <Table.Summary.Cell index={5}></Table.Summary.Cell>
              <Table.Summary.Cell index={6} className="text-right">
                {IDRFormat(plafond)}
              </Table.Summary.Cell>
              <Table.Summary.Cell index={7}></Table.Summary.Cell>
              <Table.Summary.Cell index={8}></Table.Summary.Cell>
              <Table.Summary.Cell index={9}></Table.Summary.Cell>
              <Table.Summary.Cell index={10}></Table.Summary.Cell>
              <Table.Summary.Cell index={11}></Table.Summary.Cell>
              <Table.Summary.Cell index={12}></Table.Summary.Cell>
              <Table.Summary.Cell index={13}></Table.Summary.Cell>
              <Table.Summary.Cell index={14}></Table.Summary.Cell>
              <Table.Summary.Cell index={15}></Table.Summary.Cell>
              <Table.Summary.Cell index={16}></Table.Summary.Cell>
            </Table.Summary.Row>
          );
        }}
      />
    </div>
  );
};
