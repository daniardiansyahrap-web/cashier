import Link from "next/link";
import { ReactNode } from "react";

export function SectionHeader({
  title,
  link,
  linkLabel = "Semua",
}: {
  title: ReactNode;
  link?: string;
  linkLabel?: string;
}) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-[17px] font-extrabold text-cx-navy tracking-[-0.02em]">
        {title}
      </h2>
      {link && (
        <Link
          href={link}
          className="text-[13px] font-semibold text-cx-blue hover:underline"
        >
          {linkLabel} ›
        </Link>
      )}
    </div>
  );
}