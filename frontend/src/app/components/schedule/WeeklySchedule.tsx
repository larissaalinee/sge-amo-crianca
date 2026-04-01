import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { format, addDays, startOfWeek, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  mockAppointments,
  mockAssistidos,
  mockProfessionals,
  getAssistidoName,
  getProfessionalName,
  type Appointment,
} from "../../data/amoData";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Car,
  Clock,
  AlertTriangle,
  Users,
  Calendar,
  TrendingDown,
  Edit,
  X,
  Trash2,
  UtensilsCrossed,
} from "lucide-react";
import { toast } from "sonner";

const HOURS = Array.from({ length: 11 }, (_, i) => i + 8); // 8h às 18h

// Modal de detalhes do agendamento
function AppointmentModal({
  appointment,
  onClose,
  onEdit,
  onCancel,
}: {
  appointment: Appointment;
  onClose: () => void;
  onEdit: () => void;
  onCancel: () => void;
}) {
  const assistido = mockAssistidos.find((p) => p.id === appointment.assistidoId);
  const professional = mockProfessionals.find(
    (p) => p.id === appointment.professionalId
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Detalhes do Atendimento
            </h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="size-5" />
            </Button>
          </div>

          <div className="space-y-4">
            {/* Data e Horário */}
            <div>
              <label className="text-sm font-medium text-gray-600">
                Data e Horário
              </label>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="size-4 text-gray-400" />
                <span className="text-gray-900">
                  {format(appointment.date, "dd/MM/yyyy (EEEE)", { locale: ptBR })}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="size-4 text-gray-400" />
                <span className="text-gray-900">
                  {appointment.startTime} - {appointment.endTime}
                </span>
              </div>
            </div>

            {/* Assistido */}
            <div>
              <label className="text-sm font-medium text-gray-600">
                Assistido
              </label>
              <p className="text-gray-900 mt-1">{assistido?.name}</p>
            </div>

            {/* Profissional */}
            <div>
              <label className="text-sm font-medium text-gray-600">
                Profissional
              </label>
              <div className="flex items-center gap-2 mt-1">
                <div
                  className="size-3 rounded"
                  style={{ backgroundColor: professional?.color }}
                />
                <span className="text-gray-900">
                  {professional?.name} - {professional?.specialty}
                </span>
              </div>
            </div>

            {/* Informações adicionais */}
            <div className="flex flex-wrap gap-2">
              {appointment.needsTransport && (
                <Badge variant="secondary">
                  <Car className="size-3 mr-1" />
                  Necessita Transporte
                </Badge>
              )}
              {appointment.needsSnack && (
                <Badge variant="secondary">
                  <UtensilsCrossed className="size-3 mr-1" />
                  Necessita Lanche
                </Badge>
              )}
              {appointment.isRecurring && (
                <Badge variant="secondary">Atendimento Recorrente</Badge>
              )}
            </div>

            {/* Observações */}
            {appointment.notes && (
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Observações
                </label>
                <p className="text-gray-900 mt-1 text-sm">{appointment.notes}</p>
              </div>
            )}

            {/* Restrições do assistido */}
            {assistido && (assistido.allergies.length > 0 || assistido.dietaryRestrictions.length > 0) && (
              <div className="border-t pt-4">
                <label className="text-sm font-medium text-gray-600 mb-2 block">
                  Restrições Alimentares
                </label>
                {assistido.allergies.length > 0 && (
                  <div className="mb-2">
                    <span className="text-xs font-semibold text-red-600">
                      Alergias:
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {assistido.allergies.map((allergy, idx) => (
                        <Badge key={idx} variant="destructive" className="text-xs">
                          {allergy}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {assistido.dietaryRestrictions.length > 0 && (
                  <div>
                    <span className="text-xs font-semibold text-orange-600">
                      Restrições:
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {assistido.dietaryRestrictions.map((restriction, idx) => (
                        <Badge key={idx} className="bg-orange-100 text-orange-700 text-xs">
                          {restriction}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Ações */}
          <div className="flex gap-3 mt-6">
            <Button variant="outline" className="flex-1" onClick={onEdit}>
              <Edit className="size-4 mr-2" />
              Editar
            </Button>
            <Button variant="destructive" className="flex-1" onClick={onCancel}>
              <Trash2 className="size-4 mr-2" />
              Cancelar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Modal de confirmação de cancelamento
function CancelAppointmentModal({
  appointment,
  onClose,
  onConfirm,
}: {
  appointment: Appointment;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}) {
  const [reason, setReason] = useState("");
  const assistido = mockAssistidos.find((p) => p.id === appointment.assistidoId);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="size-12 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="size-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Cancelar Atendimento
              </h2>
              <p className="text-sm text-gray-600">
                {assistido?.name} - {format(appointment.date, "dd/MM/yyyy", { locale: ptBR })}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Motivo do Cancelamento
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EF5350]"
              >
                <option value="">Selecione um motivo</option>
                <option value="Criança doente">Criança doente</option>
                <option value="Falta sem justificativa">Falta sem justificativa</option>
                <option value="Compromisso familiar">Compromisso familiar</option>
                <option value="Profissional ausente">Profissional ausente</option>
                <option value="Remarcado">Remarcado</option>
                <option value="Outros">Outros</option>
              </select>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                <strong>Atenção:</strong> Esta ação não pode ser desfeita. O atendimento será marcado como cancelado.
              </p>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Voltar
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={() => onConfirm(reason)}
              disabled={!reason}
            >
              Confirmar Cancelamento
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function WeeklySchedule() {
  const navigate = useNavigate();
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [showAvailability, setShowAvailability] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 5 }, (_, i) => addDays(weekStart, i));

  const getAppointmentsForDayAndHour = (day: Date, hour: number) => {
    return mockAppointments.filter((apt) => {
      if (!isSameDay(apt.date, day) || apt.status === "cancelled") return false;
      const aptHour = parseInt(apt.startTime.split(":")[0]);
      return aptHour === hour;
    });
  };

  const getProfessionalAvailability = (day: Date, hour: number) => {
    const dayOfWeek = day.getDay();
    return mockProfessionals.filter((prof) => {
      return prof.workSchedule.some((schedule) => {
        if (schedule.dayOfWeek !== dayOfWeek) return false;
        const startHour = parseInt(schedule.startTime.split(":")[0]);
        const endHour = parseInt(schedule.endTime.split(":")[0]);
        return hour >= startHour && hour < endHour;
      });
    });
  };

  // Verifica se há profissionais com horário vago (disponível mas sem agendamento)
  const hasEmptySlot = (day: Date, hour: number) => {
    const appointments = getAppointmentsForDayAndHour(day, hour);
    const availableProfessionals = getProfessionalAvailability(day, hour);
    
    // Se há profissionais disponíveis mas nenhum atendimento agendado
    return availableProfessionals.length > 0 && appointments.length === 0;
  };

  // Verifica quantos assistidos estão ocupados neste horário
  const getBusyAssistidosCount = (day: Date, hour: number) => {
    const appointments = getAppointmentsForDayAndHour(day, hour);
    return new Set(appointments.map(apt => apt.assistidoId)).size;
  };

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            Agenda Semanal
          </h1>
          <p className="text-gray-600">
            Gerencie os atendimentos da equipe multidisciplinar
          </p>
        </div>
        <Link to="/agenda/novo">
          <Button size="lg">
            <Plus className="size-5 mr-2" />
            Novo Atendimento
          </Button>
        </Link>
      </div>

      {/* Week Navigation */}
      <Card className="mb-6">
        <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentWeek(addDays(currentWeek, -7))}
          >
            <ChevronLeft className="size-5" />
          </Button>
          <div className="text-center flex-1">
            <h2 className="font-bold text-lg">
              {format(weekStart, "d 'de' MMMM", { locale: ptBR })} -{" "}
              {format(addDays(weekStart, 4), "d 'de' MMMM 'de' yyyy", {
                locale: ptBR,
              })}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentWeek(new Date())}
              className="mt-1"
            >
              Semana Atual
            </Button>
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

      {/* Estatísticas da Semana */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Atendimentos Agendados</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mockAppointments.filter(apt => 
                    weekDays.some(day => isSameDay(apt.date, day)) && 
                    apt.status === "scheduled"
                  ).length}
                </p>
              </div>
              <Calendar className="size-10 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Assistidos Ativos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mockAssistidos.filter(a => a.status === "active").length}
                </p>
              </div>
              <Users className="size-10 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Horários Disponíveis</p>
                <p className="text-2xl font-bold text-gray-900">
                  {weekDays.reduce((total, day) => {
                    return total + HOURS.filter(hour => hasEmptySlot(day, hour)).length;
                  }, 0)}
                </p>
              </div>
              <TrendingDown className="size-10 text-amber-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Schedule Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Header */}
          <div className="grid grid-cols-6 gap-2 mb-2">
            <div className="p-3 font-medium text-sm text-gray-600">Horário</div>
            {weekDays.map((day) => (
              <div key={day.toString()} className="p-3 text-center">
                <div className="font-bold text-gray-900">
                  {format(day, "EEEE", { locale: ptBR })}
                </div>
                <div className="text-sm text-gray-600">{format(day, "dd/MM")}</div>
              </div>
            ))}
          </div>

          {/* Time Slots */}
          <div className="space-y-2">
            {HOURS.map((hour) => (
              <div key={hour} className="grid grid-cols-6 gap-2">
                <div className="p-3 text-sm font-medium text-gray-600 flex items-start">
                  {hour}:00
                </div>
                {weekDays.map((day) => {
                  const appointments = getAppointmentsForDayAndHour(day, hour);
                  const availableProfessionals = getProfessionalAvailability(
                    day,
                    hour
                  );

                  return (
                    <div
                      key={`${day}-${hour}`}
                      className="min-h-[100px] border border-gray-200 rounded-lg p-2 bg-white hover:bg-gray-50 transition-colors"
                    >
                      <div className="space-y-2">
                        {appointments.map((apt) => {
                          const assistido = mockAssistidos.find(
                            (p) => p.id === apt.assistidoId
                          );
                          const professional = mockProfessionals.find(
                            (p) => p.id === apt.professionalId
                          );

                          return (
                            <div
                              key={apt.id}
                              className="text-xs p-2 rounded cursor-pointer hover:opacity-80 transition-opacity"
                              style={{
                                backgroundColor: `${professional?.color}20`,
                                borderLeft: `3px solid ${professional?.color}`,
                              }}
                              onClick={() => setSelectedAppointment(apt)}
                            >
                              <div className="font-semibold text-gray-900 mb-1">
                                {assistido?.name}
                              </div>
                              <div className="text-gray-600">
                                {professional?.specialty}
                              </div>
                              <div className="flex items-center gap-1 mt-1 text-gray-500">
                                <Clock className="size-3" />
                                {apt.startTime}-{apt.endTime}
                              </div>
                              {assistido?.needsTransport && (
                                <Badge variant="secondary" className="text-xs mt-1">
                                  <Car className="size-3 mr-1" />
                                  Transporte
                                </Badge>
                              )}
                            </div>
                          );
                        })}

                        {/* Empty slot indicator */}
                        {appointments.length === 0 &&
                          availableProfessionals.length > 0 && (
                            <div className="text-xs text-gray-400 p-1">
                              {availableProfessionals.length} profissional(is)
                              disponível(is)
                            </div>
                          )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <Card className="mt-6">
        <CardContent className="p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Legenda</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {mockProfessionals.map((prof) => (
              <div key={prof.id} className="flex items-center gap-2">
                <div
                  className="size-4 rounded"
                  style={{ backgroundColor: prof.color }}
                />
                <span className="text-sm text-gray-700">
                  {prof.name} - {prof.specialty}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modal de detalhes do agendamento */}
      {selectedAppointment && (
        <AppointmentModal
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
          onEdit={() => {
            navigate(`/agenda/editar/${selectedAppointment.id}`);
            setSelectedAppointment(null);
          }}
          onCancel={() => {
            setShowCancelModal(true);
          }}
        />
      )}

      {/* Modal de confirmação de cancelamento */}
      {showCancelModal && selectedAppointment && (
        <CancelAppointmentModal
          appointment={selectedAppointment}
          onClose={() => setShowCancelModal(false)}
          onConfirm={(reason) => {
            const index = mockAppointments.findIndex(
              (apt) => apt.id === selectedAppointment.id
            );
            if (index !== -1) {
              mockAppointments[index].status = "cancelled";
              mockAppointments[index].cancelReason = reason;
              toast.success("Atendimento cancelado com sucesso!");
            }
            setShowCancelModal(false);
            setSelectedAppointment(null);
          }}
        />
      )}
    </div>
  );
}