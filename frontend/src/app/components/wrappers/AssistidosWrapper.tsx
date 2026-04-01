import { ModuleProtection } from "../ModuleProtection";
import { AssistidosList } from "../assistidos/AssistidosList";

export function AssistidosWrapper() {
  return (
    <ModuleProtection module="assistidos">
      <AssistidosList />
    </ModuleProtection>
  );
}
