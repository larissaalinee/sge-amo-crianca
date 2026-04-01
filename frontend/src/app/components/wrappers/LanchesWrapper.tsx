import { ModuleProtection } from "../ModuleProtection";
import { SnackControl } from "../snacks/SnackControl";

export function LanchesWrapper() {
  return (
    <ModuleProtection module="lanches">
      <SnackControl />
    </ModuleProtection>
  );
}
