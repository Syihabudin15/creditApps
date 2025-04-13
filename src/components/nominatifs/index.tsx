"use client";
import { LoadingOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";

const UINominatif = dynamic(
  () => import("@/components/nominatifs/Utils").then((d) => d.UI),
  {
    ssr: false,
    loading: () => <LoadingOutlined />,
  }
);

export { UINominatif };
