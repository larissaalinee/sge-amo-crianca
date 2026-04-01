import { useState, useRef } from "react";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  mockAppointments,
  mockAssistidos,
  mockProfessionals,
  type Appointment,
} from "../../data/amoData";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Calendar,
  Clock,
  User,
  FileText,
  Download,
  Printer,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  XCircle,
  Users,
  Car,
  Coffee,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useReactToPrint } from "react-to-print";

export function ProfessionalSchedule() {
  const [selectedProfessional, setSelectedProfessional] = useState("p1");
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(new Date(2026, 2, 17), { locale: ptBR })
  );
  const printRef = useRef<HTMLDivElement>(null);

  const professional = mockProfessionals.find(
    (p) => p.id === selectedProfessional
  );

  // Filtrar atendimentos do profissional na semana
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));
  
  const appointmentsByDay = weekDays.map((day) => {
    const dayAppointments = mockAppointments
      .filter(
        (apt) =>
          apt.professionalId === selectedProfessional &&
          isSameDay(apt.date, day)
      )
      .sort((a, b) => a.startTime.localeCompare(b.startTime));

    return {
      date: day,
      appointments: dayAppointments,
    };
  });

  const handlePreviousWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, -7));
  };

  const handleNextWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, 7));
  };

  const handleThisWeek = () => {
    setCurrentWeekStart(startOfWeek(new Date(2026, 2, 17), { locale: ptBR }));
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Agenda_${professional?.name}_${format(
      currentWeekStart,
      "dd-MM-yyyy"
    )}`,
  });

  const getAppointmentDetails = (appointment: Appointment) => {
    const assistido = mockAssistidos.find(
      (a) => a.id === appointment.assistidoId
    );
    return {
      assistido,
      duration: calculateDuration(appointment.startTime, appointment.endTime),
    };
  };

  const calculateDuration = (start: string, end: string) => {
    const [startHour, startMin] = start.split(":").map(Number);
    const [endHour, endMin] = end.split(":").map(Number);
    const duration = (endHour * 60 + endMin) - (startHour * 60 + startMin);
    return `${duration} min`;
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "scheduled":
        return {
          label: "Agendado",
          icon: <Calendar className="size-4" />,
          className: "bg-blue-100 text-blue-800",
        };
      case "completed":
        return {
          label: "Concluído",
          icon: <CheckCircle className="size-4" />,
          className: "bg-green-100 text-green-800",
        };
      case "cancelled":
        return {
          label: "Cancelado",
          icon: <XCircle className="size-4" />,
          className: "bg-red-100 text-red-800",
        };
      default:
        return {
          label: status,
          icon: <AlertCircle className="size-4" />,
          className: "bg-gray-100 text-gray-800",
        };
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "individual":
        return "Individual";
      case "group":
        return "Grupo";
      case "event":
        return "Evento";
      default:
        return type;
    }
  };

  const totalAppointments = appointmentsByDay.reduce(
    (sum, day) => sum + day.appointments.length,
    0
  );
  const scheduledCount = appointmentsByDay.reduce(
    (sum, day) =>
      sum + day.appointments.filter((a) => a.status === "scheduled").length,
    0
  );
  const completedCount = appointmentsByDay.reduce(
    (sum, day) =>
      sum + day.appointments.filter((a) => a.status === "completed").length,
    0
  );
  const cancelledCount = appointmentsByDay.reduce(
    (sum, day) =>
      sum + day.appointments.filter((a) => a.status === "cancelled").length,
    0
  );

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Cabeçalho */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              Agenda Profissionais
            </h1>
            <p className="text-gray-600">
              Visualize e exporte sua agenda semanal
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Select
              value={selectedProfessional}
              onValueChange={setSelectedProfessional}
            >
              <SelectTrigger className="w-[240px]">
                <SelectValue placeholder="Selecione o profissional" />
              </SelectTrigger>
              <SelectContent>
                {mockProfessionals.map((prof) => (
                  <SelectItem key={prof.id} value={prof.id}>
                    <div className="flex items-center gap-2">
                      <div
                        className="size-3 rounded-full"
                        style={{ backgroundColor: prof.color }}
                      />
                      {prof.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={handlePrint}>
              <Printer className="size-4 mr-2" />
              Imprimir
            </Button>
          </div>
        </div>

        {/* Informações do Profissional */}
        {professional && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div
                  className="size-16 rounded-lg flex items-center justify-center text-white text-2xl font-bold"
                  style={{ backgroundColor: professional.color }}
                >
                  {professional.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">
                    {professional.name}
                  </h3>
                  <p className="text-gray-600 mb-2">{professional.specialty}</p>
                  <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <User className="size-4" />
                      {professional.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="size-4" />
                      {professional.phone}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Estatísticas da Semana */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalAppointments}
                  </p>
                </div>
                <Calendar className="size-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Agendados</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {scheduledCount}
                  </p>
                </div>
                <Clock className="size-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Concluídos</p>
                  <p className="text-2xl font-bold text-green-600">
                    {completedCount}
                  </p>
                </div>
                <CheckCircle className="size-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Cancelados</p>
                  <p className="text-2xl font-bold text-red-600">
                    {cancelledCount}
                  </p>
                </div>
                <XCircle className="size-8 text-red-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navegação de Semana */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" onClick={handlePreviousWeek}>
            <ChevronLeft className="size-4 mr-2" />
            Semana Anterior
          </Button>

          <div className="text-center">
            <h2 className="text-lg font-bold text-gray-900">
              {format(currentWeekStart, "dd 'de' MMMM", { locale: ptBR })} -{" "}
              {format(addDays(currentWeekStart, 6), "dd 'de' MMMM 'de' yyyy", {
                locale: ptBR,
              })}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleThisWeek}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Voltar para hoje
            </Button>
          </div>

          <Button variant="outline" onClick={handleNextWeek}>
            Próxima Semana
            <ChevronRight className="size-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* Conteúdo para Impressão */}
      <div ref={printRef} className="print:p-8">
        {/* Cabeçalho de Impressão */}
        <div className="hidden print:block mb-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              AMO Criança
            </h1>
            <p className="text-lg text-gray-600">Agenda Profissional</p>
          </div>

          <div className="border-t border-b border-gray-300 py-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Profissional</p>
                <p className="font-bold">{professional?.name}</p>
                <p className="text-sm text-gray-600">{professional?.specialty}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Período</p>
                <p className="font-bold">
                  {format(currentWeekStart, "dd/MM/yyyy", { locale: ptBR })} -{" "}
                  {format(addDays(currentWeekStart, 6), "dd/MM/yyyy", {
                    locale: ptBR,
                  })}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold">{totalAppointments}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Agendados</p>
              <p className="text-2xl font-bold text-blue-600">
                {scheduledCount}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Concluídos</p>
              <p className="text-2xl font-bold text-green-600">
                {completedCount}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Cancelados</p>
              <p className="text-2xl font-bold text-red-600">
                {cancelledCount}
              </p>
            </div>
          </div>
        </div>

        {/* Grade de Agenda Semanal */}
        <div className="space-y-6">
          {appointmentsByDay.map((day, index) => {
            const isToday = isSameDay(day.date, new Date(2026, 2, 17));

            return (
              <Card
                key={index}
                className={`${
                  isToday
                    ? "border-2 border-[#EF5350] print:border-gray-900"
                    : ""
                }`}
              >
                <CardHeader
                  className={`${
                    isToday ? "bg-red-50 print:bg-gray-100" : "bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      <div className="flex items-center gap-3">
                        <Calendar className="size-5" />
                        <div>
                          <p className="font-bold">
                            {format(day.date, "EEEE", { locale: ptBR })}
                          </p>
                          <p className="text-sm font-normal text-gray-600">
                            {format(day.date, "dd 'de' MMMM 'de' yyyy", {
                              locale: ptBR,
                            })}
                          </p>
                        </div>
                        {isToday && (
                          <Badge className="bg-[#EF5350] print:bg-gray-900">
                            Hoje
                          </Badge>
                        )}
                      </div>
                    </CardTitle>
                    <Badge variant="secondary">
                      {day.appointments.length} atendimento
                      {day.appointments.length !== 1 ? "s" : ""}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  {day.appointments.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="size-12 mx-auto mb-2 text-gray-400" />
                      <p>Nenhum atendimento agendado</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {day.appointments.map((appointment) => {
                        const { assistido, duration } =
                          getAppointmentDetails(appointment);
                        const statusInfo = getStatusInfo(appointment.status);

                        return (
                          <div
                            key={appointment.id}
                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow print:break-inside-avoid"
                          >
                            <div className="flex items-start justify-between gap-4 mb-3">
                              <div className="flex items-start gap-3 flex-1">
                                <div
                                  className="size-10 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0"
                                  style={{
                                    backgroundColor: professional?.color,
                                  }}
                                >
                                  {assistido?.name.charAt(0) || "?"}
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-bold text-gray-900">
                                    {assistido?.name || "Assistido não encontrado"}
                                  </h4>
                                  <div className="flex flex-wrap items-center gap-2 mt-1">
                                    <Badge variant="outline">
                                      {getTypeLabel(appointment.type)}
                                    </Badge>
                                    <Badge className={statusInfo.className}>
                                      {statusInfo.icon}
                                      <span className="ml-1">
                                        {statusInfo.label}
                                      </span>
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                              <div className="flex items-center gap-2 text-gray-600">
                                <Clock className="size-4 flex-shrink-0" />
                                <span>
                                  {appointment.startTime} - {appointment.endTime}{" "}
                                  ({duration})
                                </span>
                              </div>

                              {appointment.type === "group" &&
                                appointment.groupParticipants && (
                                  <div className="flex items-center gap-2 text-gray-600">
                                    <Users className="size-4 flex-shrink-0" />
                                    <span>
                                      {appointment.groupParticipants.length}{" "}
                                      participantes
                                    </span>
                                  </div>
                                )}

                              {appointment.needsTransport && (
                                <div className="flex items-center gap-2 text-blue-600">
                                  <Car className="size-4 flex-shrink-0" />
                                  <span>
                                    Necessita transporte
                                    {appointment.hasCompanion &&
                                      " (+ acompanhante)"}
                                  </span>
                                </div>
                              )}

                              {appointment.needsSnack && (
                                <div className="flex items-center gap-2 text-orange-600">
                                  <Coffee className="size-4 flex-shrink-0" />
                                  <span>Necessita lanche</span>
                                </div>
                              )}

                              {appointment.isRecurring && (
                                <div className="flex items-center gap-2 text-purple-600">
                                  <FileText className="size-4 flex-shrink-0" />
                                  <span>Recorrente (semanal)</span>
                                </div>
                              )}
                            </div>

                            {appointment.notes && (
                              <div className="mt-3 pt-3 border-t border-gray-200">
                                <p className="text-sm text-gray-600">
                                  <span className="font-semibold">
                                    Observações:
                                  </span>{" "}
                                  {appointment.notes}
                                </p>
                              </div>
                            )}

                            {appointment.cancelReason && (
                              <div className="mt-3 pt-3 border-t border-red-200 bg-red-50 -mx-4 -mb-4 px-4 py-3 rounded-b-lg print:bg-transparent">
                                <p className="text-sm text-red-800">
                                  <span className="font-semibold">
                                    Motivo do cancelamento:
                                  </span>{" "}
                                  {appointment.cancelReason}
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Rodapé de Impressão */}
        <div className="hidden print:block mt-8 pt-4 border-t border-gray-300 text-center text-sm text-gray-600">
          <p>Documento gerado em {format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</p>
          <p>AMO Criança - Sistema de Gestão</p>
        </div>
      </div>
    </div>
  );
}