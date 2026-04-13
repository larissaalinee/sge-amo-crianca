import { Calendar, Stethoscope } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { ModuleProtection } from "../ModuleProtection";
import { ProfessionalSchedule } from "./ProfessionalSchedule";
import { ProfessionalsList } from "../professionals/ProfessionalsList";

interface ProfessionalTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function ProfessionalTabs({ activeTab, onTabChange }: ProfessionalTabsProps) {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Agenda Profissionais
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Gerencie a agenda e os profissionais cadastrados
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={onTabChange}>
        <TabsList className="w-full">
          <TabsTrigger value="agenda" className="flex-1">
            <Calendar className="size-4" />
            Agenda
          </TabsTrigger>
          <TabsTrigger value="profissionais" className="flex-1">
            <Stethoscope className="size-4" />
            Profissionais
          </TabsTrigger>
        </TabsList>

        <TabsContent value="agenda">
          <ModuleProtection module="agenda">
            <ProfessionalSchedule />
          </ModuleProtection>
        </TabsContent>

        <TabsContent value="profissionais">
          <ModuleProtection module="profissionais">
            <ProfessionalsList />
          </ModuleProtection>
        </TabsContent>
      </Tabs>
    </div>
  );
}
