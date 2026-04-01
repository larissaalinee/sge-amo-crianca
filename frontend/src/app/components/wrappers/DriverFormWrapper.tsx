import { ModuleProtection } from "../ModuleProtection";
import { DriverForm } from "../drivers/DriverForm";

export function DriverFormWrapper() {
  return (
    <ModuleProtection module="motoristas">
      <DriverForm />
    </ModuleProtection>
  );
}
