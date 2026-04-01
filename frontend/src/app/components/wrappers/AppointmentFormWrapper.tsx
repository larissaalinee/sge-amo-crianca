import { ModuleProtection } from "../ModuleProtection";
import { AppointmentForm } from "../schedule/AppointmentForm";

export function AppointmentFormWrapper() {
  return (
    <ModuleProtection module="agenda">
      <AppointmentForm />
    </ModuleProtection>
  );
}
