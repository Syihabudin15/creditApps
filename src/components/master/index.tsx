"use client";

import { LoadingOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";

export const UIUser = dynamic(
  () => import("@/components/master/User").then((d) => d.DataKaryawan),
  { ssr: false, loading: () => <LoadingOutlined /> }
);
export const UIProduct = dynamic(
  () => import("@/components/master/Product").then((d) => d.UI),
  { ssr: false, loading: () => <LoadingOutlined /> }
);
export const UIJePem = dynamic(
  () => import("@/components/master/Jenis").then((d) => d.UI),
  { ssr: false, loading: () => <LoadingOutlined /> }
);
