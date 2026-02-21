import { Metadata } from "next";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import ByondCkey from "@/components/tools/ByondCkey";

export const metadata: Metadata = { title: "BYOND Key to Ckey Converter" };

export default function ByondCkeyPage() {
  return (
    <ToolPageLayout title="BYOND Key to Ckey Converter" description="Converts BYOND keys to ckeys.">
      <ByondCkey />
    </ToolPageLayout>
  );
}
