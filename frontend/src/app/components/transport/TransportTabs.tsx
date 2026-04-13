import { MapPin, UserCog, Car } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { ModuleProtection } from "../ModuleProtection";
import { DriverRoutesTimeline } from "./DriverRoutesTimeline";
import { DriversList } from "../drivers/DriversList";
import { VehiclesList } from "../vehicles/VehiclesList";

interface TransportTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function TransportTabs({ activeTab, onTabChange }: TransportTabsProps) {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Gestão de Transporte
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Gerencie rotas, motoristas e veículos
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={onTabChange}>
        <TabsList className="w-full">
          <TabsTrigger value="rotas" className="flex-1">
            <MapPin className="size-4" />
            Rotas
          </TabsTrigger>
          <TabsTrigger value="motoristas" className="flex-1">
            <UserCog className="size-4" />
            Motoristas
          </TabsTrigger>
          <TabsTrigger value="veiculos" className="flex-1">
            <Car className="size-4" />
            Veículos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="rotas">
          <ModuleProtection module="rotas">
            <DriverRoutesTimeline />
          </ModuleProtection>
        </TabsContent>

        <TabsContent value="motoristas">
          <ModuleProtection module="motoristas">
            <DriversList />
          </ModuleProtection>
        </TabsContent>

        <TabsContent value="veiculos">
          <ModuleProtection module="veiculos">
            <VehiclesList />
          </ModuleProtection>
        </TabsContent>
      </Tabs>
    </div>
  );
}
