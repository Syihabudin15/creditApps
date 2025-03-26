"use client";

import { LoadingOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";

export const ViewArchive = dynamic(
  () => import("@/components/utils/UIUtils").then((d) => d.ViewArchive),
  {
    ssr: false,
    loading: () => <LoadingOutlined />,
  }
);
export const NotificationModal = dynamic(
  () => import("@/components/utils/UIUtils").then((d) => d.NotificationModal),
  {
    ssr: false,
    loading: () => <LoadingOutlined />,
  }
);
export const CreateAkad = dynamic(
  () => import("@/components/utils/UIUtils").then((d) => d.CreateAkad),
  {
    ssr: false,
    loading: () => <LoadingOutlined />,
  }
);
