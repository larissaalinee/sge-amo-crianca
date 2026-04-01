import { ModuleProtection } from "../ModuleProtection";
import { TransportManagement } from "../transport/TransportManagement";

export function TransporteWrapper() {
  return (
    <ModuleProtection module="transporte">
      <TransportManagement />
    </ModuleProtection>
  );
}
