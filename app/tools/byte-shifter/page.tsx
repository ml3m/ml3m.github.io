import { Metadata } from "next";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import ByteShifter from "@/components/tools/ByteShifter";

export const metadata: Metadata = { title: "Byte Shifter" };

export default function ByteShifterPage() {
  return (
    <ToolPageLayout title="Byte Shifter" description="Shift bytes in a file by a certain amount.">
      <ByteShifter />
    </ToolPageLayout>
  );
}
