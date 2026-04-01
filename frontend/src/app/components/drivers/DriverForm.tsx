import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { mockDrivers } from "../../data/amoData";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";

export function DriverForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const existing = isEditing ? mockDrivers.find((d) => d.id === id) : undefined;

  const [formData, setFormData] = useState({
    name: existing?.name || "",
    cpf: existing?.cpf || "",
    phone: existing?.phone || "",
    email: existing?.email || "",
    cnh: existing?.cnh || "",
    cnhCategory: existing?.cnhCategory || "B",
    active: existing?.active ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.cpf || !formData.cnh) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }
    toast.success(isEditing ? "Motorista atualizado!" : "Motorista cadastrado!");
    navigate("/motoristas");
  };

  return (
    <div className="p-4 lg:p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="size-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
          {isEditing ? "Editar Motorista" : "Novo Motorista"}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Informações do Motorista</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">
                Nome Completo <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Carlos Silva"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cpf">
                  CPF <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="cpf"
                  value={formData.cpf}
                  onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                  placeholder="000.000.000-00"
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(11) 98765-4321"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="motorista@amo.com.br"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cnh">
                  CNH <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="cnh"
                  value={formData.cnh}
                  onChange={(e) => setFormData({ ...formData, cnh: e.target.value })}
                  placeholder="12345678901"
                  required
                />
              </div>
              <div>
                <Label htmlFor="cnhCategory">Categoria CNH</Label>
                <select
                  id="cnhCategory"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.cnhCategory}
                  onChange={(e) => setFormData({ ...formData, cnhCategory: e.target.value })}
                >
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="AB">AB</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                  <option value="E">E</option>
                </select>
              </div>
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
                Motorista ativo
              </Label>
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
