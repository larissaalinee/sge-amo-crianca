import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Calendar, Save, X } from "lucide-react";
import { mockVehicles, mockDrivers, mockVehicleAssignments } from "../../data/amoData";
import { toast } from "sonner";

interface VehicleDriverScheduleProps {
  vehicleId?: string;
  onClose?: () => void;
}

export function VehicleDriverSchedule({ vehicleId, onClose }: VehicleDriverScheduleProps) {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // Busca as associações do dia selecionado
  const selectedDateObj = new Date(selectedDate + "T00:00:00");
  const dayAssignments = mockVehicleAssignments.filter(
    (a) => a.date.toDateString() === selectedDateObj.toDateString()
  );

  // Estado de associações do dia
  const [assignments, setAssignments] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    dayAssignments.forEach((a) => {
      initial[a.vehicleId] = a.driverId;
    });
    return initial;
  });

  const handleAssign = (vehicleId: string, driverId: string) => {
    setAssignments((prev) => ({
      ...prev,
      [vehicleId]: driverId,
    }));
  };

  const handleUnassign = (vehicleId: string) => {
    setAssignments((prev) => {
      const newAssignments = { ...prev };
      delete newAssignments[vehicleId];
      return newAssignments;
    });
  };

  const handleSave = () => {
    toast.success("Escala de motoristas atualizada!");
    onClose?.();
  };

  const getDriverName = (driverId: string) => {
    return mockDrivers.find((d) => d.id === driverId)?.name || "Desconhecido";
  };

  const activeVehicles = mockVehicles.filter((v) => v.active);
  const activeDrivers = mockDrivers.filter((d) => d.active);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="size-5" />
            Escala Diária - Motoristas e Veículos
          </CardTitle>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="size-4" />
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="date">Data</Label>
            <input
              id="date"
              type="date"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Associações do Dia</h3>
            {activeVehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="flex flex-col sm:flex-row gap-3 p-4 border rounded-lg bg-gray-50"
              >
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{vehicle.model}</div>
                  <div className="text-sm text-gray-600">Placa: {vehicle.plate}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Capacidade: {vehicle.capacity} passageiros
                    {vehicle.hasCarSeat && " • Cadeirinha disponível"}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {assignments[vehicle.id] ? (
                    <>
                      <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-md">
                        <div className="size-2 bg-green-500 rounded-full" />
                        <span className="text-sm font-medium text-green-700">
                          {getDriverName(assignments[vehicle.id])}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUnassign(vehicle.id)}
                      >
                        <X className="size-4" />
                      </Button>
                    </>
                  ) : (
                    <select
                      className="flex h-9 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value=""
                      onChange={(e) => handleAssign(vehicle.id, e.target.value)}
                    >
                      <option value="">Selecione motorista</option>
                      {activeDrivers.map((driver) => (
                        <option key={driver.id} value={driver.id}>
                          {driver.name} (CNH: {driver.cnhCategory})
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 pt-4 border-t">
            {onClose && (
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancelar
              </Button>
            )}
            <Button onClick={handleSave} className="flex-1">
              <Save className="size-4 mr-2" />
              Salvar Escala
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
