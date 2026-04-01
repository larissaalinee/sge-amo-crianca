import { ModuleProtection } from "../ModuleProtection";
import { WeeklySchedule } from "../schedule/WeeklySchedule";

export function AgendaWrapper() {
  return (
    <ModuleProtection module="agenda">
      <WeeklySchedule />
    </ModuleProtection>
  );
}
