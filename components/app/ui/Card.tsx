import { ReactNode } from "react";

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-white rounded-[22px] border border-cx-line ${className}`}
    >
      {children}
    </div>
  );
}