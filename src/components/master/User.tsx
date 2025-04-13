"use client";
import {
  DeleteFilled,
  FormOutlined,
  PlusCircleFilled,
} from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Form,
  Input,
  Modal,
  Steps,
  Table,
  TableProps,
  Tag,
} from "antd";
import { useEffect, useState } from "react";
import { IMenuList, IUser } from "../IInterfaces";
import { menus } from "../layouts/LayoutUser";
import { ModalMessageProps } from "../utils/ServerUtils";
import { User, UserMenu as UMenu } from "@prisma/client";
import moment from "moment";
import { InputUtil, NotificationModal } from "../utils";

export const DataKaryawan = () => {
  const [data, setData] = useState<IUser[]>();
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState<string>();
  const [notifModal, setNotifModal] = useState<ModalMessageProps>({
    show: false,
    type: "error",
    title: "",
    desc: "",
  });

  const columns: TableProps<IUser>["columns"] = [
    {
      title: "NO",
      dataIndex: "no",
      className: "text-xs",
      key: "no",
      width: 40,
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
      title: "NAMA LENGKAP",
      dataIndex: "namaLengkap",
      className: "text-xs",
      key: "namaLengkap",
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
      title: "NOMOR NIP",
      dataIndex: "nip",
      className: "text-xs text-center",
      key: "nip",
      width: 130,
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
      title: "ALAMAT",
      dataIndex: "alamat",
      className: "text-xs",
      key: "alamat",
      width: 250,
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
      title: "ROLE",
      dataIndex: "role",
      key: "role",
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
          <div>
            <Tag
              color={
                value === "DEVELOPER"
                  ? "green"
                  : value === "ADMIN"
                  ? "blue"
                  : "orange"
              }
            >
              {value}
            </Tag>
          </div>
        );
      },
    },
    {
      title: "USERNAME",
      dataIndex: "username",
      key: "username",
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
    },
    {
      title: "TANGGAL MASUK",
      dataIndex: "createdAt",
      key: "createdAt",
      className: "text-xs text-center",
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
        return <div>{moment(value).format("DD/MM/YYYY")}</div>;
      },
    },
    {
      title: "LAST UPDATE",
      dataIndex: "updatedAt",
      key: "updatedAt",
      className: "text-xs text-center",
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
        return <div>{moment(value).format("DD/MM/YYYY")}</div>;
      },
    },
    {
      title: "STATUS",
      dataIndex: "isActive",
      key: "isActive",
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
          <div
            className={`text-center ${
              record.isActive ? "text-green-500" : "text-red-500"
            }`}
          >
            {record.isActive ? "ACTIVE" : "INACTIVE"}
          </div>
        );
      },
    },
    {
      title: "AKSI",
      dataIndex: "aksi",
      key: "aksi",
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
          <div className="flex justify-center gap-2">
            <CreateOrUpdateUser
              getData={getData}
              setMessage={setNotifModal}
              currData={record}
            />
            <DeleteUser
              data={record}
              getUser={getData}
              setNotif={setNotifModal}
            />
          </div>
        );
      },
    },
  ];

  const getData = async (search?: string) => {
    setLoading(true);
    const res = await fetch(`/api/users${search ? "?name=" + search : ""}`);
    const { data } = await res.json();
    setData(
      data.map((d: IUser) => {
        return {
          ...d,
          key: d.id,
        };
      })
    );
    setLoading(false);
  };

  useEffect(() => {
    let timeout: any;
    (async () => {
      timeout = setTimeout(async () => {
        await getData(search);
      }, 200);
    })();
    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <div>
      <div className="p-1 bg-gray-50">
        <Table
          columns={columns}
          size="small"
          bordered
          scroll={{ x: "max-content" }}
          pagination={{
            size: "small",
            pageSizeOptions: [20, 50, 100, 500, 1000, 10000],
            defaultPageSize: 50,
          }}
          dataSource={data}
          loading={loading}
          title={() => (
            <div>
              <div className="font-bold text-xl text-green-500 border-b">
                Data Karyawan
              </div>
              <div className="py-1 flex flex-col sm:flex-row gap-2 justify-between sm:items-end">
                <div className="flex-1 flex items-end gap-2 flex-wrap">
                  <CreateOrUpdateUser
                    getData={getData}
                    setMessage={setNotifModal}
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
      </div>
      <NotificationModal data={notifModal} setData={setNotifModal} />
    </div>
  );
};

const CreateOrUpdateUser = ({
  getData,
  setMessage,
  currData,
}: {
  getData: Function;
  setMessage: Function;
  currData?: IUser;
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [personal, setPersonal] = useState<IUser>();
  const [userMenu, setUserMenu] = useState<IMenuList[]>();
  const [current, setCurrent] = useState(0);
  const steps = [
    {
      title: "Personal",
      content: <Personal handlePersonal={setPersonal} currData={currData} />,
    },
    {
      title: "Main Menu",
      content: (
        <UserMenu
          setUserMenu={setUserMenu}
          currData={currData && currData.UserMenu}
        />
      ),
    },
  ];

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  const onFinish = async () => {
    setLoading(true);
    const fixMenu: UMenu[] = [];
    userMenu?.forEach((menu) => {
      if (menu.checked === true) {
        if (menu.children?.length !== 0) {
          menu.children?.forEach((c) => {
            if (c.checked === true) {
              fixMenu.push({
                path: c.key,
                access: c.access.join(","),
                userId: "",
                id: "",
              });
            }
          });
        } else {
          fixMenu.push({
            path: menu.key,
            access: menu.access.join(","),
            userId: "",
            id: "",
          });
        }
      }
    });
    await fetch("/api/users", {
      method: currData ? "PUT" : "POST",
      headers: { "Content-type": "Application/json" },
      body: JSON.stringify({ ...personal, UserMenu: fixMenu }),
    })
      .then((res) => res.json())
      .then(async (result: { msg: string; status: number }) => {
        if (result.status >= 200 && result.status <= 201) {
          setMessage({
            type: "error",
            title: "ERROR",
            desc: result.msg,
            show: true,
          });
          await getData();
        } else {
          setMessage({
            type: "success",
            title: "BERHASIL",
            desc: result.msg,
            show: true,
          });
          setOpen(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setMessage({
          type: "error",
          title: "Internal Server Error",
          desc: `Terjadi kesalahan dan gagal ${
            currData ? "Update" : "menambahkan"
          } karyawan ${!currData && "baru"}. Mohon coba lagi nanti!`,
          show: true,
        });
      });
    setLoading(false);
  };
  return (
    <div>
      <Button
        className="bg-green-500 text-white text-xs"
        size="small"
        onClick={() => setOpen(true)}
        icon={currData ? <FormOutlined /> : <PlusCircleFilled />}
      >
        {!currData && "New"}
      </Button>
      <Modal
        title="Tambah Karyawan"
        open={open}
        onClose={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        wrapClassName="w-[98vw] sm:w-[80vw] mx-auto"
        width={"100%"}
        footer={[]}
        loading={loading}
        className="top-5"
      >
        <div className="mb-10 w-full sm:w-[500px] m-auto">
          <Steps
            current={current}
            items={items}
            direction="horizontal"
            size="small"
          />
        </div>
        <Form labelCol={{ span: 7 }} onFinish={onFinish}>
          <div>{steps[current].content}</div>
          <Form.Item className="flex justify-end my-4">
            {current < steps.length - 1 && (
              <Button
                type="primary"
                onClick={() => next()}
                disabled={!personal}
                loading={loading}
              >
                Lanjut
              </Button>
            )}
            {current === steps.length - 1 && (
              <div>
                <Button style={{ margin: "0 8px" }} onClick={() => prev()}>
                  Kembali
                </Button>
                <Button
                  style={{ margin: "0 8px" }}
                  type="primary"
                  htmlType="submit"
                  disabled={!personal || !userMenu}
                  loading={loading}
                >
                  Submit
                </Button>
              </div>
            )}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

const Personal = ({
  handlePersonal,
  currData,
}: {
  handlePersonal: Function;
  currData?: User;
}) => {
  const [data, setData] = useState<User>({
    id: "",
    namaLengkap: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    nip: "",
    alamat: "",
    kelurahan: "",
    kecamatan: "",
    kota: "",
    provinsi: "",
    jenisKelamin: "Laki_laki",
    role: "MARKETING",

    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  useEffect(() => {
    if (
      data.namaLengkap &&
      data.username &&
      data.email &&
      data.password &&
      data.nip &&
      data.phone &&
      data.role &&
      data.jenisKelamin &&
      data.alamat &&
      data.kelurahan &&
      data.kecamatan &&
      data.kota &&
      data.provinsi
    ) {
      handlePersonal(data);
    }
  }, [data]);

  useEffect(() => {
    if (currData) setData({ ...currData, password: "" });
  }, []);

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1 flex flex-col gap-2">
        <InputUtil
          type="Input"
          label="Nama Lengkap"
          required
          value={data.namaLengkap}
          onChange={(e: any) =>
            setData((prev) => ({ ...prev, namaLengkap: e }))
          }
        />
        <InputUtil
          type="Input"
          label="NIP"
          required
          value={data.nip}
          onChange={(e: any) => setData((prev) => ({ ...prev, nip: e }))}
        />
        <InputUtil
          type="Input"
          label="Username"
          required
          value={data.username}
          onChange={(e: any) => setData((prev) => ({ ...prev, username: e }))}
        />
        <InputUtil
          type="Password"
          label="Password"
          value={data.password}
          onChange={(e: any) => setData((prev) => ({ ...prev, password: e }))}
        />
        <InputUtil
          type="Input"
          label="Email"
          required
          value={data.email}
          onChange={(e: any) => setData((prev) => ({ ...prev, email: e }))}
        />
        <InputUtil
          type="Input"
          label="Telepon/Wa"
          required
          value={data.phone}
          onChange={(e: any) => setData((prev) => ({ ...prev, phone: e }))}
        />
        <InputUtil
          type="Select"
          label="Role"
          required
          value={data.role}
          options={[
            { label: "Developer", value: "DEVELOPER" },
            { label: "Admin", value: "ADMIN" },
            { label: "Marketing", value: "MARKETING" },
          ]}
          onChange={(e: any) => setData((prev) => ({ ...prev, role: e }))}
        />
      </div>
      <div className="flex-1 flex flex-col gap-2">
        <InputUtil
          type="Select"
          label="Jenis Kelamin"
          required
          value={data.jenisKelamin}
          options={[
            { label: "Laki Laki", value: "Laki_laki" },
            { label: "Perempuan", value: "Perempuan" },
          ]}
          onChange={(e: any) =>
            setData((prev) => ({ ...prev, jenisKelamin: e }))
          }
        />
        <InputUtil
          type="Area"
          label="Alamat"
          required
          value={data.alamat}
          onChange={(e: any) => setData((prev) => ({ ...prev, alamat: e }))}
        />
        <InputUtil
          type="Input"
          label="Kelurahan"
          required
          value={data.kelurahan}
          onChange={(e: any) => setData((prev) => ({ ...prev, kelurahan: e }))}
        />
        <InputUtil
          type="Input"
          label="Kecamatan"
          required
          value={data.kecamatan}
          onChange={(e: any) => setData((prev) => ({ ...prev, kecamatan: e }))}
        />
        <InputUtil
          type="Input"
          label="Kota"
          required
          value={data.kota}
          onChange={(e: any) => setData((prev) => ({ ...prev, kota: e }))}
        />
        <InputUtil
          type="Input"
          label="Provinsi"
          required
          value={data.provinsi}
          onChange={(e: any) => setData((prev) => ({ ...prev, provinsi: e }))}
        />
      </div>
    </div>
  );
};

const UserMenu = ({
  setUserMenu,
  currData,
}: {
  setUserMenu: Function;
  currData?: UMenu[];
}) => {
  const [data, setData] = useState<IMenuList[]>(
    menus.map((m) => {
      const child =
        m.children &&
        m.children.map((mc) => {
          return { ...mc, access: [], checked: false };
        });
      return {
        ...m,
        access: [],
        checked: false,
        children: m.children ? child : [],
      };
    })
  );

  const handleChange = (menu: IMenuList) => {
    setData((prev) => {
      prev = prev.map((p) => {
        if (p.key === menu.key) {
          p = menu;
        }
        return p;
      });
      return prev;
    });
  };

  useEffect(() => {
    setUserMenu(data);
  }, [data]);

  return (
    <div>
      <div className="flex gap-4 flex-wrap text-xs opacity-50">
        {currData &&
          currData.map((m) => (
            <div key={m.id} className="border rounded p-1">
              <p className="underline">{m.path}</p>
              <p className="ms-4 italic">
                <span>Access : </span>
                {m.access.split(",").map((ma) => (
                  <span key={ma}>{ma.charAt(0)}</span>
                ))}
              </p>
            </div>
          ))}
      </div>
      <div className="flex gap-10">
        <div className="flex flex-wrap justify-around gap-5">
          {data.map((m: IMenuList, i: number) => (
            <div key={i} className="border-b p-2">
              <CheckBoxItem menu={m} key={i} onChange={handleChange} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const CheckBoxItem = ({
  menu,
  onChange,
}: {
  menu: IMenuList;
  onChange: Function;
}) => {
  const [data, setData] = useState<IMenuList>(menu);

  useEffect(() => {
    onChange(data);
  }, [data]);

  return (
    <div>
      {data.children && data.children.length !== 0 ? (
        <div>
          <Checkbox checked={data.checked} name={data.key} disabled>
            {data.label}
          </Checkbox>
          <AccessChildUtils menu={data} handleChange={setData} />
        </div>
      ) : (
        <div>
          <Checkbox checked={data.checked} name={data.key} disabled>
            {data.label}
          </Checkbox>
          <AccessUtils menu={data} handleChange={setData} />
        </div>
      )}
    </div>
  );
};

const AccessUtils = ({
  menu,
  handleChange,
}: {
  menu: IMenuList;
  handleChange: Function;
}) => {
  const [data, setData] = useState<IMenuList>(menu);

  const onChange = (value: string) => {
    const access = data.access;
    if (access.includes(value)) {
      setData((prev) => {
        const tempAccess = access.filter((p) => p !== value);
        return {
          ...prev,
          checked: tempAccess.length === 0 ? false : true,
          access: tempAccess,
        };
      });
    } else {
      setData((prev) => {
        const tempAccess = [...access, value];
        return {
          ...prev,
          checked: true,
          access: tempAccess,
        };
      });
    }
  };

  useEffect(() => {
    handleChange(data);
  }, [data]);

  return (
    <div className="ms-10 flex gap-2">
      {["Read", "Write", "Update", "Delete"].map((access) => (
        <Checkbox
          key={access}
          name={access}
          className="text-xs"
          onChange={() => onChange(access)}
        >
          {access}
        </Checkbox>
      ))}
    </div>
  );
};
const AccessChildUtils = ({
  menu,
  handleChange,
}: {
  menu: IMenuList;
  handleChange: Function;
}) => {
  const [data, setData] = useState<IMenuList>(menu);

  const onChange = (key: string, value: string) => {
    const filterChild = data.children?.filter((c) => c.key == key);
    if (!filterChild) return;

    if (filterChild[0].access.includes(value)) {
      const newAccess = filterChild[0].access.filter((p) => p !== value);
      filterChild[0].access = newAccess;
    } else {
      filterChild[0].access.push(value);
    }

    setData((prev) => {
      const child = prev.children?.map((c) => {
        if (c.key === key) {
          c = filterChild[0];
          c.checked = filterChild[0].access.length === 0 ? false : true;
        }
        return c;
      });
      const filterChildChecked = child?.filter((c) => c.checked === true);
      return {
        ...prev,
        checked: filterChildChecked?.length === 0 ? false : true,
      };
    });
  };

  useEffect(() => {
    handleChange(data);
  }, [data]);

  return (
    <div>
      {data.children &&
        data.children.map((mc) => (
          <div key={mc.key} className="ms-8">
            <Checkbox checked={mc.checked} name={mc.key} disabled>
              {mc.label}
            </Checkbox>
            <div className="ms-10 flex gap-2">
              {["Read", "Write", "Update", "Delete"].map((access) => (
                <Checkbox
                  key={access}
                  name={access}
                  className="text-xs"
                  onChange={() => onChange(mc.key, access)}
                >
                  {access}
                </Checkbox>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
};

export const DeleteUser = ({
  data,
  getUser,
  setNotif,
}: {
  data: IUser;
  getUser: Function;
  setNotif: Function;
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleDelete = async () => {
    setLoading(true);
    const res = await fetch("/api/users?id=" + data.id);
    const result = await res.json();
    if (!res.ok) {
      return setNotif({
        type: "error",
        show: true,
        title: "ERROR",
        desc: result.msg,
      });
    }
    setNotif({
      type: "success",
      show: true,
      title: "BERHASIL",
      desc: result.msg,
    });
    await getUser();
    setLoading(false);
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
        open={open}
        title={"Hapus Data " + data.namaLengkap.toUpperCase()}
        onCancel={() => setOpen(false)}
        onClose={() => setOpen(false)}
        footer={[
          <Button
            key={"hapus"}
            onClick={() => handleDelete()}
            type="primary"
            loading={loading}
            disabled={loading}
          >
            Submit
          </Button>,
        ]}
      >
        <p>
          Lanjutkan untuk menghapus produk{" "}
          <span className="font-bold">{data.namaLengkap.toUpperCase()}</span>?
        </p>
      </Modal>
    </div>
  );
};
