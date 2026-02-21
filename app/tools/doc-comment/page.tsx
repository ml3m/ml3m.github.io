import { Metadata } from "next";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import DocCommentConverter from "@/components/tools/DocCommentConverter";

export const metadata: Metadata = { title: "Doc Comment Converter" };

export default function DocCommentPage() {
  return (
    <ToolPageLayout title="Doc Comment Converter">
      <DocCommentConverter />
    </ToolPageLayout>
  );
}
