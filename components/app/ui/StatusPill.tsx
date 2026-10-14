export function StatusPill({
  status,
}: {
  status: "aman" | "rendah" | "menipis";
}) {
  const styles = {
    aman: "bg-[#e6f6ec] text-cx-ok",
    rendah: "bg-[#fff1e6] text-cx-orange-d",
    menipis: "bg-[#fff1e6] text-cx-orange-d",
  };
  const label = {
    aman: "Aman",
    rendah: "Rendah",
    menipis: "Menipis",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold ${styles[status]}`}
    >
      {label[status]}
    </span>
  );
}