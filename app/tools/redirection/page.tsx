import { Metadata } from "next";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import RedirectionTool from "@/components/tools/RedirectionTool";

export const metadata: Metadata = { title: "Redirection Tool" };

export default function RedirectionPage() {
  return (
    <ToolPageLayout title="Redirection Tool">
      <RedirectionTool />
    </ToolPageLayout>
  );
}
