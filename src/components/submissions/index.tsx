"use client";

import { LoadingOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";

export const UISubmission = dynamic(
  () => import("@/components/submissions/Submission").then((d) => d.UI),
  {
    ssr: false,
    loading: () => <LoadingOutlined />,
  }
);
export const CreateOrUpdate = dynamic(
  () =>
    import("@/components/submissions/SubmissionUtils").then(
      (d) => d.CreateOrUpdate
    ),
  {
    ssr: false,
    loading: () => <LoadingOutlined />,
  }
);
export const FileUpload = dynamic(
  () => import("@/components/submissions/UploadUtil").then((d) => d.FileUpload),
  {
    ssr: false,
    loading: () => <LoadingOutlined />,
  }
);
export const UISimulation = dynamic(
  () => import("@/components/submissions/Simulations").then((d) => d.UI),
  {
    ssr: false,
    loading: () => <LoadingOutlined />,
  }
);
export const ModalDelete = dynamic(
  () =>
    import("@/components/submissions/Submission").then((d) => d.ModalDelete),
  {
    ssr: false,
    loading: () => <LoadingOutlined />,
  }
);
export const ProsesPengajuan = dynamic(
  () =>
    import("@/components/submissions/Submission").then(
      (d) => d.ProsesPengajuan
    ),
  {
    ssr: false,
    loading: () => <LoadingOutlined />,
  }
);
