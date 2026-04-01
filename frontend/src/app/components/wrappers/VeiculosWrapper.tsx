import { ModuleProtection } from "../ModuleProtection";
import { VehiclesList } from "../vehicles/VehiclesList";

export function VeiculosWrapper() {
  return (
    <ModuleProtection module="veiculos">
      <VehiclesList />
    </ModuleProtection>
  );
}
