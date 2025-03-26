import { UISubmission } from "@/components/submissions";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submission",
};

export default function Page() {
  return (
    <div>
      <UISubmission />
    </div>
  );
}
