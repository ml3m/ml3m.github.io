import NeonCard from "@/components/ui/NeonCard";
import PixelButton from "@/components/ui/PixelButton";
import { linkTable } from "@/lib/links";
import { Github } from "lucide-react";

export default function LinksSection() {
  return (
    <div className="space-y-3">
      <p className="text-center text-text-secondary">links and garbage</p>
      <NeonCard>
        <table className="w-full text-[0.85rem] table-fixed">
          <tbody>
            {linkTable.map((link) => (
              <tr key={link.label}>
                <td className="text-text-muted pr-4 py-1 whitespace-nowrap w-24">
                  {link.label}
                </td>
                <td className="py-1 overflow-hidden text-ellipsis">
                  <a href={link.href} target="_blank" rel="noopener noreferrer" className="break-all">
                    {link.href}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </NeonCard>

      <div className="flex justify-center gap-3 flex-wrap">
        <PixelButton
          href="https://github.com/TODO-your-username/mlem.vi"
          external
        >
          <Github size={16} />
          GitHub Repo
        </PixelButton>
      </div>
    </div>
  );
}
