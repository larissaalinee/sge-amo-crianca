import { Link } from "react-router";
import { mockDrivers } from "../../data/amoData";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Plus, Edit, Trash2, User, CheckCircle, XCircle, CreditCard } from "lucide-react";
import { toast } from "sonner";

export function DriversList() {
  const handleDelete = (id: string, name: string) => {
    if (confirm(`Excluir motorista ${name}?`)) {
      toast.success(`Motorista ${name} excluído`);
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6 lg:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Motoristas</h1>
          <p className="text-gray-600">Gerencie os motoristas da frota</p>
        </div>
        <Link to="/motoristas/novo">
          <Button size="lg">
            <Plus className="size-5 mr-2" />
            Novo Motorista
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockDrivers.map((driver) => (
          <Card key={driver.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="size-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <User className="size-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{driver.name}</h3>
                    <p className="text-sm text-gray-600">{driver.email}</p>
                  </div>
                </div>
                {driver.active ? (
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
                  <span className="text-gray-600">CPF:</span>
                  <span className="font-medium">{driver.cpf}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Telefone:</span>
                  <span className="font-medium">{driver.phone}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">CNH:</span>
                  <span className="font-medium flex items-center gap-1">
                    <CreditCard className="size-3" />
                    {driver.cnh} - Cat. {driver.cnhCategory}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Link to={`/motoristas/editar/${driver.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    <Edit className="size-4 mr-2" />
                    Editar
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(driver.id, driver.name)}
                  className="text-red-600"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
