import { Metadata } from "next";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import DipSwitch from "@/components/tools/DipSwitch";

export const metadata: Metadata = { title: "8 Bit Dip Switch Calculator" };

export default function DipSwitchPage() {
  return (
    <ToolPageLayout title="8 Bit Dip Switch Calculator" description="because it doesn't exist or i am just really stupid and blind.">
      <DipSwitch />
    </ToolPageLayout>
  );
}
