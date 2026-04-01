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
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
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
  ArrowRight,
  Home,
  Building2,
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

export function DriverRoutes() {
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

  const handleMarkPickedUp = (assignmentId: string) => {
    setAssignments(
      assignments.map((a) =>
        a.id === assignmentId
          ? { ...a, pickupStatus: "picked_up", pickedUpAt: new Date() }
          : a
      )
    );
    toast.success("Assistido marcado como buscado!");
  };

  const handleMarkDelivered = (assignmentId: string) => {
    setAssignments(
      assignments.map((a) =>
        a.id === assignmentId
          ? { ...a, pickupStatus: "delivered", deliveredAt: new Date() }
          : a
      )
    );
    toast.success("Assistido marcado como entregue!");
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
      // Impossibilidade de buscar - devolve para fila
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

  // Handlers para cada etapa da jornada
  const handleOutboundPickup = (assignmentId: string) => {
    setAssignments(
      assignments.map((a) =>
        a.id === assignmentId
          ? { ...a, outboundPickupAt: new Date() }
          : a
      )
    );
    toast.success("✓ Assistido buscado em casa!");
  };

  const handleOutboundDelivery = (assignmentId: string) => {
    setAssignments(
      assignments.map((a) =>
        a.id === assignmentId
          ? { ...a, outboundDeliveredAt: new Date() }
          : a
      )
    );
    toast.success("✓ Assistido entregue na AMO Criança!");
  };

  const handleReturnPickup = (assignmentId: string) => {
    setAssignments(
      assignments.map((a) =>
        a.id === assignmentId
          ? { ...a, returnPickupAt: new Date() }
          : a
      )
    );
    toast.success("✓ Assistido buscado na AMO Criança!");
  };

  const handleReturnDelivery = (assignmentId: string) => {
    setAssignments(
      assignments.map((a) =>
        a.id === assignmentId
          ? { 
              ...a, 
              returnDeliveredAt: new Date(),
              pickupStatus: "delivered" // Marca como completo
            }
          : a
      )
    );
    toast.success("✓ Assistido entregue em casa - Jornada completa!");
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
            {vehiclesWithRoutes.map((route) => (
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
                  </div>

                  <Button className="w-full mt-4">Ver Rota Completa</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Tela de detalhes da rota
  const selectedRoute = vehiclesWithRoutes.find(
    (r) => r.vehicle?.id === selectedVehicle
  );

  if (!selectedRoute) return null;

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto">
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

        <div className="flex items-center gap-4 mt-4">
          <Badge variant="secondary">
            {selectedRoute.assignments.length} assistido(s)
          </Badge>
          <span className="text-sm text-gray-600">
            Motorista: {selectedRoute.driver?.name}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {selectedRoute.assignments.map((assignment) => {
          const assistido = mockAssistidos.find(
            (a) => a.id === assignment.assistidoId
          );
          const appointment = mockAppointments.find(
            (a) => a.id === assignment.appointmentId
          );

          if (!assistido || !appointment) return null;

          const isPending = assignment.pickupStatus === "pending";
          const isPickedUp = assignment.pickupStatus === "picked_up";
          const isDelivered = assignment.pickupStatus === "delivered";

          return (
            <Card key={assignment.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-lg text-gray-900">
                        {assistido.name}
                      </h3>
                      {isDelivered && (
                        <Badge className="bg-green-100 text-green-800">
                          Entregue
                        </Badge>
                      )}
                      {isPickedUp && (
                        <Badge className="bg-blue-100 text-blue-800">
                          No veículo
                        </Badge>
                      )}
                      {isPending && (
                        <Badge variant="secondary">Pendente</Badge>
                      )}
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-start gap-2">
                        <Clock className="size-4 mt-0.5 flex-shrink-0" />
                        <span>
                          Horário do atendimento: {appointment.startTime} -{" "}
                          {appointment.endTime}
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="size-4 mt-0.5 flex-shrink-0" />
                        <span>{assistido.address}</span>
                      </div>
                      {assistido.specialNeeds && (
                        <div className="flex items-start gap-2 text-amber-600">
                          <AlertTriangle className="size-4 mt-0.5 flex-shrink-0" />
                          <span>{assistido.specialNeeds}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Jornada de Ida e Volta */}
                <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-sm text-gray-700 mb-3 flex items-center gap-2">
                    <ArrowRight className="size-4" />
                    Jornada Completa
                  </h4>
                  <div className="space-y-3">
                    {/* IDA */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs font-semibold text-blue-700">
                        <Car className="size-3" />
                        IDA - Levar para atendimento
                      </div>

                      {/* Passo 1: Buscar em casa */}
                      <div className="flex items-start gap-3 ml-5">
                        <div className="flex flex-col items-center">
                          <div
                            className={`size-3 rounded-full ${
                              assignment.outboundPickupAt ? "bg-green-500" : "bg-gray-300"
                            }`}
                          />
                          <div className="w-px h-8 bg-gray-300" />
                        </div>
                        <div className="flex-1 pt-0.5">
                          <div className="flex items-center gap-2">
                            <Home className="size-3 text-gray-600" />
                            <span className="text-xs font-medium text-gray-700">
                              1. Buscar em casa
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {assistido.address}
                          </p>
                          {assignment.outboundPickupAt && (
                            <Badge variant="secondary" className="text-xs mt-1">
                              ✓ Buscado às {format(assignment.outboundPickupAt, "HH:mm")}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Passo 2: Entregar na AMO */}
                      <div className="flex items-start gap-3 ml-5">
                        <div className="flex flex-col items-center">
                          <div
                            className={`size-3 rounded-full ${
                              assignment.outboundDeliveredAt ? "bg-green-500" : "bg-gray-300"
                            }`}
                          />
                        </div>
                        <div className="flex-1 pt-0.5">
                          <div className="flex items-center gap-2">
                            <Building2 className="size-3 text-gray-600" />
                            <span className="text-xs font-medium text-gray-700">
                              2. Entregar na AMO Criança
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Horário do atendimento: {appointment.startTime}
                          </p>
                          {assignment.outboundDeliveredAt && (
                            <Badge variant="secondary" className="text-xs mt-1">
                              ✓ Entregue às {format(assignment.outboundDeliveredAt, "HH:mm")}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* VOLTA */}
                    <div className="space-y-2 pt-3 border-t border-gray-200">
                      <div className="flex items-center gap-2 text-xs font-semibold text-orange-700">
                        <Car className="size-3" />
                        VOLTA - Retornar para casa
                      </div>

                      {/* Passo 3: Buscar na AMO */}
                      <div className="flex items-start gap-3 ml-5">
                        <div className="flex flex-col items-center">
                          <div
                            className={`size-3 rounded-full ${
                              assignment.returnPickupAt ? "bg-green-500" : "bg-gray-300"
                            }`}
                          />
                          <div className="w-px h-8 bg-gray-300" />
                        </div>
                        <div className="flex-1 pt-0.5">
                          <div className="flex items-center gap-2">
                            <Building2 className="size-3 text-gray-600" />
                            <span className="text-xs font-medium text-gray-700">
                              3. Buscar na AMO Criança
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Após o atendimento: {appointment.endTime}
                          </p>
                          {assignment.returnPickupAt && (
                            <Badge variant="secondary" className="text-xs mt-1">
                              ✓ Buscado às {format(assignment.returnPickupAt, "HH:mm")}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Passo 4: Entregar em casa */}
                      <div className="flex items-start gap-3 ml-5">
                        <div className="flex flex-col items-center">
                          <div
                            className={`size-3 rounded-full ${
                              assignment.returnDeliveredAt ? "bg-green-500" : "bg-gray-300"
                            }`}
                          />
                        </div>
                        <div className="flex-1 pt-0.5">
                          <div className="flex items-center gap-2">
                            <Home className="size-3 text-gray-600" />
                            <span className="text-xs font-medium text-gray-700">
                              4. Entregar em casa
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {assistido.address}
                          </p>
                          {assignment.returnDeliveredAt && (
                            <Badge variant="secondary" className="text-xs mt-1">
                              ✓ Entregue às {format(assignment.returnDeliveredAt, "HH:mm")}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {/* Etapa 1: Buscar em casa (IDA) */}
                  {!assignment.outboundPickupAt && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleOutboundPickup(assignment.id)}
                        className="flex-1 sm:flex-initial bg-blue-600 hover:bg-blue-700"
                      >
                        <Home className="size-4 mr-2" />
                        Buscar em Casa
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleOpenCancelDialog(assignment.id, "unable")
                        }
                        className="flex-1 sm:flex-initial"
                      >
                        <AlertTriangle className="size-4 mr-2" />
                        Impossibilidade
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() =>
                          handleOpenCancelDialog(assignment.id, "cancel")
                        }
                        className="flex-1 sm:flex-initial"
                      >
                        <XCircle className="size-4 mr-2" />
                        Cancelar
                      </Button>
                    </>
                  )}

                  {/* Etapa 2: Entregar na AMO (IDA) */}
                  {assignment.outboundPickupAt && !assignment.outboundDeliveredAt && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleOutboundDelivery(assignment.id)}
                        className="flex-1 sm:flex-initial bg-blue-600 hover:bg-blue-700"
                      >
                        <Building2 className="size-4 mr-2" />
                        Entregar na AMO
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() =>
                          handleOpenCancelDialog(assignment.id, "cancel")
                        }
                        className="flex-1 sm:flex-initial"
                      >
                        <XCircle className="size-4 mr-2" />
                        Cancelar
                      </Button>
                    </>
                  )}

                  {/* Etapa 3: Buscar na AMO (VOLTA) */}
                  {assignment.outboundDeliveredAt && !assignment.returnPickupAt && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleReturnPickup(assignment.id)}
                        className="flex-1 sm:flex-initial bg-orange-600 hover:bg-orange-700"
                      >
                        <Building2 className="size-4 mr-2" />
                        Buscar na AMO
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() =>
                          handleOpenCancelDialog(assignment.id, "cancel")
                        }
                        className="flex-1 sm:flex-initial"
                      >
                        <XCircle className="size-4 mr-2" />
                        Cancelar
                      </Button>
                    </>
                  )}

                  {/* Etapa 4: Entregar em Casa (VOLTA) */}
                  {assignment.returnPickupAt && !assignment.returnDeliveredAt && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleReturnDelivery(assignment.id)}
                        className="flex-1 sm:flex-initial bg-orange-600 hover:bg-orange-700"
                      >
                        <Home className="size-4 mr-2" />
                        Entregar em Casa
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() =>
                          handleOpenCancelDialog(assignment.id, "cancel")
                        }
                        className="flex-1 sm:flex-initial"
                      >
                        <XCircle className="size-4 mr-2" />
                        Cancelar
                      </Button>
                    </>
                  )}

                  {/* Jornada completa */}
                  {assignment.returnDeliveredAt && (
                    <div className="w-full p-3 bg-green-50 border border-green-200 rounded-lg text-center">
                      <CheckCircle className="size-5 text-green-600 inline-block mr-2" />
                      <span className="text-sm font-medium text-green-700">
                        Jornada completa! Assistido entregue em casa.
                      </span>
                    </div>
                  )}
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