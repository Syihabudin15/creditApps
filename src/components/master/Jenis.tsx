"use client";
import { Button, Input, Modal, Table, TableProps, Tooltip } from "antd";
import moment from "moment";
import {
  DeleteFilled,
  FormOutlined,
  PlusCircleFilled,
} from "@ant-design/icons";
import { JePem } from "@prisma/client";
import { useEffect, useState } from "react";
import { ModalMessageProps } from "../utils/ServerUtils";
import { NotificationModal } from "../utils";

export const UI = () => {
  return (
    <div className="p-1 bg-gray-50 border w-full">
      <TableJePem />
    </div>
  );
};

export const TableJePem = () => {
  const columns: TableProps<JePem>["columns"] = [
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
      title: "JENIS PEMBIAYAAN",
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
      title: "PENALTY",
      dataIndex: "penalty",
      key: "penalty",
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
              <DeleteJePem
                data={record}
                getJePem={getJePem}
                setNotif={setNotifModal}
              />
            </Tooltip>
          </div>
        );
      },
    },
  ];
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<JePem[]>([]);
  const [search, setSearch] = useState<string>();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [notifModal, setNotifModal] = useState<ModalMessageProps>({
    show: false,
    type: "error",
    title: "",
    desc: "",
  });

  const getJePem = async () => {
    setLoading(true);
    const res = await fetch(
      `/api/jepem?page=${page}&pageSize=${pageSize}${
        search ? "&name=" + search : ""
      }`
    );
    const { data } = await res.json();
    setData(data.map((d: JePem) => ({ ...d, key: d.id })));
    setLoading(false);
  };

  useEffect(() => {
    let timeout: any;
    (async () => {
      timeout = setTimeout(async () => {
        await getJePem();
      }, 300);
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
              Data Jenis Pembiayaan
            </div>
            <div className="py-1 flex flex-col sm:flex-row gap-2 justify-between sm:items-end">
              <div>
                <CreateJePem getJePem={getJePem} setNotif={setNotifModal} />
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

const CreateJePem = ({
  getJePem,
  setNotif,
}: {
  getJePem: Function;
  setNotif: Function;
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<JePem>({
    name: "",
    penalty: 0,
    isActive: true,
    updatedAt: new Date(),
    createdAt: new Date(),
    id: "",
  });

  const handleSubmit = async () => {
    setLoading(true);
    const res = await fetch("/api/jepem", {
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
    await getJePem();
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
        title={"Tambah Jenis Pembiayaan"}
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
            <p className="w-72 flex gap-1">
              <span style={{ fontSize: 10, color: "red" }}>*</span>
              <span>Nama Jenis Biaya</span>
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
            <p className="w-72 flex gap-1">
              <span style={{ fontSize: 10, color: "red" }}>*</span>
              <span>Penalty Pelunasan</span>
            </p>
            <p>:</p>
            <div className="w-full">
              <Input
                type="number"
                value={data.penalty}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    penalty: parseInt(e.target.value || "0"),
                  }))
                }
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const DeleteJePem = ({
  data,
  getJePem,
  setNotif,
}: {
  data: JePem;
  getJePem: Function;
  setNotif: Function;
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    const res = await fetch(`/api/jepem?id=${data.id}`, {
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
    await getJePem();
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
        title={"Hapus Jenis Pembiayaan " + data.name}
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
          Lanjutkan untuk menghapus Jenis Pembiayaan{" "}
          <span className="font-bold">{data.name}</span>?
        </p>
      </Modal>
    </div>
  );
};
