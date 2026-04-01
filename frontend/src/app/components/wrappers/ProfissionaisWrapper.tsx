import { ModuleProtection } from "../ModuleProtection";
import { ProfessionalsList } from "../professionals/ProfessionalsList";

export function ProfissionaisWrapper() {
  return (
    <ModuleProtection module="profissionais">
      <ProfessionalsList />
    </ModuleProtection>
  );
}
