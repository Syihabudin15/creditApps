import { UIPemberkasan } from "@/components/pemberkasan";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pemberkasan",
};

export default function Page() {
  return (
    <div>
      <UIPemberkasan />
    </div>
  );
}
