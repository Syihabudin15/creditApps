import { UIJePem } from "@/components/master";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jenis Pembiayaan",
};

export default function Page() {
  return (
    <div>
      <UIJePem />
    </div>
  );
}
