import { ModuleProtection } from "../ModuleProtection";
import { ProfessionalForm } from "../professionals/ProfessionalForm";

export function ProfessionalFormWrapper() {
  return (
    <ModuleProtection module="profissionais">
      <ProfessionalForm />
    </ModuleProtection>
  );
}
