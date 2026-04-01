import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  mockVehicles,
  mockDrivers,
  mockVehicleAssignments,
  mockTransportAssignments,
  mockAssistidos,
  mockAppointments,
  type TransportAssignment,
} from "../../data/amoData";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Car,
  MapPin,
  Clock,
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Home,
  Building2,
  Navigation,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { toast } from "sonner";

interface RouteStep {
  id: string;
  type: "outbound_pickup" | "outbound_delivery" | "return_pickup" | "return_delivery";
  assignmentId: string;
  assistidoId: string;
  appointmentId: string;
  completed: boolean;
  location: string;
  time?: string;
  assistidoName: string;
  specialNeeds?: string;
}

export function DriverRoutesTimeline() {
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [assignments, setAssignments] = useState<TransportAssignment[]>(
    mockTransportAssignments
  );
  const [cancelDialog, setCancelDialog] = useState<{
    open: boolean;
    assignmentId: string | null;
    type: "cancel" | "unable";
  }>({
    open: false,
    assignmentId: null,
    type: "cancel",
  });
  const [cancelReason, setCancelReason] = useState("");

  const currentDate = new Date(2026, 2, 17); // Para demo, usando data fixa

  // Lista de veículos com rotas para o dia
  const vehiclesWithRoutes = mockVehicleAssignments
    .filter((va) => va.date.toDateString() === currentDate.toDateString())
    .map((va) => {
      const vehicle = mockVehicles.find((v) => v.id === va.vehicleId);
      const driver = mockDrivers.find((d) => d.id === va.driverId);
      const routeAssignments = assignments.filter(
        (a) =>
          a.vehicleId === va.vehicleId &&
          a.date.toDateString() === currentDate.toDateString() &&
          (a.pickupStatus === "pending" ||
            a.pickupStatus === "picked_up" ||
            a.pickupStatus === "delivered")
      );

      return {
        vehicle,
        driver,
        assignments: routeAssignments,
      };
    })
    .filter((v) => v.vehicle && v.driver);

  // Gerar etapas individuais
  const generateRouteSteps = (routeAssignments: TransportAssignment[]): RouteStep[] => {
    const steps: RouteStep[] = [];

    routeAssignments.forEach((assignment) => {
      const assistido = mockAssistidos.find((a) => a.id === assignment.assistidoId);
      const appointment = mockAppointments.find((a) => a.id === assignment.appointmentId);

      if (!assistido || !appointment) return;

      const passengerCount = appointment.hasCompanion ? 2 : 1;
      const companionNote = appointment.hasCompanion ? " (+ acompanhante)" : "";

      // Etapa 1: Buscar em casa (IDA)
      steps.push({
        id: `${assignment.id}_outbound_pickup`,
        type: "outbound_pickup",
        assignmentId: assignment.id,
        assistidoId: assignment.assistidoId,
        appointmentId: assignment.appointmentId,
        completed: !!assignment.outboundPickupAt,
        location: assistido.address,
        time: appointment.startTime,
        assistidoName: assistido.name + companionNote,
        specialNeeds: assistido.specialNeeds,
      });

      // Etapa 2: Entregar na AMO (IDA)
      steps.push({
        id: `${assignment.id}_outbound_delivery`,
        type: "outbound_delivery",
        assignmentId: assignment.id,
        assistidoId: assignment.assistidoId,
        appointmentId: assignment.appointmentId,
        completed: !!assignment.outboundDeliveredAt,
        location: "AMO Criança - Novo Hamburgo/RS",
        time: appointment.startTime,
        assistidoName: assistido.name + companionNote,
        specialNeeds: assistido.specialNeeds,
      });

      // Etapa 3: Buscar na AMO (VOLTA)
      steps.push({
        id: `${assignment.id}_return_pickup`,
        type: "return_pickup",
        assignmentId: assignment.id,
        assistidoId: assignment.assistidoId,
        appointmentId: assignment.appointmentId,
        completed: !!assignment.returnPickupAt,
        location: "AMO Criança - Novo Hamburgo/RS",
        time: appointment.endTime,
        assistidoName: assistido.name + companionNote,
        specialNeeds: assistido.specialNeeds,
      });

      // Etapa 4: Entregar em casa (VOLTA)
      steps.push({
        id: `${assignment.id}_return_delivery`,
        type: "return_delivery",
        assignmentId: assignment.id,
        assistidoId: assignment.assistidoId,
        appointmentId: assignment.appointmentId,
        completed: !!assignment.returnDeliveredAt,
        location: assistido.address,
        time: appointment.endTime,
        assistidoName: assistido.name + companionNote,
        specialNeeds: assistido.specialNeeds,
      });
    });

    return steps;
  };

  // Handlers para cada etapa
  const handleCompleteStep = (step: RouteStep) => {
    setAssignments((prev) =>
      prev.map((a) => {
        if (a.id !== step.assignmentId) return a;

        switch (step.type) {
          case "outbound_pickup":
            toast.success(`✓ ${step.assistidoName} buscado em casa!`);
            return { ...a, outboundPickupAt: new Date() };
          case "outbound_delivery":
            toast.success(`✓ ${step.assistidoName} entregue na AMO!`);
            return { ...a, outboundDeliveredAt: new Date() };
          case "return_pickup":
            toast.success(`✓ ${step.assistidoName} buscado na AMO!`);
            return { ...a, returnPickupAt: new Date() };
          case "return_delivery":
            toast.success(`✓ ${step.assistidoName} entregue em casa - Jornada completa!`);
            return {
              ...a,
              returnDeliveredAt: new Date(),
              pickupStatus: "delivered",
            };
          default:
            return a;
        }
      })
    );
  };

  const handleOpenCancelDialog = (assignmentId: string, type: "cancel" | "unable") => {
    setCancelDialog({ open: true, assignmentId, type });
    setCancelReason("");
  };

  const handleConfirmCancel = () => {
    if (!cancelDialog.assignmentId) return;

    if (cancelDialog.type === "cancel") {
      setAssignments(
        assignments.map((a) =>
          a.id === cancelDialog.assignmentId
            ? {
                ...a,
                pickupStatus: "cancelled",
                cancelledReason: cancelReason,
                updatedAt: new Date(),
              }
            : a
        )
      );
      toast.success("Transporte cancelado");
    } else {
      setAssignments(
        assignments.map((a) =>
          a.id === cancelDialog.assignmentId
            ? {
                ...a,
                pickupStatus: "unable",
                cancelledReason: cancelReason,
                updatedAt: new Date(),
              }
            : a
        )
      );
      toast.info("Assistido devolvido para fila de disponíveis");
    }

    setCancelDialog({ open: false, assignmentId: null, type: "cancel" });
    setCancelReason("");
  };

  const getStepIcon = (type: string) => {
    switch (type) {
      case "outbound_pickup":
        return <Home className="size-5 text-blue-600" />;
      case "outbound_delivery":
        return <Building2 className="size-5 text-blue-600" />;
      case "return_pickup":
        return <Building2 className="size-5 text-orange-600" />;
      case "return_delivery":
        return <Home className="size-5 text-orange-600" />;
      default:
        return <Navigation className="size-5" />;
    }
  };

  const getStepLabel = (type: string) => {
    switch (type) {
      case "outbound_pickup":
        return "Buscar em Casa";
      case "outbound_delivery":
        return "Entregar na AMO";
      case "return_pickup":
        return "Buscar na AMO";
      case "return_delivery":
        return "Entregar em Casa";
      default:
        return "";
    }
  };

  const getStepDescription = (type: string) => {
    switch (type) {
      case "outbound_pickup":
        return "IDA - Pegar assistido em casa";
      case "outbound_delivery":
        return "IDA - Deixar na AMO para atendimento";
      case "return_pickup":
        return "VOLTA - Pegar na AMO após atendimento";
      case "return_delivery":
        return "VOLTA - Deixar em casa";
      default:
        return "";
    }
  };

  const canCompleteStep = (step: RouteStep, allSteps: RouteStep[]) => {
    // Buscar a alocação
    const assignment = assignments.find((a) => a.id === step.assignmentId);
    if (!assignment) return false;

    // Lógica de dependência entre etapas
    switch (step.type) {
      case "outbound_pickup":
        return true; // Primeira etapa sempre pode ser feita
      case "outbound_delivery":
        return !!assignment.outboundPickupAt; // Precisa ter buscado em casa
      case "return_pickup":
        return !!assignment.outboundDeliveredAt; // Precisa ter entregado na AMO
      case "return_delivery":
        return !!assignment.returnPickupAt; // Precisa ter buscado na AMO
      default:
        return false;
    }
  };

  // Tela de seleção de veículo
  if (!selectedVehicle) {
    return (
      <div className="p-4 lg:p-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            Minhas Rotas
          </h1>
          <p className="text-gray-600">
            {format(currentDate, "EEEE, dd 'de' MMMM 'de' yyyy", {
              locale: ptBR,
            })}
          </p>
        </div>

        {vehiclesWithRoutes.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Car className="size-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhuma rota disponível
              </h3>
              <p className="text-gray-600">
                Você não está escalado para nenhum veículo hoje
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vehiclesWithRoutes.map((route) => {
              // Calcular total de passageiros considerando acompanhantes
              const totalPassengers = route.assignments.reduce((total, assignment) => {
                const appointment = mockAppointments.find(
                  (a) => a.id === assignment.appointmentId
                );
                return total + (appointment?.hasCompanion ? 2 : 1);
              }, 0);

              return (
                <Card
                  key={route.vehicle?.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedVehicle(route.vehicle?.id || null)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="size-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Car className="size-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{route.vehicle?.plate}</h3>
                        <p className="text-sm text-gray-600">
                          {route.vehicle?.model}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Motorista</span>
                        <span className="font-medium">{route.driver?.name}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Assistidos</span>
                        <Badge variant="secondary">
                          {route.assignments.length}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Total de passageiros</span>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          {totalPassengers} / {route.vehicle?.capacity}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Total de etapas</span>
                        <Badge variant="secondary">
                          {route.assignments.length * 4}
                        </Badge>
                      </div>
                    </div>

                    <Button className="w-full mt-4">Ver Roteiro Completo</Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Tela de detalhes da rota com timeline
  const selectedRoute = vehiclesWithRoutes.find(
    (r) => r.vehicle?.id === selectedVehicle
  );

  if (!selectedRoute) return null;

  const routeSteps = generateRouteSteps(selectedRoute.assignments);
  const pendingSteps = routeSteps.filter((s) => !s.completed);
  const completedSteps = routeSteps.filter((s) => s.completed);

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => setSelectedVehicle(null)}
          className="mb-4"
        >
          <ArrowLeft className="size-4 mr-2" />
          Voltar
        </Button>

        <div className="flex items-center gap-4 mb-2">
          <div className="size-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Car className="size-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Rota {selectedRoute.vehicle?.plate}
            </h1>
            <p className="text-gray-600">
              {format(currentDate, "EEEE, dd 'de' MMMM 'de' yyyy", {
                locale: ptBR,
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-4 flex-wrap">
          <Badge variant="secondary">
            {selectedRoute.assignments.length} assistido(s)
          </Badge>
          <Badge className="bg-blue-100 text-blue-800">
            {pendingSteps.length} pendentes
          </Badge>
          <Badge className="bg-green-100 text-green-800">
            {completedSteps.length} concluídas
          </Badge>
          <span className="text-sm text-gray-600">
            Motorista: {selectedRoute.driver?.name}
          </span>
        </div>
      </div>

      {/* Timeline de Etapas */}
      <div className="space-y-3">
        {routeSteps.map((step) => {
          const canComplete = canCompleteStep(step, routeSteps);
          const assignment = assignments.find((a) => a.id === step.assignmentId);

          return (
            <Card
              key={step.id}
              className={`transition-all ${
                step.completed
                  ? "bg-green-50 border-green-200"
                  : canComplete
                  ? "bg-white border-gray-200 shadow-sm"
                  : "bg-gray-50 border-gray-100 opacity-60"
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Ícone */}
                  <div
                    className={`size-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      step.completed
                        ? "bg-green-100"
                        : canComplete
                        ? "bg-blue-50"
                        : "bg-gray-100"
                    }`}
                  >
                    {step.completed ? (
                      <CheckCircle className="size-6 text-green-600" />
                    ) : (
                      getStepIcon(step.type)
                    )}
                  </div>

                  {/* Conteúdo */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-bold text-gray-900">
                          {getStepLabel(step.type)} - {step.assistidoName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {getStepDescription(step.type)}
                        </p>
                      </div>
                      {step.completed && (
                        <Badge className="bg-green-100 text-green-800 flex-shrink-0">
                          Concluída
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-start gap-2">
                        <MapPin className="size-4 mt-0.5 flex-shrink-0" />
                        <span>{step.location}</span>
                      </div>
                      {step.time && (
                        <div className="flex items-center gap-2">
                          <Clock className="size-4 flex-shrink-0" />
                          <span>Horário referência: {step.time}</span>
                        </div>
                      )}
                      {step.specialNeeds && (
                        <div className="flex items-start gap-2 text-amber-600">
                          <AlertTriangle className="size-4 mt-0.5 flex-shrink-0" />
                          <span>{step.specialNeeds}</span>
                        </div>
                      )}
                    </div>

                    {/* Botões */}
                    {!step.completed && canComplete && (
                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          onClick={() => handleCompleteStep(step)}
                          className={`${
                            step.type.startsWith("outbound")
                              ? "bg-blue-600 hover:bg-blue-700"
                              : "bg-orange-600 hover:bg-orange-700"
                          }`}
                        >
                          <CheckCircle className="size-4 mr-2" />
                          Marcar como Concluída
                        </Button>
                        {step.type === "outbound_pickup" && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleOpenCancelDialog(step.assignmentId, "unable")
                              }
                            >
                              <AlertTriangle className="size-4 mr-2" />
                              Impossibilidade
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() =>
                                handleOpenCancelDialog(step.assignmentId, "cancel")
                              }
                            >
                              <XCircle className="size-4 mr-2" />
                              Cancelar
                            </Button>
                          </>
                        )}
                      </div>
                    )}

                    {!step.completed && !canComplete && (
                      <p className="text-sm text-gray-500 mt-2 italic">
                        Aguardando etapa anterior ser concluída
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Dialog de Cancelamento */}
      <Dialog
        open={cancelDialog.open}
        onOpenChange={(open) =>
          setCancelDialog({ ...cancelDialog, open })
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {cancelDialog.type === "cancel"
                ? "Cancelar Transporte"
                : "Impossibilidade de Busca"}
            </DialogTitle>
            <DialogDescription>
              {cancelDialog.type === "cancel"
                ? "O transporte será cancelado permanentemente."
                : "O assistido será devolvido para a fila de disponíveis e poderá ser realocado."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="reason">Motivo</Label>
              <Textarea
                id="reason"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Descreva o motivo..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setCancelDialog({ open: false, assignmentId: null, type: "cancel" })
              }
            >
              Voltar
            </Button>
            <Button
              variant={cancelDialog.type === "cancel" ? "destructive" : "default"}
              onClick={handleConfirmCancel}
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}