"use client";
import { LoadingOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";

const UIPemberkasan = dynamic(
  () => import("@/components/pemberkasan/Utils").then((d) => d.UI),
  {
    ssr: false,
    loading: () => <LoadingOutlined />,
  }
);

export { UIPemberkasan };
