import { ReactNode } from "react";

interface ModuleProtectionProps {
  module: string;
  children: ReactNode;
}

export function ModuleProtection({ module, children }: ModuleProtectionProps) {
  // Sem autenticação, todos os módulos são acessíveis
  return <>{children}</>;
}