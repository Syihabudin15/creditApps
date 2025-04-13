"use client";

import { FileOutlined, PrinterOutlined } from "@ant-design/icons";
import { Button, Input, Modal, Select } from "antd";
import { useState } from "react";
import { UIAkad } from "./";
import { ModalMessageProps } from "./ServerUtils";
import moment from "moment";
import { IDapem } from "../IInterfaces";

export const InputUtils = ({
  type,
  label,
  value,
  onChange,
  required,
  options,
  wLabel,
  layout,
  disabled,
}: {
  type: "Input" | "Select" | "Area" | "Password" | "Date" | "Number";
  label: string;
  value: any;
  onChange: Function;
  required?: boolean;
  options?: any;
  wLabel?: number;
  layout?: "row" | "col";
  disabled?: boolean;
}) => (
  <div
    className={`flex gap-2 items-${
      layout && layout === "row" ? "center" : "start"
    } flex-${layout || "row"}`}
  >
    <p className={`w-${wLabel || "44"} flex gap-1`}>
      {required && <span style={{ fontSize: 10, color: "red" }}>*</span>}
      <span>{label}</span>
    </p>
    <p className={`${layout && layout === "col" && "hidden"}`}>:</p>
    <div className="w-full">
      {type === "Input" && (
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled || false}
        />
      )}
      {type === "Select" && (
        <Select
          value={value}
          onChange={(e) => onChange(e)}
          options={options}
          defaultValue={value}
          className="w-full"
          disabled={disabled || false}
        />
      )}
      {type === "Area" && (
        <Input.TextArea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled || false}
        >
          {value}
        </Input.TextArea>
      )}
      {type === "Password" && (
        <Input.Password
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled || false}
        />
      )}
      {type === "Date" && (
        <Input
          value={moment(value).format("YYYY-MM-DD")}
          type="date"
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled || false}
        />
      )}
      {type === "Number" && (
        <Input
          value={value}
          type="number"
          onChange={(e) => onChange(parseFloat(e.target.value || "0"))}
          disabled={disabled || false}
        />
      )}
    </div>
  </div>
);
export const ViewArchive = ({ title, src }: { title: string; src: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <Button
        size="small"
        type="primary"
        disabled={!src}
        onClick={() => setOpen(true)}
      >
        <FileOutlined />
      </Button>
      <Modal
        title={title.toUpperCase()}
        open={open}
        onCancel={() => setOpen(false)}
        onClose={() => setOpen(false)}
        wrapClassName="w-[98vw] sm:w-[80vw] mx-auto"
        width={"100%"}
        footer={[]}
        className="top-5"
      >
        <div className="w-full h-[80vh]">
          <iframe src={src} width="100%" height="100%"></iframe>
        </div>
      </Modal>
    </div>
  );
};

export const NotificationModal = ({
  data,
  setData,
}: {
  data: ModalMessageProps;
  setData: Function;
}) => {
  return (
    <Modal
      title={
        <p
          className={`font-bold text-xl ${
            data.type === "error" ? "text-red-500" : "text-green-500"
          }`}
        >
          {data.title}
        </p>
      }
      open={data.show}
      onCancel={() =>
        setData((prev: ModalMessageProps) => ({ ...prev, show: false }))
      }
      onClose={() =>
        setData((prev: ModalMessageProps) => ({ ...prev, show: false }))
      }
      footer={[]}
    >
      {data.desc}
    </Modal>
  );
};

export const CreateAkad = ({ currData }: { currData: IDapem }) => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<IDapem>(currData);
  const [ketAkad, setKetAkad] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCetak = async () => {
    setLoading(true);
    await fetch("/api/dapem", {
      method: "PUT",
      headers: { "Content-type": "Application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res) => {
        setOpen(true);
        setKetAkad(false);
      })
      .catch((err) => {
        console.log(err);
      });
    setLoading(false);
  };

  return (
    <div>
      <Button
        size="small"
        type="primary"
        ghost
        onClick={() => setKetAkad(true)}
        disabled={currData.DetailDapem.status === "SETUJU" ? false : true}
      >
        <PrinterOutlined />
      </Button>
      <Modal
        open={ketAkad}
        onCancel={() => setKetAkad(false)}
        onClose={() => setKetAkad(false)}
        footer={[
          <Button
            key={"cetak"}
            type="primary"
            loading={loading}
            size="small"
            disabled={
              !data.DetailDapem.noAkad || !data.DetailDapem.tanggalAkad
                ? true
                : loading
            }
            onClick={() => {
              setKetAkad(false);
              handleCetak();
            }}
          >
            Cetak
          </Button>,
        ]}
        title={
          "CETAK AKAD " + currData.DetailDapem.DataDebitur.nama.toUpperCase()
        }
      >
        <div className="my-4 flex flex-col gap-2">
          <InputUtils
            label="Nomor NIK"
            value={currData.DetailDapem.DataDebitur.nik}
            disabled
            type="Input"
            onChange={() => {}}
          />
          <InputUtils
            label="Nama Pemohon"
            value={currData.DetailDapem.DataDebitur.nama}
            disabled
            type="Input"
            onChange={() => {}}
          />
          <InputUtils
            label="Nomor Akad"
            value={
              data.DetailDapem.noAkad ||
              "{NO}/KOPJASFAS/W/I/" + moment().format("MMYYYY")
            }
            type="Input"
            onChange={(e: string) =>
              setData((prev) => ({
                ...prev,
                DetailDapem: { ...prev.DetailDapem, noAkad: e },
              }))
            }
          />
          <InputUtils
            label="Tanggal Akad"
            value={data.DetailDapem.tanggalAkad}
            type="Date"
            onChange={(e: string) =>
              setData((prev) => ({
                ...prev,
                DetailDapem: { ...prev.DetailDapem, tanggalAkad: new Date(e) },
              }))
            }
          />
        </div>
      </Modal>
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        onClose={() => setOpen(false)}
        wrapClassName="w-[98vw] sm:w-[80vw] mx-auto"
        width={"100%"}
        footer={[]}
        className="top-5"
        title={"AKAD " + currData.DetailDapem.DataDebitur.nama.toUpperCase()}
      >
        <div className="h-[80vh]">
          <UIAkad currData={data} />
        </div>
      </Modal>
    </div>
  );
};
