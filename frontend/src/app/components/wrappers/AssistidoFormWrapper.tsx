import { ModuleProtection } from "../ModuleProtection";
import { AssistidoForm } from "../assistidos/AssistidoForm";

export function AssistidoFormWrapper() {
  return (
    <ModuleProtection module="assistidos">
      <AssistidoForm />
    </ModuleProtection>
  );
}
