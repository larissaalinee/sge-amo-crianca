import { ModuleProtection } from "../ModuleProtection";
import { DriverRoutesTimeline } from "../transport/DriverRoutesTimeline";

export function DriverRoutesWrapper() {
  return (
    <ModuleProtection module="rotas">
      <DriverRoutesTimeline />
    </ModuleProtection>
  );
}