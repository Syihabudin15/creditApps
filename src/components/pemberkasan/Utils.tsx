"use client";
import {
  Button,
  DatePicker,
  Input,
  Modal,
  Table,
  TableProps,
  Tooltip,
} from "antd";
import moment from "moment";
import { IDRFormat } from "../utils/FunctionUtils";
import { InputUtil, NotificationModal, ViewArchive } from "../utils";
import { useEffect, useState } from "react";
import { IDapem } from "../IInterfaces";
import { CreateOrUpdate, FileUpload } from "../submissions";
import { User } from "@prisma/client";
import { FormOutlined } from "@ant-design/icons";
import { ModalMessageProps } from "../utils/ServerUtils";
const { RangePicker } = DatePicker;

export const UI = () => {
  const [data, setData] = useState<IDapem[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState<string>();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [rangeDate, setRangeDate] = useState<string[]>([]);
  const [users, setUsers] = useState<User[]>([]);

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
      <TableNominatif
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
      />
    </div>
  );
};

export const TableNominatif = ({
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
      fixed: window.innerWidth > 600 ? "left" : false,
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
      title: "BIAYA ADMIN",
      dataIndex: "admin",
      key: "admin",
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
      render(value, record, index) {
        return <div>{IDRFormat(record.byAdmin)}</div>;
      },
    },
    {
      title: "BIAYA TABUNGAN",
      dataIndex: "tabungan",
      key: "tabungan",
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
      render(value, record, index) {
        return <div>{IDRFormat(record.byTabungan)}</div>;
      },
    },
    {
      title: "PELUNASAN",
      dataIndex: "pelunasan",
      key: "pelunasan",
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
      render(value, record, index) {
        return <div>{IDRFormat(record.pelunasan)}</div>;
      },
    },
    {
      title: "PENALTY PELUNASAN",
      dataIndex: "penalty",
      key: "penalty",
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
      render(value, record, index) {
        return <div>{IDRFormat(record.penalty)}</div>;
      },
    },
    {
      title: "ANGSURAN",
      dataIndex: "angsuran",
      key: "angsuran",
      className: "text-right text-xs",
      onHeaderCell: () => {
        return {
          ["style"]: {
            textAlign: "center",
            fontSize: 12,
          },
        };
      },
      children: [
        {
          title: "NOMINAL",
          dataIndex: "nominal",
          key: "nominal",
          className: "text-right text-xs",
          width: 100,
          onHeaderCell: () => {
            return {
              ["style"]: {
                textAlign: "center",
                fontSize: 12,
              },
            };
          },
          render(value, record, index) {
            return <div>{IDRFormat(record.angsuran)}</div>;
          },
        },
        {
          title: "BLOKIR",
          dataIndex: "blokir",
          key: "blokir",
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
            return <div>{record.blokir}</div>;
          },
        },
        {
          title: "T_BLOKIR",
          dataIndex: "nominalBlokir",
          key: "nominalBlokir",
          className: "text-right text-xs",
          width: 100,
          onHeaderCell: () => {
            return {
              ["style"]: {
                textAlign: "center",
                fontSize: 12,
              },
            };
          },
          render(value, record, index) {
            return <div>{IDRFormat(record.angsuran * record.blokir)}</div>;
          },
        },
      ],
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
            fontSize: 12,
          },
        };
      },
      children: [
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
        {
          title: "NOMOR AKAD",
          dataIndex: "noAkad",
          key: "noAkad",
          className: "text-xs text-center",
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
            return <>{record.DetailDapem.noAkad}</>;
          },
        },
      ],
    },
    {
      title: "BERKAS - BERKAS",
      dataIndex: "berkasBerkas",
      className: "text-xs",
      key: "berkasBerkas",
      onHeaderCell: () => {
        return {
          ["style"]: {
            textAlign: "center",
            fontSize: 12,
          },
        };
      },
      children: [
        {
          title: "PENGAJUAN",
          dataIndex: "pengajuan",
          key: "pengajuan",
          className: "text-xs",
          width: 100,
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
              <div className="flex justify-center gap-1">
                <ViewArchive
                  src={record.DetailDapem.berkasPengajuan || ""}
                  title={
                    "BERKAS PENGAJUAN " +
                    record.DetailDapem.DataDebitur.nama.toUpperCase()
                  }
                />
              </div>
            );
          },
        },
        {
          title: "WAWANCARA",
          dataIndex: "wawancara",
          key: "wawancara",
          className: "text-xs",
          width: 100,
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
              <div className="flex justify-center gap-1">
                <ViewArchive
                  src={record.DetailDapem.videoWawancara || ""}
                  title={
                    "VIDEO WAWANCARA " +
                    record.DetailDapem.DataDebitur.nama.toUpperCase()
                  }
                />
              </div>
            );
          },
        },
        {
          title: "AKAD",
          dataIndex: "berkasAkad",
          key: "berkasAkad",
          className: "text-xs",
          width: 100,
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
              <div className="flex justify-center gap-1">
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
          title: "PENCAIRAN 1",
          dataIndex: "pencairan1",
          key: "pencairan1",
          className: "text-xs",
          width: 100,
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
              <div className="flex justify-center gap-1">
                <ViewArchive
                  src={record.DetailDapem.buktiPencairan || ""}
                  title={
                    "BUKTI CAIR 1 " +
                    record.DetailDapem.DataDebitur.nama.toUpperCase()
                  }
                />
              </div>
            );
          },
        },
        {
          title: "PENCAIRAN 2",
          dataIndex: "pencairan2",
          key: "pencairan2",
          className: "text-xs",
          width: 100,
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
              <div className="flex justify-center gap-1">
                <ViewArchive
                  src={record.DetailDapem.buktiPencairan1 || ""}
                  title={
                    "BUKTI CAIR 2 " +
                    record.DetailDapem.DataDebitur.nama.toUpperCase()
                  }
                />
              </div>
            );
          },
        },
        {
          title: "FEE",
          dataIndex: "fee",
          key: "fee",
          className: "text-xs",
          width: 100,
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
              <div className="flex justify-center gap-1">
                <ViewArchive
                  src={record.DetailDapem.buktiFee || ""}
                  title={
                    "BUKTI FEE " +
                    record.DetailDapem.DataDebitur.nama.toUpperCase()
                  }
                />
              </div>
            );
          },
        },
      ],
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
      title: "TANGGAL PENCAIRAN",
      dataIndex: "tanggalPencairan",
      key: "tanggalPencairan",
      className: "text-xs",
      width: 100,
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
          <>
            {record.DetailDapem.tanggalCair &&
              moment(record.DetailDapem.tanggalCair).format("DD/MM/YYYY")}
          </>
        );
      },
    },
    {
      title: "AKSI",
      dataIndex: "aksi",
      key: "aksi",
      width: 100,
      className: "text-center text-xs",
      fixed: window.innerWidth > 600 ? "right" : false,
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
            <Tooltip title="Upload Berkas">
              <Uploaders currData={record} getData={getData} />
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
              Management Berkas
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
          let admin = 0;
          let tabungan = 0;
          let pelunasan = 0;
          let penalty = 0;
          let angsuran = 0;

          pageData.forEach((pd, i) => {
            plafond += pd.plafon;
            admin += pd.byAdmin;
            tabungan += pd.byTabungan;
            pelunasan += pd.pelunasan;
            penalty += pd.plafon * (pd.penalty / 100);
            angsuran += pd.angsuran;
          });
          return (
            <Table.Summary.Row className="text-xs bg-blue-500 text-gray-50">
              {columns.map((c, i) => (
                <Table.Summary.Cell index={i} key={i} className={"text-right"}>
                  {c.key === "no" && <>Summary</>}
                  {c.key === "plafon" && <>{IDRFormat(plafond)}</>}
                  {c.key === "admin" && <>{IDRFormat(admin)}</>}
                  {c.key === "tabungan" && <>{IDRFormat(tabungan)}</>}
                  {c.key === "pelunasan" && <>{IDRFormat(pelunasan)}</>}
                  {c.key === "penalty" && <>{IDRFormat(penalty)}</>}
                  {c.key === "angsuran" && <>{IDRFormat(angsuran)}</>}
                  {(![
                    "no",
                    "plafon",
                    "admin",
                    "tabungan",
                    "pelunasan",
                    "penalty",
                  ].includes(c.key as string) ||
                    !c.key) && <></>}
                </Table.Summary.Cell>
              ))}
            </Table.Summary.Row>
          );
        }}
      />
    </div>
  );
};

