import { Link } from "react-router";
import { mockVehicles } from "../../data/amoData";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Plus, Edit, Trash2, Car, Baby, CheckCircle, XCircle, Calendar } from "lucide-react";
import { toast } from "sonner";
import { VehicleDriverSchedule } from "./VehicleDriverSchedule";
import { useState } from "react";

export function VehiclesList() {
  const [showSchedule, setShowSchedule] = useState(false);
  
  const handleDelete = (id: string, plate: string) => {
    if (confirm(`Excluir veículo ${plate}?`)) {
      toast.success(`Veículo ${plate} excluído`);
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6 lg:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Veículos</h1>
          <p className="text-gray-600">Gerencie a frota de transporte</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="lg" onClick={() => setShowSchedule(true)}>
            <Calendar className="size-5 mr-2" />
            Escala Diária
          </Button>
          <Link to="/veiculos/novo">
            <Button size="lg">
              <Plus className="size-5 mr-2" />
              Novo Veículo
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockVehicles.map((vehicle) => (
          <Card key={vehicle.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="size-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Car className="size-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{vehicle.plate}</h3>
                    <p className="text-sm text-gray-600">{vehicle.model}</p>
                  </div>
                </div>
                {vehicle.active ? (
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    <CheckCircle className="size-3 mr-1" />
                    Ativo
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                    <XCircle className="size-3 mr-1" />
                    Inativo
                  </Badge>
                )}
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Capacidade:</span>
                  <span className="font-medium">{vehicle.capacity} lugares</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Cadeirinha:</span>
                  <span className="font-medium">
                    {vehicle.hasCarSeat ? (
                      <Badge variant="secondary" className="text-xs">
                        <Baby className="size-3 mr-1" />
                        Possui
                      </Badge>
                    ) : (
                      "Não possui"
                    )}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Link to={`/veiculos/editar/${vehicle.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    <Edit className="size-4 mr-2" />
                    Editar
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(vehicle.id, vehicle.plate)}
                  className="text-red-600"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {showSchedule && <VehicleDriverSchedule onClose={() => setShowSchedule(false)} />}
    </div>
  );
}