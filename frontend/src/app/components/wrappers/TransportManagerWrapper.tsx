import { ModuleProtection } from "../ModuleProtection";
import { TransportManager } from "../transport/TransportManager";

export function TransportManagerWrapper() {
  return (
    <ModuleProtection module="gestao-translado">
      <TransportManager />
    </ModuleProtection>
  );
}
