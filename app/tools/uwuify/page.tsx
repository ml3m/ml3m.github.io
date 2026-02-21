import { Metadata } from "next";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import UwuifyTool from "@/components/tools/UwuifyTool";

export const metadata: Metadata = { title: "Fluffy Tongue Converter (uwuify)" };

export default function UwuifyPage() {
  return (
    <ToolPageLayout title="Fluffy Tongue Converter (uwuify)">
      <UwuifyTool />
    </ToolPageLayout>
  );
}
