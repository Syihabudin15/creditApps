import { UINominatif } from "@/components/nominatifs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nominatif",
};

export default function Page() {
  return (
    <div>
      <UINominatif />
    </div>
  );
}
