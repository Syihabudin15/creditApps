import { UISimulation } from "@/components/submissions";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Simulation",
};

export default function Page() {
  return <UISimulation />;
}
