"use client";
import { Button, Input, Modal, Select, Table, TableProps, Tooltip } from "antd";
import moment from "moment";
import {
  DeleteFilled,
  FormOutlined,
  PlusCircleFilled,
} from "@ant-design/icons";
import { ProPem } from "@prisma/client";
import { useEffect, useState } from "react";
import { IDRFormat } from "../utils/FunctionUtils";
import { ModalMessageProps } from "../utils/ServerUtils";
import { NotificationModal } from "../utils";

export const UI = () => {
  return (
    <div className="p-1 bg-gray-50 border w-full">
      <TableProPem />
    </div>
  );
};

export const TableProPem = () => {
  const columns: TableProps<ProPem>["columns"] = [
    {
      title: "NO",
      dataIndex: "no",
      key: "no",
      width: 40,
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
        return <div className="text-center">{index + 1}</div>;
      },
    },
    {
      title: "NAMA PRODUK",
      dataIndex: "name",
      key: "name",
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
    },
    {
      title: "MAX TENOR",
      dataIndex: "maxTenor",
      key: "maxTenor",
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
    },
    {
      title: "MAX PLAFON",
      dataIndex: "maxPlafon",
      key: "maxPlafon",
      className: "text-xs text-right",
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
        return <>{IDRFormat(value)}</>;
      },
    },
    {
      title: "ADMIN",
      dataIndex: "byAdmin",
      key: "byAdmin",
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
    },
    {
      title: "TABUNGAN",
      dataIndex: "byTabungan",
      key: "byTabungan",
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
    },
    {
      title: "MATERAI",
      dataIndex: "byMaterai",
      key: "byMaterai",
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
    },
    {
      title: "TATALAKSANA",
      dataIndex: "byTatalaksana",
      key: "byTatalaksana",
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
    },
    {
      title: "BUNGA",
      dataIndex: "margin",
      key: "margin",
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
    },
    {
      title: "UNIT",
      dataIndex: "unit",
      key: "unit",
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
          <>{value === 30 ? "BULANAN" : value === 7 ? "MINGGUAN" : "HARIAN"}</>
        );
      },
    },
    {
      title: "LAST UPDATE",
      dataIndex: "updatedAt",
      key: "updatedAt",
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
        return <>{moment(value).format("DD/MM/YYYY")}</>;
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
            <Tooltip title="EDIT">
              <Button
                icon={<FormOutlined />}
                size="small"
                type="primary"
              ></Button>
            </Tooltip>
            <Tooltip title="Hapus">
              <DeleteProduct
                data={record}
                getProduct={getProduct}
                setNotif={setNotifModal}
              />
            </Tooltip>
          </div>
        );
      },
    },
  ];
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ProPem[]>([]);
  const [search, setSearch] = useState<string>();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [notifModal, setNotifModal] = useState<ModalMessageProps>({
    show: false,
    type: "error",
    title: "",
    desc: "",
  });

  const getProduct = async () => {
    setLoading(true);
    const res = await fetch(
      `/api/products?page=${page}&pageSize=${pageSize}${
        search ? "&name=" + search : ""
      }`
    );
    const { data } = await res.json();
    setData(data.map((d: ProPem) => ({ ...d, key: d.id })));
    setLoading(false);
  };

  useEffect(() => {
    let timeout: any;
    (async () => {
      timeout = setTimeout(async () => {
        await getProduct();
      }, 200);
    })();
    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <div>
      <Table
        columns={columns}
        dataSource={data}
        size="small"
        bordered
        loading={loading}
        scroll={{ x: "max-content", y: 370 }}
        pagination={{
          size: "small",
          pageSizeOptions: [20, 50, 100, 500, 1000, 10000],
          defaultPageSize: 50,
          onChange(page, pageSize) {
            setPage(page);
            setPageSize(pageSize);
          },
        }}
        title={() => (
          <div>
            <div className="font-bold text-xl text-green-500 border-b">
              Data Produk Pembiayaan
            </div>
            <div className="py-1 flex flex-col sm:flex-row gap-2 justify-between sm:items-end">
              <div>
                <CreateProduct
                  getProduct={getProduct}
                  setNotif={setNotifModal}
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
      />
      <NotificationModal data={notifModal} setData={setNotifModal} />
    </div>
  );
};

const CreateProduct = ({
  getProduct,
  setNotif,
}: {
  getProduct: Function;
  setNotif: Function;
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ProPem>({
    name: "",
    maxTenor: 0,
    maxPlafon: 0,
    byAdmin: 0,
    byMaterai: 0,
    byTabungan: 0,
    byTatalaksana: 0,
    margin: 0,
    unit: 7,
    isActive: true,
    updatedAt: new Date(),
    createdAt: new Date(),
    id: "",
  });

  const handleSubmit = async () => {
    setLoading(true);
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-type": "Application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) {
      return setNotif({
        show: true,
        type: "error",
        title: "Error",
        desc: result.msg,
      });
    }
    setNotif({
      show: true,
      type: "success",
      title: "Berhasil",
      desc: result.msg,
    });
    setOpen(false);
    await getProduct();
    setLoading(false);
  };

  return (
    <div>
      <Button
        size="small"
        icon={<PlusCircleFilled />}
        type="primary"
        onClick={() => setOpen(true)}
      >
        New
      </Button>
      <Modal
        title={"Tambah Produk"}
        open={open}
        footer={[
          <Button
            key={"submit"}
            type="primary"
            loading={loading}
            disabled={!data.name ? true : loading}
            onClick={() => handleSubmit()}
          >
            Simpan
          </Button>,
        ]}
        onCancel={() => setOpen(false)}
        onClose={() => setOpen(false)}
        style={{ top: 20 }}
      >
        <div className="flex flex-col gap-2 my-5">
          <div className="flex gap-2">
            <p className="w-44 flex gap-1">
              <span style={{ fontSize: 10, color: "red" }}>*</span>
              <span>Nama Produk</span>
            </p>
            <p>:</p>
            <div className="w-full">
              <Input
                value={data.name}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>
          </div>
          <div className="flex gap-2">
            <p className="w-44 flex gap-1">
              <span style={{ fontSize: 10, color: "red" }}>*</span>
              <span>Max Tenor</span>
            </p>
            <p>:</p>
            <div className="w-full">
              <Input
                type="number"
                value={data.maxTenor}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    maxTenor: parseInt(e.target.value || "0"),
                  }))
                }
              />
            </div>
          </div>
          <div className="flex gap-2">
            <p className="w-44 flex gap-1">
              <span style={{ fontSize: 10, color: "red" }}>*</span>
              <span>Max Plafon</span>
            </p>
            <p>:</p>
            <div className="w-full">
              <Input
                value={IDRFormat(data.maxPlafon)}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    maxPlafon: parseInt(
                      e.target.value.replace(/\D/g, "") || "0"
                    ),
                  }))
                }
              />
            </div>
          </div>
          <div className="flex gap-2">
            <p className="w-44 flex gap-1">
              <span style={{ fontSize: 10, color: "red" }}>*</span>
              <span>Admin</span>
            </p>
            <p>:</p>
            <div className="w-full">
              <Input
                value={data.byAdmin}
                type="number"
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    byAdmin: parseFloat(e.target.value || "0"),
                  }))
                }
              />
            </div>
          </div>
          <div className="flex gap-2">
            <p className="w-44 flex gap-1">
              <span style={{ fontSize: 10, color: "red" }}>*</span>
              <span>Tabungan</span>
            </p>
            <p>:</p>
            <div className="w-full">
              <Input
                value={data.byTabungan}
                type="number"
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    byTabungan: parseFloat(e.target.value || "0"),
                  }))
                }
              />
            </div>
          </div>
          <div className="flex gap-2">
            <p className="w-44">Materai</p>
            <p>:</p>
            <div className="w-full">
              <Input
                value={IDRFormat(data.byMaterai)}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    byMaterai: parseInt(
                      e.target.value.replace(/\D/g, "") || "0"
                    ),
                  }))
                }
              />
            </div>
          </div>
          <div className="flex gap-2">
            <p className="w-44">Tatalaksana</p>
            <p>:</p>
            <div className="w-full">
              <Input
                value={IDRFormat(data.byTatalaksana)}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    byTatalaksana: parseFloat(
                      e.target.value.replace(/\D/g, "") || "0"
                    ),
                  }))
                }
              />
            </div>
          </div>
          <div className="flex gap-2">
            <p className="w-44 flex gap-1">
              <span style={{ fontSize: 10, color: "red" }}>*</span>
              <span>Bunga</span>
            </p>
            <p>:</p>
            <div className="w-full">
              <Input
                type="number"
                value={data.margin}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    margin: parseFloat(e.target.value || "0"),
                  }))
                }
              />
            </div>
          </div>
          <div className="flex gap-2">
            <p className="w-44 flex gap-1">
              <span style={{ fontSize: 10, color: "red" }}>*</span>
              <span>Unit</span>
            </p>
            <p>:</p>
            <div className="w-full">
              <Select
                className="w-full"
                options={[
                  { label: "BULANAN", value: 30 },
                  { label: "MINGGUAN", value: 7 },
                  { label: "HARIAN", value: 1 },
                ]}
                value={data.unit}
                onChange={(e) => setData((prev) => ({ ...prev, unit: e }))}
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const DeleteProduct = ({
  data,
  getProduct,
  setNotif,
}: {
  data: ProPem;
  getProduct: Function;
  setNotif: Function;
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    const res = await fetch(`/api/products?id=${data.id}`, {
      method: "DELETE",
    });
    const result = await res.json();
    if (!res.ok) {
      return setNotif({
        show: true,
        type: "error",
        title: "ERROR",
        desc: result.msg,
      });
    }
    setNotif({
      show: true,
      type: "success",
      title: "BERHASIL",
      desc: result.msg,
    });
    setOpen(false);
    setLoading(false);
    await getProduct();
  };

  return (
    <div>
      <Button
        icon={<DeleteFilled />}
        size="small"
        danger
        onClick={() => setOpen(true)}
        loading={loading}
        disabled={loading}
      ></Button>
      <Modal
        title={"Hapus Produk " + data.name}
        open={open}
        onCancel={() => setOpen(false)}
        onClose={() => setOpen(false)}
        footer={[
          <Button
            key={"delete"}
            danger
            loading={loading}
            disabled={loading}
            onClick={() => handleDelete()}
          >
            YA
          </Button>,
        ]}
      >
        <p>
          Lanjutkan untuk menghapus produk{" "}
          <span className="font-bold">{data.name}</span>?
        </p>
      </Modal>
    </div>
  );
};
