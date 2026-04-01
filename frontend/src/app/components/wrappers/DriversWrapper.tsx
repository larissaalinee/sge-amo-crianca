import { ModuleProtection } from "../ModuleProtection";
import { DriversList } from "../drivers/DriversList";

export function DriversWrapper() {
  return (
    <ModuleProtection module="motoristas">
      <DriversList />
    </ModuleProtection>
  );
}
