import { useState } from "react";
import { format, startOfWeek, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  mockAppointments,
  mockAssistidos,
  mockProfessionals,
  mockVehicles,
  getAssistidoName,
  getProfessionalName,
} from "../../data/amoData";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Download,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Users,
  Stethoscope,
  Car,
  UtensilsCrossed,
  Clock,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

export function WeeklyReport() {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 5 }, (_, i) => addDays(weekStart, i));

  const weekAppointments = mockAppointments.filter((apt) => {
    const aptDate = new Date(apt.date);
    return (
      aptDate >= weekStart &&
      aptDate < addDays(weekStart, 7) &&
      apt.status === "scheduled"
    );
  });

  const canceledAppointments = mockAppointments.filter((apt) => {
    const aptDate = new Date(apt.date);
    return (
      aptDate >= weekStart &&
      aptDate < addDays(weekStart, 7) &&
      apt.status === "canceled"
    );
  });

  const assistidosThisWeek = new Set(weekAppointments.map((apt) => apt.assistidoId)).size;
  const snacksNeeded = weekAppointments.filter((apt) => apt.needsSnack).length;
  const transportsNeeded = weekAppointments.filter((apt) => {
    const assistido = mockAssistidos.find((p) => p.id === apt.assistidoId);
    return assistido?.needsTransport;
  }).length;

  const handleDownload = () => {
    toast.success("Relatório exportado com sucesso!");
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            Relatório Semanal
          </h1>
          <p className="text-gray-600">
            Resumo completo das atividades da semana
          </p>
        </div>
        <Button size="lg" onClick={handleDownload}>
          <Download className="size-5 mr-2" />
          Exportar PDF
        </Button>
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
              {format(weekStart, "d 'de' MMMM", { locale: ptBR })} -{" "}
              {format(addDays(weekStart, 4), "d 'de' MMMM 'de' yyyy", {
                locale: ptBR,
              })}
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="size-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Atendimentos</p>
                <p className="text-2xl font-bold">{weekAppointments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Users className="size-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Assistidos</p>
                <p className="text-2xl font-bold">{assistidosThisWeek}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Car className="size-8 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Transportes</p>
                <p className="text-2xl font-bold">{transportsNeeded}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <UtensilsCrossed className="size-8 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Lanches</p>
                <p className="text-2xl font-bold">{snacksNeeded}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cancelamentos e Faltas */}
      {canceledAppointments.length > 0 && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-900">
              <XCircle className="size-6" />
              Cancelamentos e Faltas
              <Badge variant="destructive" className="ml-2">
                {canceledAppointments.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {canceledAppointments.map((apt) => {
                const assistido = mockAssistidos.find((p) => p.id === apt.assistidoId);
                const professional = mockProfessionals.find(
                  (p) => p.id === apt.professionalId
                );

                return (
                  <div
                    key={apt.id}
                    className="flex items-center gap-4 p-3 bg-white border border-red-200 rounded-lg text-sm"
                  >
                    <div className="flex items-center gap-2 min-w-[140px]">
                      <Calendar className="size-4 text-gray-600" />
                      <span className="font-medium">
                        {format(apt.date, "dd/MM/yyyy", { locale: ptBR })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 min-w-[120px]">
                      <Clock className="size-4 text-gray-600" />
                      <span className="font-medium">
                        {apt.startTime} - {apt.endTime}
                      </span>
                    </div>
                    <div className="flex-1">
                      <span className="text-gray-600">Assistido: </span>
                      <span className="font-medium">{assistido?.name}</span>
                    </div>
                    <div className="flex-1">
                      <span className="text-gray-600">Profissional: </span>
                      <span className="font-medium">
                        {professional?.name}
                      </span>
                    </div>
                    <Badge variant="destructive">
                      <XCircle className="size-3 mr-1" />
                      {apt.cancelReason || "Cancelado"}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Daily Breakdown */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Resumo por Dia</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {weekDays.map((day) => {
              const dayAppointments = weekAppointments.filter(
                (apt) => apt.date.toDateString() === day.toDateString()
              );

              return (
                <div key={day.toString()} className="border-b border-gray-200 pb-4 last:border-0">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg">
                      {format(day, "EEEE, dd 'de' MMMM", { locale: ptBR })}
                    </h3>
                    <Badge variant="secondary">
                      {dayAppointments.length} atendimento(s)
                    </Badge>
                  </div>

                  {dayAppointments.length === 0 ? (
                    <p className="text-sm text-gray-500">Nenhum atendimento agendado</p>
                  ) : (
                    <div className="space-y-2">
                      {dayAppointments.map((apt) => {
                        const assistido = mockAssistidos.find((p) => p.id === apt.assistidoId);
                        const professional = mockProfessionals.find(
                          (p) => p.id === apt.professionalId
                        );

                        return (
                          <div
                            key={apt.id}
                            className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg text-sm"
                          >
                            <div className="flex items-center gap-2 flex-1">
                              <Clock className="size-4 text-gray-600" />
                              <span className="font-medium">
                                {apt.startTime} - {apt.endTime}
                              </span>
                            </div>
                            <div className="flex-1">
                              <span className="text-gray-600">Assistido: </span>
                              <span className="font-medium">{assistido?.name}</span>
                            </div>
                            <div className="flex-1">
                              <span className="text-gray-600">Profissional: </span>
                              <span className="font-medium">
                                {professional?.name} - {professional?.specialty}
                              </span>
                            </div>
                            <div className="flex gap-1">
                              {assistido?.needsTransport && (
                                <Badge variant="secondary" className="text-xs">
                                  <Car className="size-3 mr-1" />
                                  Transporte
                                </Badge>
                              )}
                              {apt.needsSnack && (
                                <Badge variant="secondary" className="text-xs">
                                  <UtensilsCrossed className="size-3 mr-1" />
                                  Lanche
                                </Badge>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Professional Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Distribuição por Profissional</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockProfessionals.map((prof) => {
              const profAppointments = weekAppointments.filter(
                (apt) => apt.professionalId === prof.id
              );

              return (
                <div
                  key={prof.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="size-4 rounded"
                      style={{ backgroundColor: prof.color }}
                    />
                    <div>
                      <h4 className="font-semibold">{prof.name}</h4>
                      <p className="text-sm text-gray-600">{prof.specialty}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-base">
                    {profAppointments.length} atendimento(s)
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}