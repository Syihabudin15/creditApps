import { UIProduct } from "@/components/master";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Produk Pembiayaan",
};

export default function Page() {
  return (
    <div>
      <UIProduct />
    </div>
  );
}
