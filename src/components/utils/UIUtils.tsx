"use client";

import { FileOutlined, PrinterOutlined } from "@ant-design/icons";
import { Button, Input, Modal, Select } from "antd";
import { useState } from "react";
import { UIAkad } from "./AkadUtils";
import { ModalMessageProps } from "./ServerUtils";

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
  type: "Input" | "Select" | "Area" | "Password" | "Date";
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
          value={value}
          type="date"
          onChange={(e) => onChange(new Date(e.target.value))}
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

export const CreateAkad = ({ title }: { title: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <Button size="small" type="primary" ghost onClick={() => setOpen(true)}>
        <PrinterOutlined />
      </Button>
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        onClose={() => setOpen(false)}
        wrapClassName="w-[98vw] sm:w-[80vw] mx-auto"
        width={"100%"}
        footer={[]}
        className="top-5"
        title={"CETAK AKAD " + title}
      >
        <div className="h-[80vh]">
          <UIAkad title={title} />
        </div>
      </Modal>
    </div>
  );
};
