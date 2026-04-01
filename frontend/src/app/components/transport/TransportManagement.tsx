import { useState } from "react";
import { format, startOfWeek, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  mockAppointments,
  mockAssistidos,
  mockVehicles,
  mockProfessionals,
  mockDrivers,
  mockVehicleAssignments,
} from "../../data/amoData";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Car,
  MapPin,
  Clock,
  Baby,
  User,
  ChevronLeft,
  ChevronRight,
  UserCog,
} from "lucide-react";

export function TransportManagement() {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 5 }, (_, i) => addDays(weekStart, i));

  const getTransportForDay = (day: Date) => {
    const dayAppointments = mockAppointments.filter(
      (apt) =>
        apt.date.toDateString() === day.toDateString() &&
        apt.status === "scheduled"
    );

    const assistidosNeedingTransport = dayAppointments
      .map((apt) => {
        const assistido = mockAssistidos.find((p) => p.id === apt.assistidoId);
        // Agora usa o campo needsTransport do agendamento
        if (!apt.needsTransport || !assistido) return null;

        const professional = mockProfessionals.find(
          (p) => p.id === apt.professionalId
        );

        return {
          assistido,
          appointment: apt,
          professional,
        };
      })
      .filter(Boolean);

    return assistidosNeedingTransport;
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
          Gestão de Transporte
        </h1>
        <p className="text-gray-600">
          Organize o transporte dos assistidos para os atendimentos
        </p>
      </div>

      {/* Week Navigation */}
      <Card className="mb-6">
        <CardContent className="p-4 flex items-center justify-between">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentWeek(addDays(currentWeek, -7))}
          >
            <ChevronLeft className="size-5" />
          </Button>
          <div className="text-center">
            <h2 className="font-bold text-lg">
              Semana de {format(weekStart, "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </h2>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentWeek(addDays(currentWeek, 7))}
          >
            <ChevronRight className="size-5" />
          </Button>
        </CardContent>
      </Card>

      {/* Vehicles Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {mockVehicles
          .filter((v) => v.active)
          .map((vehicle) => (
            <Card key={vehicle.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="size-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Car className="size-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold">{vehicle.plate}</h3>
                    <p className="text-sm text-gray-600">{vehicle.model}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Capacidade</span>
                  <Badge variant="secondary">{vehicle.capacity} lugares</Badge>
                </div>
                {vehicle.hasCarSeat && (
                  <div className="flex items-center gap-1 text-xs text-gray-600 mt-2">
                    <Baby className="size-3" />
                    <span>Com cadeirinha</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
      </div>

      {/* Daily Transport Lists */}
      <div className="space-y-6">
        {weekDays.map((day) => {
          const transports = getTransportForDay(day);
          
          // Busca associações de motoristas para o dia
          const dayAssignments = mockVehicleAssignments.filter(
            (a) => a.date.toDateString() === day.toDateString()
          );

          return (
            <Card key={day.toString()}>
              <CardHeader>
                <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <span>
                    {format(day, "EEEE, dd 'de' MMMM", { locale: ptBR })}
                  </span>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{transports.length} transporte(s)</Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Escala do dia */}
                {dayAssignments.length > 0 && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
                      <UserCog className="size-4" />
                      Escala de Motoristas
                    </h4>
                    <div className="space-y-1">
                      {dayAssignments.map((assignment) => {
                        const vehicle = mockVehicles.find((v) => v.id === assignment.vehicleId);
                        const driver = mockDrivers.find((d) => d.id === assignment.driverId);
                        return (
                          <div key={assignment.id} className="text-sm text-blue-800 flex items-center gap-2">
                            <Car className="size-3" />
                            <span className="font-medium">{vehicle?.plate}</span>
                            <span className="text-blue-600">•</span>
                            <span>{driver?.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                {transports.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    Nenhum transporte necessário neste dia
                  </p>
                ) : (
                  <div className="space-y-4">
                    {transports.map((transport: any, idx) => (
                      <div
                        key={idx}
                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <User className="size-4 text-gray-600" />
                              <h4 className="font-semibold text-gray-900">
                                {transport.assistido.name}
                              </h4>
                              {transport.assistido.usesCarSeat && (
                                <Badge variant="secondary" className="text-xs">
                                  <Baby className="size-3 mr-1" />
                                  Cadeirinha
                                </Badge>
                              )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                              <div className="flex items-start gap-2 text-gray-600">
                                <MapPin className="size-4 flex-shrink-0 mt-0.5" />
                                <span className="break-words">
                                  {transport.assistido.address}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-600">
                                <Clock className="size-4" />
                                <span>
                                  Buscar antes de {transport.appointment.startTime} •{" "}
                                  {transport.professional?.specialty}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="lg:text-right">
                            <p className="text-sm text-gray-600 mb-1">Atendimento</p>
                            <p className="font-semibold">
                              {transport.appointment.startTime} -{" "}
                              {transport.appointment.endTime}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}