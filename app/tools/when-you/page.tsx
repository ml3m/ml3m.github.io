import { Metadata } from "next";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import WhenYouGenerator from "@/components/tools/WhenYouGenerator";

export const metadata: Metadata = { title: "When You Generator" };

export default function WhenYouPage() {
  return (
    <ToolPageLayout title="When You Generator" description="yep...">
      <WhenYouGenerator />
    </ToolPageLayout>
  );
}
