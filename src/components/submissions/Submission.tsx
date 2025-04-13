"use client";
import { Button, Input, Modal, Table, TableProps, Tooltip } from "antd";
import { IDRFormat } from "../utils/FunctionUtils";
import { CheckCircleFilled, DeleteFilled } from "@ant-design/icons";
import { CreateOrUpdate } from "./index";
import { IDapem } from "../IInterfaces";
import { useEffect, useState } from "react";
import { Estatus, User } from "@prisma/client";
import moment from "moment";
import { ModalMessageProps } from "../utils/ServerUtils";
import { InputUtil, NotificationModal } from "../utils";

export const UI = () => {
  const [data, setData] = useState<IDapem[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState<string>();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [users, setUsers] = useState<User[]>([]);

  const getData = async () => {
    setLoading(true);
    await fetch(
      `/api/dapem?page=${page}&pageSize=${pageSize}${
        search ? "&name=" + search : ""
      }`
    )
      .then((res) => res.json())
      .then((res) => {
        setData(res.data.map((d: IDapem, i: any) => ({ ...d, key: i })));
      })
      .catch((err) => console.log(err));
    setLoading(false);
  };

  useEffect(() => {
    let timeout: any;
    (async () => {
      const res = await fetch(`/api/users`);
      const { data } = await res.json();
      setUsers(data);
      timeout = setTimeout(async () => {
        await getData();
      }, 200);
    })();
    return () => clearTimeout(timeout);
  }, [search, page, pageSize]);

  return (
    <div className="p-1 bg-gray-50 border w-full">
      <TableSubmission
        dataSource={data}
        loading={loading}
        page={page}
        pageSize={pageSize}
        setPage={setPage}
        setPageSize={setPageSize}
        setSearch={setSearch}
        users={users}
        getData={getData}
      />
    </div>
  );
};

export const TableSubmission = ({
  dataSource,
  loading,
  setPage,
  page,
  pageSize,
  setPageSize,
  setSearch,
  users,
  getData,
}: {
  dataSource: IDapem[];
  loading: boolean;
  setPage: Function;
  page: number;
  pageSize: number;
  setPageSize: Function;
  setSearch: Function;
  users: User[];
  getData: Function;
}) => {
  const columns: TableProps<IDapem>["columns"] = [
    {
      title: "NO",
      dataIndex: "no",
      key: "no",
      width: 30,
      className: "text-xs",
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
          <div className="text-center">
            {(page - 1) * pageSize + (index + 1)}
          </div>
        );
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
                action="Update"
                currData={record}
                users={users}
                getData={getData}
              />
            </Tooltip>
            <Tooltip title="Ajukan">
              <ModalSendMonitoring data={record} getData={getData} />
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
        dataSource={dataSource}
        loading={loading}
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
              Data Pengajuan
            </div>
            <div className="py-1 flex flex-col sm:flex-row gap-2 justify-between sm:items-end">
              <div className="flex-1 flex items-end gap-2 flex-wrap">
                <CreateOrUpdate users={users} getData={getData} />
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
            <Table.Summary.Row className="bg-green-500 text-white text-center text-xs">
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
            </Table.Summary.Row>
          );
        }}
      />
    </div>
  );
};

