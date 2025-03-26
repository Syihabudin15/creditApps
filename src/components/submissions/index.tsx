"use client";

import { LoadingOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";

const UISubmission = dynamic(
  () => import("@/components/submissions/Submission").then((d) => d.UI),
  {
    ssr: false,
    loading: () => <LoadingOutlined />,
  }
);
const UISimulation = dynamic(
  () => import("@/components/submissions/Simulations").then((d) => d.UI),
  {
    ssr: false,
    loading: () => <LoadingOutlined />,
  }
);

export { UISubmission, UISimulation };