export const Uploaders = ({
  currData,
  getData,
}: {
  currData: IDapem;
  getData: Function;
}) => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<IDapem>(currData);
  const [loading, setLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState<ModalMessageProps>({
    title: "",
    type: "error",
    desc: "",
    show: false,
  });

  const handleUploads = async () => {
    setLoading(true);
    await fetch("/api/dapem", {
      method: "PUT",
      headers: { "Content-type": "Application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res) => {
        setOpen(false);
        setModalMessage({
          show: true,
          type: res.status === 200 || res.status === 201 ? "success" : "error",
          title:
            res.status === 200 || res.status === 201 ? "BERHASIL" : "ERROR",
          desc: res.msg,
        });
        getData();
      })
      .catch((err) => {
        console.log(err);
        setModalMessage({
          show: true,
          type: "error",
          title: "Internal Server Error",
          desc: (
            <div>
              <p>
                Gagal menambahkan pengajuan karena adanya kesalahan. mohon cek
                kembali dan pastikan semua data diisi dengan baik!
              </p>
              <p>
                Apabila hal ini tidak dapat diatasi mohon hubungi tim IT
                KOPJASFAS
              </p>
            </div>
          ),
        });
      });
    setLoading(false);
  };

  return (
    <div>
      <Button
        onClick={() => setOpen(true)}
        type="primary"
        icon={<FormOutlined />}
        size="small"
      ></Button>
      <Modal
        title={
          "UPLOAD BERKAS-BERKAS " +
          currData.DetailDapem.DataDebitur.nama.toUpperCase()
        }
        open={open}
        onCancel={() => setOpen(false)}
        onClose={() => setOpen(false)}
        footer={[
          <Button
            key={"upload"}
            type="primary"
            onClick={() => handleUploads()}
            loading={loading}
            size="small"
          >
            Submit
          </Button>,
        ]}
      >
        <div className="my-5 flex flex-col gap-1">
          {data.DetailDapem.noAkad ? (
            <FileUpload
              fileType={"application/pdf"}
              label="Berkas Akad (PDF)"
              currData={data.DetailDapem.berkasAkad || ""}
              onChange={(e: string) =>
                setData((prev) => ({
                  ...prev,
                  DetailDapem: {
                    ...prev.DetailDapem,
                    berkasAkad: e,
                  },
                }))
              }
            />
          ) : (
            <div className="flex gap-2">
              <p className="w-44">Berkas Akad</p>
              <p className="text-red-500 text-xs">
                Mohon cetak akad terlebih dahulu pada halaman monitoring!
              </p>
            </div>
          )}
          <FileUpload
            fileType={"application/pdf"}
            label="Bukti Cair 1 (PDF)"
            currData={data.DetailDapem.buktiPencairan || ""}
            onChange={(e: string) =>
              setData((prev) => ({
                ...prev,
                DetailDapem: {
                  ...prev.DetailDapem,
                  buktiPencairan: e,
                },
              }))
            }
          />
          <FileUpload
            fileType={"application/pdf"}
            label="Bukti Cair 2 (PDF)"
            currData={data.DetailDapem.buktiPencairan1 || ""}
            onChange={(e: string) =>
              setData((prev) => ({
                ...prev,
                DetailDapem: {
                  ...prev.DetailDapem,
                  buktiPencairan1: e,
                },
              }))
            }
          />
          <FileUpload
            fileType={"video/mp4"}
            label="Bukti Cair 3 (MP4)"
            currData={data.DetailDapem.buktiPencairan2 || ""}
            onChange={(e: string) =>
              setData((prev) => ({
                ...prev,
                DetailDapem: {
                  ...prev.DetailDapem,
                  buktiPencairan2: e,
                },
              }))
            }
          />
          <FileUpload
            fileType={"application/pdf"}
            label="Bukti Fee (PDF)"
            currData={data.DetailDapem.buktiFee || ""}
            onChange={(e: string) =>
              setData((prev) => ({
                ...prev,
                DetailDapem: {
                  ...prev.DetailDapem,
                  buktiFee: e,
                },
              }))
            }
          />
        </div>
      </Modal>
      <NotificationModal data={modalMessage} setData={setModalMessage} />
    </div>
  );
};
