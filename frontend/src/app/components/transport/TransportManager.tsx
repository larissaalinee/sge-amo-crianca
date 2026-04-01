import { useState, useCallback } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { format, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  mockAppointments,
  mockAssistidos,
  mockVehicles,
  mockDrivers,
  mockVehicleAssignments,
  mockTransportAssignments,
  type TransportAssignment,
} from "../../data/amoData";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Car,
  MapPin,
  Clock,
  ChevronLeft,
  ChevronRight,
  User,
  AlertCircle,
  X,
  Undo2,
} from "lucide-react";
import { toast } from "sonner";

const ItemTypes = {
  ASSISTIDO: "assistido",
};

interface DragItem {
  assistidoId: string;
  appointmentId: string;
  assignmentId?: string; // presente se já está alocado
  sourceVehicleId?: string; // de qual veículo veio
}

interface AssistidoCardProps {
  assistidoId: string;
  appointmentId: string;
  assignmentId?: string;
  sourceVehicleId?: string;
  showFullInfo?: boolean;
  onRemove?: (assignmentId: string) => void;
}

function AssistidoCard({
  assistidoId,
  appointmentId,
  assignmentId,
  sourceVehicleId,
  showFullInfo = false,
  onRemove,
}: AssistidoCardProps) {
  const assistido = mockAssistidos.find((a) => a.id === assistidoId);
  const appointment = mockAppointments.find((a) => a.id === appointmentId);

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: ItemTypes.ASSISTIDO,
      item: {
        assistidoId,
        appointmentId,
        assignmentId,
        sourceVehicleId,
      } as DragItem,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [assistidoId, appointmentId, assignmentId, sourceVehicleId]
  );

  if (!assistido || !appointment) return null;

  const isAllocated = !!assignmentId;

  return (
    <div
      ref={drag}
      className={`p-3 border rounded-lg cursor-move hover:shadow-md transition-all relative group ${
        isDragging ? "opacity-50 scale-95" : ""
      } ${isAllocated ? "bg-gray-50 border-gray-200" : "bg-white border-gray-200"}`}
    >
      {isAllocated && onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(assignmentId!);
          }}
          className="absolute -top-2 -right-2 size-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600 z-10"
        >
          <X className="size-4" />
        </button>
      )}
      <div className="flex items-start gap-2 mb-2">
        <User className="size-4 text-gray-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm text-gray-900 truncate">
            {assistido.name}
          </h4>
          <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
            <Clock className="size-3" />
            {appointment.startTime} - {appointment.endTime}
          </p>
        </div>
      </div>
      <div className="text-xs text-gray-500 space-y-1">
        <div className="flex items-start gap-1">
          <MapPin className="size-3 mt-0.5 flex-shrink-0" />
          <span className={showFullInfo ? "" : "line-clamp-2"}>
            {assistido.address}
          </span>
        </div>
        {assistido.specialNeeds && (
          <div className="flex items-start gap-1 text-amber-600">
            <AlertCircle className="size-3 mt-0.5 flex-shrink-0" />
            <span className="line-clamp-2">{assistido.specialNeeds}</span>
          </div>
        )}
      </div>
    </div>
  );
}

interface VehicleDropZoneProps {
  vehicleId: string;
  driverId: string;
  date: Date;
  assignments: TransportAssignment[];
  onDrop: (item: DragItem, vehicleId: string, driverId: string) => void;
  onRemove: (assignmentId: string) => void;
}

