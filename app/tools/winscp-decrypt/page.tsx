import { Metadata } from "next";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import WinScpDecryptor from "@/components/tools/WinScpDecryptor";

export const metadata: Metadata = { title: "WinSCP Password Decryptor" };

export default function WinScpDecryptPage() {
  return (
    <ToolPageLayout title="WinSCP Password Decryptor">
      <WinScpDecryptor />
    </ToolPageLayout>
  );
}
