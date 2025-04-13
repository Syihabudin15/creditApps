"use client";

import { CloudUploadOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button, GetProp, Progress, Upload, UploadProps } from "antd";
import { useEffect, useState } from "react";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (file: any) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

export const FileUpload = ({
  label,
  fileType,
  onChange,
  currData,
}: {
  label: string;
  fileType: string;
  onChange: Function;
  currData?: string;
}) => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [filename, setFilename] = useState<string>("");
  const [errorMsg, setErrMsg] = useState<string>("");

  const beforeUpload = (file: FileType) => {
    const isJpgOrPng = fileType === file.type;
    if (!isJpgOrPng) {
      setErrMsg(`Format file tidak sesuai!. Hanya menerima ${fileType}`);
      return false;
    }
    return true;
  };

  const handleUpload = async (options: any) => {
    setLoading(true);
    const { file } = options;
    try {
      const base64 = (await getBase64(file)) as unknown as string;

      setFilename(file.name);
      setProgress(100);
      onChange(base64);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setErrMsg("Upload Failed!");
      setProgress(0);
      setLoading(false);
    }
  };
  const handleDelete = async () => {
    setLoading(true);
    setFilename("");
    setProgress(0);
    onChange(null);
    setLoading(false);
  };

  useEffect(() => {
    if (currData) {
      console.log(currData);
      setFilename((Math.random() * 1000).toString());
      setProgress(100);
    }
  }, []);

  return (
    <div className="my-2 border-b">
      <div className="flex gap-2 justify-between items-center pb-1">
        <p className="w-44">{label}</p>
        <p className="text-xs italic text-red-500">{errorMsg && errorMsg}</p>
        {progress !== 100 && progress !== 0 && (
          <Progress percent={progress} className="w-80" type="line" />
        )}
        {filename ? (
          <p className="opacity-60 w-80">{filename}</p>
        ) : (
          <Upload
            beforeUpload={beforeUpload}
            accept={fileType}
            multiple={false}
            showUploadList={false}
            customRequest={(options) => handleUpload(options)}
          >
            <Button
              size="small"
              className="bg-green-500 hover:bg-green-600"
              type="primary"
              loading={loading}
            >
              <CloudUploadOutlined />
            </Button>
          </Upload>
        )}
        {filename && (
          <div>
            <Button
              icon={<DeleteOutlined />}
              danger
              size="small"
              onClick={() => handleDelete()}
              loading={loading}
            ></Button>
          </div>
        )}
      </div>
    </div>
  );
};
