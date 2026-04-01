import { ModuleProtection } from "../ModuleProtection";
import { VehicleForm } from "../vehicles/VehicleForm";

export function VehicleFormWrapper() {
  return (
    <ModuleProtection module="veiculos">
      <VehicleForm />
    </ModuleProtection>
  );
}
