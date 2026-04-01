import { ModuleProtection } from "../ModuleProtection";
import { ProfessionalSchedule } from "../professional/ProfessionalSchedule";

export function ProfessionalScheduleWrapper() {
  return (
    <ModuleProtection module="agenda">
      <ProfessionalSchedule />
    </ModuleProtection>
  );
}