const ModalSendMonitoring = ({
  data,
  getData,
}: {
  data: IDapem;
  getData: Function;
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState<ModalMessageProps>({
    title: "",
    type: "error",
    desc: "",
    show: false,
  });

  const handleSend = async () => {
    setLoading(true);
    await fetch("/api/dapem", {
      method: "PUT",
      headers: { "Content-type": "Application/json" },
      body: JSON.stringify({
        ...data,
        DetailDapem: { ...data.DetailDapem, status: "ANTRI" },
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        setOpen(false);
        setModalMessage({
          show: true,
          type: res.status === 200 || res.status === 201 ? "success" : "error",
          title:
            res.status === 200 || res.status === 201 ? "BERHASIL" : "ERROR",
          desc: (
            <div className="my-4">
              <p>
                Data berhasil dikirim ke Tim Pusat dan dapat dipantau dihalaman
                monitoring untuk keterangan proses selanjutnya.
              </p>
            </div>
          ),
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
                Gagal mengirimkan pengajuan ke pusat. Mohon periksa koneksi
                internet anda dan coba lagi!
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
        icon={<CheckCircleFilled />}
        size="small"
        type="primary"
        onClick={() => setOpen(true)}
      ></Button>
      <Modal
        title={"Konfirmasi Data Pengajuan"}
        open={open}
        onClose={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        footer={[
          <Button
            key={"send"}
            type="primary"
            onClick={() => handleSend()}
            loading={loading}
          >
            Kirim
          </Button>,
        ]}
      >
        <div className="my-4">
          <div className="m-4 flex flex-col gap-2">
            <div className="flex gap-2">
              <p className="w-44">Nomor NIK</p>
              <p className="w-4">:</p>
              <p>{data.DetailDapem.DataDebitur.nik}</p>
            </div>
            <div className="flex gap-2">
              <p className="w-44">Nama Lengkap</p>
              <p className="w-4">:</p>
              <p>{data.DetailDapem.DataDebitur.nama}</p>
            </div>
          </div>
          <p>
            Konfirmasi apakah data sudah lengkap dan sesuai prosedur untuk
            diproses lebih lanjut?
          </p>
          <p>
            Setelah menekan tombol kirim, data ini akan dikirim ke Tim Pusat
            untuk diperiksa dan dilakukan proses diterima/ditolak
          </p>
        </div>
      </Modal>
      <NotificationModal data={modalMessage} setData={setModalMessage} />
    </div>
  );
};

export const ModalDelete = ({
  data,
  getData,
}: {
  data: IDapem;
  getData: Function;
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState<ModalMessageProps>({
    title: "",
    type: "error",
    desc: "",
    show: false,
  });

  const handleDelete = async () => {
    setLoading(true);
    await fetch("/api/dapem", {
      method: "PUT",
      headers: { "Content-type": "Application/json" },
      body: JSON.stringify({
        ...data,
        isActive: false,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        setOpen(false);
        setModalMessage({
          show: true,
          type: res.status === 200 || res.status === 201 ? "success" : "error",
          title:
            res.status === 200 || res.status === 201 ? "BERHASIL" : "ERROR",
          desc: (
            <div className="my-4">
              <p>Data berhasil dihapus.</p>
            </div>
          ),
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
                Gagal menghapus data pengajuan. Mohon periksa koneksi internet
                anda dan coba lagi!
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
        icon={<DeleteFilled />}
        size="small"
        type="primary"
        danger
        onClick={() => setOpen(true)}
      ></Button>
      <Modal
        title={"Konfirmasi Data Pengajuan"}
        open={open}
        onClose={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        footer={[
          <Button
            key={"delete"}
            type="primary"
            onClick={() => handleDelete()}
            loading={loading}
          >
            Hapus
          </Button>,
        ]}
      >
        <div className="my-4">
          <p>Konfirmasi apakah yakin untuk menghapus data pengajuan ini?</p>
          <div className="m-4 flex flex-col gap-2">
            <div className="flex gap-2">
              <p className="w-44">Nomor NIK</p>
              <p className="w-4">:</p>
              <p>{data.DetailDapem.DataDebitur.nik}</p>
            </div>
            <div className="flex gap-2">
              <p className="w-44">Nama Lengkap</p>
              <p className="w-4">:</p>
              <p>{data.DetailDapem.DataDebitur.nama}</p>
            </div>
          </div>
        </div>
      </Modal>
      <NotificationModal data={modalMessage} setData={setModalMessage} />
    </div>
  );
};

export const ProsesPengajuan = ({
  currData,
  setData,
}: {
  currData: IDapem;
  setData: Function;
}) => {
  return (
    <div className="h-[65vh] flex flex-col gap-2">
      <InputUtil
        type="Input"
        label="Pemeriksa"
        value={currData.DetailDapem.pemeriksa}
        onChange={(e: string) =>
          setData((prev: IDapem) => ({
            ...prev,
            DetailDapem: { ...prev.DetailDapem, pemeriksa: e },
          }))
        }
        layout="row"
      />
      <InputUtil
        type="Select"
        label="Status"
        value={currData.DetailDapem.status}
        options={[
          { label: "PENDING", value: "PENDING" },
          { label: "TOLAK", value: "TOLAK" },
          { label: "SETUJU", value: "SETUJU" },
        ]}
        onChange={(e: Estatus) =>
          setData((prev: IDapem) => ({
            ...prev,
            DetailDapem: {
              ...prev.DetailDapem,
              status: e,
              statusCair:
                e === "SETUJU" ? "PROSES" : e === "TOLAK" ? "BATAL" : "ANTRI",
            },
          }))
        }
        layout="row"
      />
      <InputUtil
        type="Date"
        label="Tanggal"
        value={currData.DetailDapem.tanggalStatus || new Date()}
        onChange={(e: string) =>
          setData((prev: IDapem) => ({
            ...prev,
            DetailDapem: { ...prev.DetailDapem, tanggalStatus: new Date(e) },
          }))
        }
        layout="row"
      />
      <InputUtil
        type="Area"
        label="Keterangan"
        value={currData.DetailDapem.keterangan}
        onChange={(e: string) =>
          setData((prev: IDapem) => ({
            ...prev,
            DetailDapem: { ...prev.DetailDapem, keterangan: e },
          }))
        }
        layout="row"
      />
    </div>
  );
};
