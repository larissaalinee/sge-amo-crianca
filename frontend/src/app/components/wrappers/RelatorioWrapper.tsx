import { ModuleProtection } from "../ModuleProtection";
import { WeeklyReport } from "../reports/WeeklyReport";

export function RelatorioWrapper() {
  return (
    <ModuleProtection module="relatorio-semanal">
      <WeeklyReport />
    </ModuleProtection>
  );
}
