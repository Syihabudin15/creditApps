"use client";

import {
  FileOutlined,
  FormOutlined,
  PlusCircleFilled,
} from "@ant-design/icons";
import { Button, Modal, Tabs } from "antd";
import { useEffect, useState } from "react";
import { InputUtil, NotificationModal } from "../utils";
import { IDapem } from "../IInterfaces";
import { FileUpload, ProsesPengajuan, UISimulation } from ".";
import { DataKeluarga, EGender, EStatusKawin, User } from "@prisma/client";
import { ModalMessageProps } from "../utils/ServerUtils";
import { useUser } from "../contexts/UserContext";

export const CreateOrUpdate = ({
  currData,
  action,
  users,
  getData,
}: {
  currData?: IDapem;
  action?: "View" | "Update" | "Proses";
  users: User[];
  getData: Function;
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<IDapem>(defaultData);
  const [keluarga, setKeluarga] = useState<DataKeluarga>({
    id: "",
    nama: "",
    noTelepon: "",
    hubungan: "",
    alamat: "",
    gender: "Laki_laki",
    dataDebiturId: "",
  });
  const [modalMessage, setModalMessage] = useState<ModalMessageProps>({
    title: "",
    type: "error",
    desc: "",
    show: false,
  });
  const user = useUser();

  const onSubmit = async () => {
    setLoading(true);
    await fetch("/api/dapem", {
      method: action ? "PUT" : "POST",
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
  const onProses = async () => {
    setLoading(true);
    await fetch("/api/dapem", {
      method: action ? "PUT" : "POST",
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
          desc: "Data pengajuan berhasil di proses",
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
                Gagal melakukan proses pengajuan. mohon cek kembali dan pastikan
                semua data diisi dengan baik!
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

  useEffect(() => {
    setData((prev) => ({
      ...prev,
      DetailDapem: {
        ...prev.DetailDapem,
        DataDebitur: {
          ...prev.DetailDapem.DataDebitur,
          DataKeluarga: [{ ...keluarga }],
        },
      },
    }));
  }, [keluarga]);

  useEffect(() => {
    setLoading(true);
    if (currData) {
      setLoading(false);
      setKeluarga({ ...currData.DetailDapem.DataDebitur.DataKeluarga[0] });
      return setData({
        ...currData,
        DetailDapem: {
          ...currData.DetailDapem,
          pemeriksa: user.namaLengkap,
          tanggalStatus: new Date(),
        },
      });
    }
    setData((prev) => ({
      ...prev,
      DetailDapem: {
        ...prev.DetailDapem,
        userId: user.id || "",
      },
    }));
    setLoading(false);
  }, []);

  return (
    <div>
      <Button
        icon={
          currData && action !== "View" ? (
            <FormOutlined />
          ) : action && action === "View" ? (
            <FileOutlined />
          ) : (
            <PlusCircleFilled />
          )
        }
        type="primary"
        size="small"
        onClick={() => setOpen(true)}
        loading={loading}
        disabled={loading}
      >
        {!currData && "New"}
      </Button>
      <Modal
        title={
          action === "Update"
            ? "Edit Pengajuan"
            : action === "Proses"
            ? "Proses Pengajuan"
            : action === "View"
            ? "Detail Pengajuan"
            : "Tambah Pengajuan Baru"
        }
        open={open}
        onClose={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        width={"99vw"}
        style={{ top: 5 }}
        footer={[
          <div key={"submit"} className={"flex justify-end"}>
            {action && action === "Proses" && (
              <Button
                type="primary"
                loading={loading}
                disabled={!data.DetailDapem.keterangan ? true : loading}
                onClick={() => onProses()}
              >
                Proses
              </Button>
            )}
            {!action ||
              (action === "Update" && (
                <Button
                  type="primary"
                  loading={loading}
                  disabled={loading}
                  onClick={() => onSubmit()}
                >
                  Submit
                </Button>
              ))}
          </div>,
        ]}
      >
        <div className="flex flex-col sm:flex-row gap-4 my-4">
          <div className="flex-1 h-[75vh] overflow-y-auto">
            <div className="bg-green-500 p-2 rounded text-white text-center my-4">
              <p>Data Pemohon</p>
            </div>
            <div className="flex gap-2 my-1">
              <div className="flex-1">
                <InputUtil
                  label="Nomor NIK"
                  type="Input"
                  value={data.DetailDapem.DataDebitur.nik}
                  onChange={(e: string) =>
                    setData((prev) => ({
                      ...prev,
                      DetailDapem: {
                        ...prev.DetailDapem,
                        DataDebitur: {
                          ...prev.DetailDapem.DataDebitur,
                          nik: e,
                        },
                      },
                    }))
                  }
                  required
                  layout="col"
                  disabled={
                    action
                      ? action === "View" || action === "Proses"
                        ? true
                        : false
                      : false
                  }
                />
              </div>
              <div className="flex-1">
                <InputUtil
                  label="Nama Pemohon"
                  type="Input"
                  value={data.DetailDapem.DataDebitur.nama}
                  onChange={(e: string) =>
                    setData((prev) => ({
                      ...prev,
                      DetailDapem: {
                        ...prev.DetailDapem,
                        DataDebitur: {
                          ...prev.DetailDapem.DataDebitur,
                          nama: e,
                        },
                      },
                    }))
                  }
                  required
                  layout="col"
                  disabled={
                    action
                      ? action === "View" || action === "Proses"
                        ? true
                        : false
                      : false
                  }
                />
              </div>
            </div>
            <div className="flex gap-2 my-1">
              <div className="flex-1">
                <InputUtil
                  label="Tanggal Lahir"
                  type="Date"
                  value={data.DetailDapem.DataDebitur.tanggalLahir}
                  onChange={(e: string) =>
                    setData((prev) => ({
                      ...prev,
                      DetailDapem: {
                        ...prev.DetailDapem,
                        DataDebitur: {
                          ...prev.DetailDapem.DataDebitur,
                          tanggalLahir: new Date(e),
                        },
                      },
                    }))
                  }
                  required
                  layout="col"
                  disabled={
                    action
                      ? action === "View" || action === "Proses"
                        ? true
                        : false
                      : false
                  }
                />
              </div>
              <div className="flex-1">
                <InputUtil
                  label="Alamat"
                  type="Area"
                  value={data.DetailDapem.DataDebitur.alamat}
                  onChange={(e: string) =>
                    setData((prev) => ({
                      ...prev,
                      DetailDapem: {
                        ...prev.DetailDapem,
                        DataDebitur: {
                          ...prev.DetailDapem.DataDebitur,
                          alamat: e,
                        },
                      },
                    }))
                  }
                  required
                  layout="col"
                  disabled={
                    action
                      ? action === "View" || action === "Proses"
                        ? true
                        : false
                      : false
                  }
                />
              </div>
            </div>
            <div className="flex gap-2 my-1">
              <div className="flex-1">
                <InputUtil
                  label="Kelurahan"
                  type="Input"
                  value={data.DetailDapem.DataDebitur.kelurahan}
                  onChange={(e: string) =>
                    setData((prev) => ({
                      ...prev,
                      DetailDapem: {
                        ...prev.DetailDapem,
                        DataDebitur: {
                          ...prev.DetailDapem.DataDebitur,
                          kelurahan: e,
                        },
                      },
                    }))
                  }
                  required
                  layout="col"
                  disabled={
                    action
                      ? action === "View" || action === "Proses"
                        ? true
                        : false
                      : false
                  }
                />
              </div>
              <div className="flex-1">
                <InputUtil
                  label="Kecamatan"
                  type="Input"
                  value={data.DetailDapem.DataDebitur.kecamatan}
                  onChange={(e: string) =>
                    setData((prev) => ({
                      ...prev,
                      DetailDapem: {
                        ...prev.DetailDapem,
                        DataDebitur: {
                          ...prev.DetailDapem.DataDebitur,
                          kecamatan: e,
                        },
                      },
                    }))
                  }
                  required
                  layout="col"
                  disabled={
                    action
                      ? action === "View" || action === "Proses"
                        ? true
                        : false
                      : false
                  }
                />
              </div>
            </div>
            <div className="flex gap-2 my-1">
              <div className="flex-1">
                <InputUtil
                  label="Kota"
                  type="Input"
                  value={data.DetailDapem.DataDebitur.kota}
                  onChange={(e: string) =>
                    setData((prev) => ({
                      ...prev,
                      DetailDapem: {
                        ...prev.DetailDapem,
                        DataDebitur: {
                          ...prev.DetailDapem.DataDebitur,
                          kota: e,
                        },
                      },
                    }))
                  }
                  required
                  layout="col"
                  disabled={
                    action
                      ? action === "View" || action === "Proses"
                        ? true
                        : false
                      : false
                  }
                />
              </div>
              <div className="flex-1">
                <InputUtil
                  label="Provinsi"
                  type="Input"
                  value={data.DetailDapem.DataDebitur.provinsi}
                  onChange={(e: string) =>
                    setData((prev) => ({
                      ...prev,
                      DetailDapem: {
                        ...prev.DetailDapem,
                        DataDebitur: {
                          ...prev.DetailDapem.DataDebitur,
                          provinsi: e,
                        },
                      },
                    }))
                  }
                  required
                  layout="col"
                  disabled={
                    action
                      ? action === "View" || action === "Proses"
                        ? true
                        : false
                      : false
                  }
                />
              </div>
            </div>
            <div className="flex gap-2 my-1">
              <div className="flex-1">
                <InputUtil
                  label="Kode Pos"
                  type="Input"
                  value={data.DetailDapem.DataDebitur.kodePos}
                  onChange={(e: string) =>
                    setData((prev) => ({
                      ...prev,
                      DetailDapem: {
                        ...prev.DetailDapem,
                        DataDebitur: {
                          ...prev.DetailDapem.DataDebitur,
                          kodePos: e,
                        },
                      },
                    }))
                  }
                  required
                  layout="col"
                  disabled={
                    action
                      ? action === "View" || action === "Proses"
                        ? true
                        : false
                      : false
                  }
                />
              </div>
              <div className="flex-1">
                <InputUtil
                  label="Geo Location"
                  type="Input"
                  value={data.DetailDapem.DataDebitur.geoLokasi}
                  onChange={(e: string) =>
                    setData((prev) => ({
                      ...prev,
                      DetailDapem: {
                        ...prev.DetailDapem,
                        DataDebitur: {
                          ...prev.DetailDapem.DataDebitur,
                          geoLokasi: e,
                        },
                      },
                    }))
                  }
                  required
                  layout="col"
                  disabled={
                    action
                      ? action === "View" || action === "Proses"
                        ? true
                        : false
                      : false
                  }
                />
              </div>
            </div>
            <div className="flex gap-2 my-1">
              <div className="flex-1">
                <InputUtil
                  label="No Telepon"
                  type="Input"
                  value={data.DetailDapem.DataDebitur.noTelepon}
                  onChange={(e: string) =>
                    setData((prev) => ({
                      ...prev,
                      DetailDapem: {
                        ...prev.DetailDapem,
                        DataDebitur: {
                          ...prev.DetailDapem.DataDebitur,
                          noTelepon: e,
                        },
                      },
                    }))
                  }
                  required
                  layout="col"
                  disabled={
                    action
                      ? action === "View" || action === "Proses"
                        ? true
                        : false
                      : false
                  }
                />
              </div>
              <div className="flex-1">
                <InputUtil
                  label="Jenis Kelamin"
                  type="Select"
                  value={data.DetailDapem.DataDebitur.gender}
                  onChange={(e: string) =>
                    setData((prev) => ({
                      ...prev,
                      DetailDapem: {
                        ...prev.DetailDapem,
                        DataDebitur: {
                          ...prev.DetailDapem.DataDebitur,
                          gender: e as any as EGender,
                        },
                      },
                    }))
                  }
                  options={[
                    { label: "Laki - Laki", value: "Laki_laki" },
                    { label: "Perempuan", value: "Perempuan" },
                  ]}
                  required
                  layout="col"
                  disabled={
                    action
                      ? action === "View" || action === "Proses"
                        ? true
                        : false
                      : false
                  }
                />
              </div>
            </div>
            <div className="flex gap-2 my-1">
              <div className="flex-1">
                <InputUtil
                  label="Pekerjaan"
                  type="Select"
                  value={data.DetailDapem.DataDebitur.pekerjaan}
                  onChange={(e: string) =>
                    setData((prev) => ({
                      ...prev,
                      DetailDapem: {
                        ...prev.DetailDapem,
                        DataDebitur: {
                          ...prev.DetailDapem.DataDebitur,
                          pekerjaan: e,
                        },
                      },
                    }))
                  }
                  options={[
                    { label: "Tidak Bekerja", value: "Tidak Bekerja" },
                    { label: "Karyawan Swasta", value: "Karyawan Swasta" },
                    { label: "Wiraswasta", value: "Wiraswasta" },
                    { label: "Pedagang", value: "Pedagang" },
                  ]}
                  required
                  layout="col"
                  disabled={
                    action
                      ? action === "View" || action === "Proses"
                        ? true
                        : false
                      : false
                  }
                />
              </div>
              <div className="flex-1">
                <InputUtil
                  label="Alamat Pekerjaan"
                  type="Area"
                  value={data.DetailDapem.DataDebitur.alamatPekerjaan}
                  onChange={(e: string) =>
                    setData((prev) => ({
                      ...prev,
                      DetailDapem: {
                        ...prev.DetailDapem,
                        DataDebitur: {
                          ...prev.DetailDapem.DataDebitur,
                          alamatPekerjaan: e,
                        },
                      },
                    }))
                  }
                  required
                  layout="col"
                  disabled={
                    action
                      ? action === "View" || action === "Proses"
                        ? true
                        : false
                      : false
                  }
                />
              </div>
            </div>
            <div className="flex gap-2 my-1">
              <div className="flex-1">
                <InputUtil
                  label="Status Kawin"
                  type="Select"
                  value={data.DetailDapem.DataDebitur.statusKawin}
                  onChange={(e: string) =>
                    setData((prev) => ({
                      ...prev,
                      DetailDapem: {
                        ...prev.DetailDapem,
                        DataDebitur: {
                          ...prev.DetailDapem.DataDebitur,
                          statusKawin: e as any as EStatusKawin,
                        },
                      },
                    }))
                  }
                  options={[
                    { label: "Belum Kawin", value: "BELUMKAWIN" },
                    { label: "Kawin", value: "KAWIN" },
                    { label: "Janda", value: "JANDA" },
                    { label: "Duda", value: "DUDA" },
                  ]}
                  required
                  layout="col"
                  disabled={
                    action
                      ? action === "View" || action === "Proses"
                        ? true
                        : false
                      : false
                  }
                />
              </div>
            </div>
            {data.DetailDapem.DataDebitur.statusKawin === "KAWIN" && (
              <>
                <div className="flex gap-2 my-1">
                  <div className="flex-1">
                    <InputUtil
                      label="Nama Pasangan"
                      type="Input"
                      value={data.DetailDapem.DataDebitur.namaPasangan}
                      onChange={(e: string) =>
                        setData((prev) => ({
                          ...prev,
                          DetailDapem: {
                            ...prev.DetailDapem,
                            DataDebitur: {
                              ...prev.DetailDapem.DataDebitur,
                              namaPasangan: e,
                            },
                          },
                        }))
                      }
                      required
                      layout="col"
                      disabled={
                        action
                          ? action === "View" || action === "Proses"
                            ? true
                            : false
                          : false
                      }
                    />
                  </div>
                  <div className="flex-1">
                    <InputUtil
                      label="NIK Pasangan"
                      type="Input"
                      value={data.DetailDapem.DataDebitur.nikPasangan}
                      onChange={(e: string) =>
                        setData((prev) => ({
                          ...prev,
                          DetailDapem: {
                            ...prev.DetailDapem,
                            DataDebitur: {
                              ...prev.DetailDapem.DataDebitur,
                              nikPasangan: e,
                            },
                          },
                        }))
                      }
                      required
                      layout="col"
                      disabled={
                        action
                          ? action === "View" || action === "Proses"
                            ? true
                            : false
                          : false
                      }
                    />
                  </div>
                </div>
                <div className="flex gap-2 my-1">
                  <div className="flex-1">
                    <InputUtil
                      label="Alamat Pasangan"
                      type="Area"
                      value={data.DetailDapem.DataDebitur.alamatPasangan}
                      onChange={(e: string) =>
                        setData((prev) => ({
                          ...prev,
                          DetailDapem: {
                            ...prev.DetailDapem,
                            DataDebitur: {
                              ...prev.DetailDapem.DataDebitur,
                              alamatPasangan: e,
                            },
                          },
                        }))
                      }
                      required
                      layout="col"
                      disabled={
                        action
                          ? action === "View" || action === "Proses"
                            ? true
                            : false
                          : false
                      }
                    />
                  </div>
                  <div className="flex-1">
                    <InputUtil
                      label="Tanggal Lahir Pasangan"
                      type="Date"
                      value={data.DetailDapem.DataDebitur.tanggalLahirPasangan}
                      onChange={(e: string) =>
                        setData((prev) => ({
                          ...prev,
                          DetailDapem: {
                            ...prev.DetailDapem,
                            DataDebitur: {
                              ...prev.DetailDapem.DataDebitur,
                              tanggalLahirPasangan: new Date(e),
                            },
                          },
                        }))
                      }
                      required
                      layout="col"
                      disabled={
                        action
                          ? action === "View" || action === "Proses"
                            ? true
                            : false
                          : false
                      }
                    />
                  </div>
                </div>
                <div className="flex gap-2 my-1">
                  <div className="flex-1">
                    <InputUtil
                      label="No Telepon Pasangan"
                      type="Input"
                      value={data.DetailDapem.DataDebitur.noTeleponPasangan}
                      onChange={(e: string) =>
                        setData((prev) => ({
                          ...prev,
                          DetailDapem: {
                            ...prev.DetailDapem,
                            DataDebitur: {
                              ...prev.DetailDapem.DataDebitur,
                              noTeleponPasangan: e,
                            },
                          },
                        }))
                      }
                      required
                      layout="col"
                      disabled={
                        action
                          ? action === "View" || action === "Proses"
                            ? true
                            : false
                          : false
                      }
                    />
                  </div>
                  <div className="flex-1">
                    <InputUtil
                      label="Pekerjaan Pasangan"
                      type="Select"
                      value={data.DetailDapem.DataDebitur.pekerjaanPasangan}
                      onChange={(e: string) =>
                        setData((prev) => ({
                          ...prev,
                          DetailDapem: {
                            ...prev.DetailDapem,
                            DataDebitur: {
                              ...prev.DetailDapem.DataDebitur,
                              pekerjaanPasangan: e,
                            },
                          },
                        }))
                      }
                      options={[
                        { label: "Tidak Bekerja", value: "Tidak Bekerja" },
                        { label: "Karyawan Swasta", value: "Karyawan Swasta" },
                        { label: "Wiraswasta", value: "Wiraswasta" },
                        { label: "Pedagang", value: "Pedagang" },
                      ]}
                      required
                      layout="col"
                      disabled={
                        action
                          ? action === "View" || action === "Proses"
                            ? true
                            : false
                          : false
                      }
                    />
                  </div>
                </div>
              </>
            )}
            <div className="bg-green-500 p-2 rounded text-white text-center my-4">
              Data Keluarga
            </div>
            <div className="flex gap-2 my-1">
              <div className="flex-1">
                <InputUtil
                  label="Nama Lengkap"
                  type="Input"
                  value={keluarga.nama}
                  onChange={(e: string) =>
                    setKeluarga((prev) => ({
                      ...prev,
                      nama: e,
                    }))
                  }
                  required
                  layout="col"
                  disabled={
                    action
                      ? action === "View" || action === "Proses"
                        ? true
                        : false
                      : false
                  }
                />
              </div>
              <div className="flex-1">
                <InputUtil
                  label="Hubungan"
                  type="Input"
                  value={keluarga.hubungan}
                  onChange={(e: string) =>
                    setKeluarga((prev) => ({
                      ...prev,
                      hubungan: e,
                    }))
                  }
                  required
                  layout="col"
                  disabled={
                    action
                      ? action === "View" || action === "Proses"
                        ? true
                        : false
                      : false
                  }
                />
              </div>
            </div>
            <div className="flex gap-2 my-1">
              <div className="flex-1">
                <InputUtil
                  label="No Telepon"
                  type="Input"
                  value={keluarga.noTelepon}
                  onChange={(e: string) =>
                    setKeluarga((prev) => ({
                      ...prev,
                      noTelepon: e,
                    }))
                  }
                  required
                  layout="col"
                  disabled={
                    action
                      ? action === "View" || action === "Proses"
                        ? true
                        : false
                      : false
                  }
                />
              </div>
              <div className="flex-1">
                <InputUtil
                  label="Jenis Kelamin"
                  type="Select"
                  value={keluarga.gender}
                  onChange={(e: EGender) =>
                    setKeluarga((prev) => ({
                      ...prev,
                      gender: e,
                    }))
                  }
                  options={[
                    { label: "Laki - Laki", value: "Laki_laki" },
                    { label: "Perempuan", value: "Perempuan" },
                  ]}
                  required
                  layout="col"
                  disabled={
                    action
                      ? action === "View" || action === "Proses"
                        ? true
                        : false
                      : false
                  }
                />
              </div>
            </div>
            <div className="flex gap-2 my-1">
              <div className="flex-1">
                <InputUtil
                  label="Alamat"
                  type="Area"
                  value={keluarga.alamat}
                  onChange={(e: string) =>
                    setKeluarga((prev) => ({
                      ...prev,
                      alamat: e,
                    }))
                  }
                  required
                  layout="col"
                  disabled={
                    action
                      ? action === "View" || action === "Proses"
                        ? true
                        : false
                      : false
                  }
                />
              </div>
            </div>
            <div>
              <div className="bg-green-500 p-2 rounded text-white text-center my-4">
                Data Pembiayaan
              </div>
              <UISimulation
                action={action}
                currdata={currData ? currData : undefined}
                setCurrData={setData}
              />
            </div>
            <div className="flex gap-2 my-1">
              <div className="flex-1">
                <InputUtil
                  label="Tujuan Penggunaan"
                  type="Area"
                  value={data.DetailDapem.tujuanPenggunaan}
                  onChange={(e: string) =>
                    setData((prev) => ({
                      ...prev,
                      DetailDapem: { ...prev.DetailDapem, tujuanPenggunaan: e },
                    }))
                  }
                  required
                  layout="col"
                  disabled={
                    action
                      ? action === "View" || action === "Proses"
                        ? true
                        : false
                      : false
                  }
                />
              </div>
            </div>
            <div>
              <div className="bg-green-500 p-2 rounded text-white text-center my-4">
                Data Marketing
              </div>
              <div className="flex gap-2 my-1">
                <div className="flex-1">
                  <InputUtil
                    label="Marketing"
                    type="Select"
                    value={data.userId || ""}
                    onChange={(e: string) =>
                      setData((prev) => ({ ...prev, userid: e }))
                    }
                    options={users.map((m) => ({
                      label: m.namaLengkap,
                      value: m.id,
                    }))}
                    required
                    layout="col"
                    disabled={
                      action
                        ? action === "View" || action === "Proses"
                          ? true
                          : false
                        : false
                    }
                  />
                </div>
                <div className="flex-1">
                  <InputUtil
                    label="Fee Marketing"
                    type="Number"
                    value={data.DetailDapem.fee}
                    onChange={(e: number) =>
                      setData((prev) => ({
                        ...prev,
                        DetailDapem: {
                          ...prev.DetailDapem,
                          fee: e,
                        },
                      }))
                    }
                    required
                    layout="col"
                    disabled={
                      action
                        ? action === "View" || action === "Proses"
                          ? true
                          : false
                        : false
                    }
                  />
                </div>
              </div>
            </div>
            {(!action || action === "Update") && (
              <>
                <div className="bg-green-500 p-2 rounded text-white text-center my-4">
                  Berkas - Berkas
                </div>
                <div className="flex flex-col gap-1">
                  <FileUpload
                    fileType={"application/pdf"}
                    label="Berkas Pengajuan"
                    currData={data.DetailDapem.berkasPengajuan || ""}
                    onChange={(e: string) =>
                      setData((prev) => ({
                        ...prev,
                        DetailDapem: {
                          ...prev.DetailDapem,
                          berkasPengajuan: e,
                        },
                      }))
                    }
                  />
                  <FileUpload
                    fileType={"video/mp4"}
                    label="Video Wawancara"
                    currData={data.DetailDapem.videoWawancara || ""}
                    onChange={(e: string) =>
                      setData((prev) => ({
                        ...prev,
                        DetailDapem: {
                          ...prev.DetailDapem,
                          videoWawancara: e,
                        },
                      }))
                    }
                  />
                </div>
              </>
            )}
          </div>
          <div className="flex-1">
            <Tabs
              items={[
                {
                  label: "Berkas Pembanding",
                  children: (
                    <div>
                      <p>Data Pembanding Sebelumnya</p>
                    </div>
                  ),
                  key: "berkasPembanding",
                },
                {
                  label: "Berkas Pengajuan",
                  children: (
                    <div className="h-[65vh]">
                      {data.DetailDapem.berkasPengajuan ? (
                        <iframe
                          src={data.DetailDapem.berkasPengajuan || undefined}
                          width="100%"
                          height="100%"
                        >
                          Error File
                        </iframe>
                      ) : (
                        <p>Berkas Belum di Upload</p>
                      )}
                    </div>
                  ),
                  key: "berkasPengajuan",
                },
                {
                  label: "Video Wawancara",
                  children: (
                    <div className="h-[65vh]">
                      {data.DetailDapem.videoWawancara ? (
                        <iframe
                          src={data.DetailDapem.videoWawancara || undefined}
                          width="100%"
                          height="100%"
                        ></iframe>
                      ) : (
                        <p>Berkas Belum di Upload</p>
                      )}
                    </div>
                  ),
                  key: "videoWawancara",
                },
                action === "Proses" &&
                !["BATAL", "TOLAK", "SELESAI"].includes(
                  data.DetailDapem.statusCair
                )
                  ? {
                      label: "Proses Data",
                      children: (
                        <ProsesPengajuan currData={data} setData={setData} />
                      ),
                      key: "proses",
                    }
                  : { key: "notProses", label: "" },
              ]}
            />
          </div>
        </div>
      </Modal>
      <NotificationModal data={modalMessage} setData={setModalMessage} />
    </div>
  );
};

const defaultData: IDapem = {
  id: "",
  tanggal: new Date(),
  gajiBersih: 0,
  tenor: 0,
  plafon: 0,
  angsuran: 0,
  byAdmin: 0,
  byTabungan: 0,
  byMaterai: 0,
  byTatalaksana: 0,
  blokir: 0,
  penalty: 0,
  pelunasan: 0,
  margin: 0,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),

  ProPem: {
    id: "",
    name: "",
    maxTenor: 0,
    maxPlafon: 0,
    byAdmin: 0,
    byTabungan: 0,
    byMaterai: 0,
    byTatalaksana: 0,
    unit: 0,
    margin: 0,

    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  JePem: {
    id: "",
    name: "",
    penalty: 0,

    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  User: {
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
  },
  DetailDapem: {
    id: "",
    berkasPengajuan: null,
    videoWawancara: null,
    status: "SAVED",
    tanggalStatus: null,
    keterangan: null,
    statusCair: "ANTRI",
    statusLunas: false,
    tanggalCair: null,
    noAkad: null,
    tanggalAkad: null,
    berkasAkad: null,
    buktiPencairan: null,
    nominalPencairan: null,
    buktiPencairan1: null,
    nominalPencairan1: null,
    buktiPencairan2: null,
    nominalPencairan2: null,
    fee: 0,
    buktiFee: null,
    tujuanPenggunaan: null,
    pemeriksa: null,

    User: {
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
    },
    DataDebitur: {
      id: "",
      nama: "",
      nik: "",
      noKK: "",
      tanggalLahir: new Date(),
      alamat: "",
      kelurahan: "",
      kecamatan: "",
      kota: "",
      provinsi: "",
      kodePos: "",
      geoLokasi: "",
      noTelepon: "",
      gender: "Laki_laki",
      pekerjaan: "",
      alamatPekerjaan: "",
      namaPasangan: null,
      nikPasangan: null,
      tanggalLahirPasangan: null,
      pekerjaanPasangan: null,
      alamatPasangan: null,
      noTeleponPasangan: null,
      statusKawin: "BELUMKAWIN",
      DataKeluarga: [
        {
          id: "",
          nama: "",
          noTelepon: "",
          hubungan: "",
          alamat: "",
          gender: "Laki_laki",
          dataDebiturId: "",
        },
      ],
    },
    userId: "",
    dataDebiturId: "",
  },
  proPemId: "",
  jePemId: "",
  userId: "",
  detailDapemId: "",
};
