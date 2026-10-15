import { DashboardHeroMobile } from "./DashboardHeroMobile";
import { DashboardHeroDesktop } from "./DashboardHeroDesktop";

export function DashboardHero({
  userName,
  outletName,
  lowStockCount,
}: {
  userName: string;
  outletName: string;
  lowStockCount: number;
}) {
  return (
    <>
      <DashboardHeroMobile
        userName={userName}
        outletName={outletName}
        lowStockCount={lowStockCount}
      />
      <DashboardHeroDesktop
        userName={userName}
        outletName={outletName}
        lowStockCount={lowStockCount}
      />
    </>
  );
}