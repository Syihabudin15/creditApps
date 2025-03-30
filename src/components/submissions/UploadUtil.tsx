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
  fileType: string[];
  onChange: Function;
  currData?: string;
}) => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [filename, setFilename] = useState<string>("");
  const [errorMsg, setErrMsg] = useState<string>("");

  const beforeUpload = (file: FileType) => {
    const isJpgOrPng = fileType.filter((ft) => ft === file.type);
    if (!isJpgOrPng || isJpgOrPng.length === 0) {
      setErrMsg(
        `Format file tidak sesuai!. Hanya menerima ${fileType.join("/")}`
      );
      return false;
    }
    return true;
  };

  const handleUpload = async (options: any) => {
    setLoading(true);
    const { onSuccess, onError, file, onProgress } = options;
    const base64 = await getBase64(file);
    try {
      // const res = await axios.post(
      //   url,
      //   {
      //     file: base64,
      //     dir: dir,
      //     ext: currExt,
      //     id: id,
      //   },
      //   {
      //     headers: { "Content-Type": "Application/json" },
      //     onUploadProgress: (event: any) => {
      //       setProgress(1);
      //       const percent = Math.floor((event.loaded / event.total) * 100);
      //       setProgress(percent);
      //       if (percent === 100) {
      //         setProgress(100);
      //       }
      //       onProgress({ percent: (event.loaded / event.total) * 100 });
      //     },
      //   }
      // );
      // setCurrUrl(res.data.url);

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
    // const res = await fetch(url, {
    //   headers: { "Content-Type": "Application/json" },
    //   method: "DELETE",
    //   body: JSON.stringify({ id: id, url: currUrl }),
    // });
    // if (res.ok) {
    //   setCurrUrl(undefined);
    //   setProgress(0);
    //   setUrl((prev: any) => {
    //     return {
    //       ...prev,
    //       [pathName]: null,
    //       [`tanggal_${
    //         pathName === "berkas_akad"
    //           ? "akad"
    //           : pathName === "video_penyerahan"
    //           ? "video_cair"
    //           : pathName
    //       }`]: null,
    //     };
    //   });
    // } else {
    //   message.error(`Gagal hapus berkas!`);
    // }
    setLoading(false);
  };

  useEffect(() => {
    if (currData) setFilename(currData);
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
          <p className="opacity-60">{filename}</p>
        ) : (
          <Upload
            beforeUpload={beforeUpload}
            accept={fileType.join(", ")}
            multiple={false}
            showUploadList={false}
            customRequest={(options) => handleUpload(options)}
          >
            <Button
              size="small"
              className="bg-green-500 hover:bg-green-600"
              type="primary"
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
            ></Button>
          </div>
        )}
      </div>
    </div>
  );
};
