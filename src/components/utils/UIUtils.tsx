"use client";

import { FileOutlined, PrinterOutlined } from "@ant-design/icons";
import { Button, Modal } from "antd";
import { useState } from "react";
import { UIAkad } from "./AkadUtils";
import { ModalMessageProps } from "./ServerUtils";

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