function VehicleDropZone({
  vehicleId,
  driverId,
  date,
  assignments,
  onDrop,
  onRemove,
}: VehicleDropZoneProps) {
  const vehicle = mockVehicles.find((v) => v.id === vehicleId);
  const driver = mockDrivers.find((d) => d.id === driverId);

  const vehicleAssignments = assignments.filter(
    (a) =>
      a.vehicleId === vehicleId &&
      a.date.toDateString() === date.toDateString() &&
      a.pickupStatus === "pending"
  );

  const availableSeats = vehicle
    ? vehicle.capacity - vehicleAssignments.length
    : 0;

  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: ItemTypes.ASSISTIDO,
      canDrop: (item: DragItem) => {
        // Não pode soltar no mesmo veículo de onde veio
        if (item.sourceVehicleId === vehicleId) return false;
        // Verifica capacidade (se é novo, precisa de lugar; se é move, o lugar antigo será liberado)
        if (!item.assignmentId && availableSeats <= 0) return false;
        if (item.assignmentId && item.sourceVehicleId !== vehicleId && availableSeats <= 0) return false;
        return true;
      },
      drop: (item: DragItem) => onDrop(item, vehicleId, driverId),
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [vehicleId, driverId, availableSeats, onDrop]
  );

  const isActive = isOver && canDrop;

  return (
    <div
      ref={drop}
      className={`p-4 bg-white border-2 border-dashed rounded-lg transition-all min-h-[300px] ${
        isActive
          ? "border-blue-500 bg-blue-50"
          : canDrop
          ? "border-gray-300 hover:border-blue-400"
          : "border-gray-200"
      }`}
    >
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="size-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Car className="size-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{vehicle?.plate}</h3>
            <p className="text-sm text-gray-600">{driver?.name}</p>
          </div>
        </div>
        <Badge variant={availableSeats > 0 ? "secondary" : "destructive"}>
          {availableSeats} lugares livres
        </Badge>
      </div>

      {vehicleAssignments.length > 0 ? (
        <div className="space-y-3">
          {vehicleAssignments.map((assignment) => (
            <AssistidoCard
              key={assignment.id}
              assistidoId={assignment.assistidoId}
              appointmentId={assignment.appointmentId}
              assignmentId={assignment.id}
              sourceVehicleId={vehicleId}
              onRemove={onRemove}
            />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-[200px]">
          <p className="text-sm text-gray-400 text-center">
            Arraste assistidos para este veículo
          </p>
        </div>
      )}
    </div>
  );
}

interface UnallocatedDropZoneProps {
  onDrop: (item: DragItem) => void;
}

function UnallocatedDropZone({ onDrop }: UnallocatedDropZoneProps) {
  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: ItemTypes.ASSISTIDO,
      canDrop: (item: DragItem) => !!item.assignmentId, // só aceita itens já alocados
      drop: (item: DragItem) => onDrop(item),
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [onDrop]
  );

  const isActive = isOver && canDrop;

  return (
    <div
      ref={drop}
      className={`p-4 border-2 border-dashed rounded-lg transition-all min-h-[60px] mb-4 ${
        isActive
          ? "border-orange-500 bg-orange-50"
          : canDrop
          ? "border-gray-300 hover:border-orange-400 bg-gray-50"
          : "border-gray-200 bg-gray-50"
      }`}
    >
      <p className="text-sm text-center text-gray-500 flex items-center justify-center gap-2">
        <Undo2 className="size-4" />
        {isActive
          ? "Solte para remover do veículo"
          : "Arraste de volta para desalocar"}
      </p>
    </div>
  );
}

export function TransportManager() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 17));
  const [assignments, setAssignments] = useState<TransportAssignment[]>(
    mockTransportAssignments
  );

  // Busca assistidos que precisam de transporte no dia e NÃO estão alocados
  const availableAssistidos = mockAppointments
    .filter(
      (apt) =>
        apt.date.toDateString() === currentDate.toDateString() &&
        apt.status === "scheduled" &&
        apt.needsTransport &&
        !assignments.some(
          (a) =>
            a.appointmentId === apt.id &&
            a.date.toDateString() === currentDate.toDateString() &&
            a.pickupStatus === "pending"
        )
    )
    .map((apt) => ({
      assistidoId: apt.assistidoId,
      appointmentId: apt.id,
    }));

  // Busca veículos com motoristas escalados para o dia
  const vehiclesWithDrivers = mockVehicleAssignments
    .filter((va) => va.date.toDateString() === currentDate.toDateString())
    .map((va) => ({
      vehicleId: va.vehicleId,
      driverId: va.driverId,
    }));

  const handleDrop = useCallback(
    (item: DragItem, vehicleId: string, driverId: string) => {
      setAssignments((prev) => {
        // Se já estava alocado, remove a alocação anterior
        let updated = item.assignmentId
          ? prev.filter((a) => a.id !== item.assignmentId)
          : prev;

        // Verifica se já existe alocação para este appointment neste veículo
        const alreadyInVehicle = updated.some(
          (a) =>
            a.appointmentId === item.appointmentId &&
            a.vehicleId === vehicleId &&
            a.date.toDateString() === currentDate.toDateString() &&
            a.pickupStatus === "pending"
        );

        if (alreadyInVehicle) {
          toast.error("Este assistido já está neste veículo!");
          return prev; // retorna estado original sem mudanças
        }

        // Verifica capacidade
        const vehicle = mockVehicles.find((v) => v.id === vehicleId);
        const currentCount = updated.filter(
          (a) =>
            a.vehicleId === vehicleId &&
            a.date.toDateString() === currentDate.toDateString() &&
            a.pickupStatus === "pending"
        ).length;

        if (vehicle && currentCount >= vehicle.capacity) {
          toast.error("Veículo sem lugares disponíveis!");
          return prev;
        }

        const newAssignment: TransportAssignment = {
          id: `ta${Date.now()}`,
          assistidoId: item.assistidoId,
          appointmentId: item.appointmentId,
          vehicleId,
          driverId,
          date: currentDate,
          pickupStatus: "pending",
          createdAt: new Date(),
        };

        const assistido = mockAssistidos.find(
          (a) => a.id === item.assistidoId
        );
        const action = item.assignmentId ? "movido para" : "adicionado ao";
        toast.success(
          `${assistido?.name} ${action} veículo ${vehicle?.plate}!`
        );

        return [...updated, newAssignment];
      });
    },
    [currentDate]
  );

  const handleRemove = useCallback(
    (item: DragItem) => {
      if (!item.assignmentId) return;
      setAssignments((prev) => {
        const assignment = prev.find((a) => a.id === item.assignmentId);
        const assistido = mockAssistidos.find(
          (a) => a.id === assignment?.assistidoId
        );
        toast.success(`${assistido?.name} removido do veículo!`);
        return prev.filter((a) => a.id !== item.assignmentId);
      });
    },
    []
  );

  const handleRemoveById = useCallback((assignmentId: string) => {
    setAssignments((prev) => {
      const assignment = prev.find((a) => a.id === assignmentId);
      const assistido = mockAssistidos.find(
        (a) => a.id === assignment?.assistidoId
      );
      toast.success(`${assistido?.name} removido do veículo!`);
      return prev.filter((a) => a.id !== assignmentId);
    });
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-4 lg:p-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            Gestão de Transporte
          </h1>
          <p className="text-gray-600">
            Arraste e solte assistidos nos veículos disponíveis
          </p>
        </div>

        {/* Date Navigation */}
        <Card className="mb-6">
          <CardContent className="p-4 flex items-center justify-between">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentDate(addDays(currentDate, -1))}
            >
              <ChevronLeft className="size-5" />
            </Button>
            <div className="text-center">
              <h2 className="font-bold text-lg">
                {format(currentDate, "EEEE, dd 'de' MMMM 'de' yyyy", {
                  locale: ptBR,
                })}
              </h2>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentDate(addDays(currentDate, 1))}
            >
              <ChevronRight className="size-5" />
            </Button>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de Assistidos Disponíveis */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span>Assistidos Disponíveis</span>
                  <span className="text-sm font-normal text-gray-600">
                    Com atendimento agendado para hoje
                  </span>
                </div>
                <Badge variant="secondary">{availableAssistidos.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Drop zone para remover assistidos */}
              <UnallocatedDropZone onDrop={handleRemove} />

              {availableAssistidos.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  {mockAppointments.some(
                    (apt) =>
                      apt.date.toDateString() === currentDate.toDateString() &&
                      apt.needsTransport
                  )
                    ? "Todos os assistidos foram alocados"
                    : "Nenhum atendimento com transporte agendado para hoje"}
                </p>
              ) : (
                <div className="space-y-3">
                  {availableAssistidos.map((item) => (
                    <AssistidoCard
                      key={item.appointmentId}
                      assistidoId={item.assistidoId}
                      appointmentId={item.appointmentId}
                      showFullInfo
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Veículos */}
          <div className="lg:col-span-2 space-y-4">
            {vehiclesWithDrivers.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Car className="size-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    Nenhum veículo escalado para este dia
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Configure a escala de motoristas na aba Veículos
                  </p>
                </CardContent>
              </Card>
            ) : (
              vehiclesWithDrivers.map((vd) => (
                <VehicleDropZone
                  key={`${vd.vehicleId}-${vd.driverId}`}
                  vehicleId={vd.vehicleId}
                  driverId={vd.driverId}
                  date={currentDate}
                  assignments={assignments}
                  onDrop={handleDrop}
                  onRemove={handleRemoveById}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </DndProvider>
  );
}