import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { mockVehicles } from "../../data/amoData";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";

export function VehicleForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const existing = isEditing ? mockVehicles.find((v) => v.id === id) : undefined;

  const [formData, setFormData] = useState({
    plate: existing?.plate || "",
    model: existing?.model || "",
    capacity: existing?.capacity || 8,
    hasCarSeat: existing?.hasCarSeat || false,
    active: existing?.active ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.plate || !formData.model) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }
    toast.success(isEditing ? "Veículo atualizado!" : "Veículo cadastrado!");
    navigate("/veiculos");
  };

  return (
    <div className="p-4 lg:p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="size-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
          {isEditing ? "Editar Veículo" : "Novo Veículo"}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Informações do Veículo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="plate">
                  Placa <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="plate"
                  value={formData.plate}
                  onChange={(e) => setFormData({ ...formData, plate: e.target.value })}
                  placeholder="ABC-1234"
                  required
                />
              </div>
              <div>
                <Label htmlFor="capacity">Capacidade</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) =>
                    setFormData({ ...formData, capacity: parseInt(e.target.value) })
                  }
                  min="1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="model">
                Modelo <span className="text-red-500">*</span>
              </Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                placeholder="Ex: Fiat Ducato 2022"
                required
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="hasCarSeat"
                  checked={formData.hasCarSeat}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, hasCarSeat: checked as boolean })
                  }
                />
                <Label htmlFor="hasCarSeat" className="cursor-pointer">
                  Possui cadeirinha infantil
                </Label>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, active: checked as boolean })
                  }
                />
                <Label htmlFor="active" className="cursor-pointer">
                  Veículo ativo
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex gap-3 justify-end">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Cancelar
          </Button>
          <Button type="submit">
            <Save className="size-4 mr-2" />
            {isEditing ? "Atualizar" : "Cadastrar"}
          </Button>
        </div>
      </form>
    </div>
  );
}