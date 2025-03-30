"use client";

import { FormOutlined, PlusCircleFilled } from "@ant-design/icons";
import { Button, Modal, Tabs } from "antd";
import { useState } from "react";
import { InputUtil } from "../utils";
import { IDapem } from "../IInterfaces";
import { FileUpload } from ".";

export const CreateOrUpdate = ({
  currData,
  action,
}: {
  currData?: any;
  action?: "View" | "Update";
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<IDapem>(defaultData);

  return (
    <div>
      <Button
        icon={currData ? <FormOutlined /> : <PlusCircleFilled />}
        type="primary"
        size="small"
        onClick={() => setOpen(true)}
        loading={loading}
        disabled={loading}
      >
        {!currData && "New"}
      </Button>
      <Modal
        title={currData ? "Edit Pengajuan" : "Tambah Pengajuan Baru"}
        open={open}
        onClose={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        width={"98vw"}
        style={{ top: 5 }}
        footer={[
          <Button
            key={"submit"}
            type="primary"
            loading={loading}
            disabled={loading}
            onClick={() => console.log(data)}
          >
            Submit
          </Button>,
        ]}
      >
        <div className="flex flex-col sm:flex-row gap-4 my-4">
          <div className="flex-1">
            <div className="bg-green-500 p-2 rounded text-white text-center my-2">
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
                  disabled={action ? (action === "View" ? true : false) : false}
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
                  disabled={action ? (action === "View" ? true : false) : false}
                />
              </div>
            </div>
            <div className="flex gap-2 my-1">
              <div className="flex-1">
                <InputUtil
                  label="Tanggal Lahir"
                  type="Date"
                  value={data.DetailDapem.DataDebitur.tanggalLahir}
                  onChange={(e: Date) =>
                    setData((prev) => ({
                      ...prev,
                      DetailDapem: {
                        ...prev.DetailDapem,
                        DataDebitur: {
                          ...prev.DetailDapem.DataDebitur,
                          tanggalLahir: e,
                        },
                      },
                    }))
                  }
                  required
                  layout="col"
                  disabled={action ? (action === "View" ? true : false) : false}
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
                  disabled={action ? (action === "View" ? true : false) : false}
                />
              </div>
            </div>
            <div className="bg-green-500 p-2 rounded text-white text-center my-2">
              Berkas - Berkas
            </div>
            <div>
              <FileUpload
                fileType={["image/png"]}
                label="Berkas Pengajuan"
                onChange={(e: string) =>
                  setData((prev) => ({
                    ...prev,
                    DetailDapem: { ...prev.DetailDapem, berkasPengajuan: e },
                  }))
                }
              />
            </div>
          </div>
          <div className="flex-1">
            <Tabs
              items={[
                {
                  label: "Berkas Pengajuan",
                  children: <>OKE</>,
                  key: "berkasPengajuan",
                },
                {
                  label: "Video Wawancara",
                  children: <>OKE</>,
                  key: "videoWawancara",
                },
              ]}
            />
          </div>
        </div>
      </Modal>
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
    berkasPengajuan: "",
    videoWawancara: "",
    status: "SAVED",
    tanggalStatus: new Date(),
    keterangan: "",
    statusCair: "PENDING",
    tanggalCair: new Date(),
    noAkad: "",
    tanggalAkad: new Date(),
    berkasAkad: "",
    buktiPencairan: "",
    nominalPencairan: 0,
    buktiPencairan1: "",
    nominalPencairan1: 0,
    buktiPencairan2: "",
    nominalPencairan2: 0,
    fee: 0,
    buktiFee: "",
    tujuanPenggunaan: "",

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
      statusKawin: "BELUMKAWIN",
      DataKeluarga: [],
    },
    userId: "",
    dataDebiturId: "",
  },
  proPemId: "",
  jePemId: "",
  userId: "",
  detailDapemId: "",
};
