import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { mockProfessionals } from "../../data/amoData";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";

const COLORS = [
  { name: "Azul", value: "#3b82f6" },
  { name: "Verde", value: "#10b981" },
  { name: "Laranja", value: "#f59e0b" },
  { name: "Roxo", value: "#8b5cf6" },
  { name: "Ciano", value: "#06b6d4" },
  { name: "Rosa", value: "#ec4899" },
  { name: "Vermelho", value: "#ef4444" },
  { name: "Teal", value: "#14b8a6" },
];

const WEEKDAYS = [
  { value: 1, label: "Segunda-feira" },
  { value: 2, label: "Terça-feira" },
  { value: 3, label: "Quarta-feira" },
  { value: 4, label: "Quinta-feira" },
  { value: 5, label: "Sexta-feira" },
];

export function ProfessionalForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const existing = isEditing
    ? mockProfessionals.find((p) => p.id === id)
    : undefined;

  const [formData, setFormData] = useState({
    name: existing?.name || "",
    specialty: existing?.specialty || "",
    cpf: existing?.cpf || "",
    phone: existing?.phone || "",
    email: existing?.email || "",
    color: existing?.color || COLORS[0].value,
  });

  const [schedules, setSchedules] = useState(
    existing?.workSchedule || []
  );
  
  const isDriver = formData.specialty === "Motorista";
  const isCozinha = formData.specialty === "Cozinha";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.specialty) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }
    toast.success(isEditing ? "Profissional atualizado!" : "Profissional cadastrado!");
    navigate("/profissionais");
  };

  const toggleSchedule = (dayOfWeek: number, period: "morning" | "afternoon") => {
    const times =
      period === "morning"
        ? { startTime: "08:00", endTime: "12:00" }
        : { startTime: "14:00", endTime: "18:00" };

    const exists = schedules.find(
      (s) => s.dayOfWeek === dayOfWeek && s.startTime === times.startTime
    );

    if (exists) {
      setSchedules(schedules.filter((s) => s !== exists));
    } else {
      setSchedules([...schedules, { dayOfWeek, ...times }]);
    }
  };

  const isScheduleActive = (dayOfWeek: number, period: "morning" | "afternoon") => {
    const time = period === "morning" ? "08:00" : "14:00";
    return schedules.some((s) => s.dayOfWeek === dayOfWeek && s.startTime === time);
  };

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="size-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
          {isEditing ? "Editar Profissional" : "Novo Profissional"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">
                  Nome Completo <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="specialty">
                  Especialidade <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="specialty"
                  value={formData.specialty}
                  onChange={(e) =>
                    setFormData({ ...formData, specialty: e.target.value })
                  }
                  placeholder="Ex: Psicologia"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  value={formData.cpf}
                  onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            {isDriver && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <Label htmlFor="cnh">CNH</Label>
                  <Input
                    id="cnh"
                    value={formData.cnh}
                    onChange={(e) => setFormData({ ...formData, cnh: e.target.value })}
                    placeholder="12345678901"
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
            )}

            <div>
              <Label>Cor de Identificação</Label>
              <div className="flex flex-wrap gap-3 mt-2">
                {COLORS.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, color: color.value })}
                    className="relative"
                  >
                    <div
                      className="size-10 rounded-lg border-2"
                      style={{
                        backgroundColor: color.value,
                        borderColor:
                          formData.color === color.value ? color.value : "transparent",
                        boxShadow:
                          formData.color === color.value
                            ? `0 0 0 2px white, 0 0 0 4px ${color.value}`
                            : "none",
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Horários de Trabalho</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {WEEKDAYS.map((day) => (
                <div key={day.value} className="flex items-center gap-4">
                  <div className="w-32 font-medium text-sm">{day.label}</div>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={`${day.value}-morning`}
                        checked={isScheduleActive(day.value, "morning")}
                        onCheckedChange={() => toggleSchedule(day.value, "morning")}
                      />
                      <Label htmlFor={`${day.value}-morning`} className="cursor-pointer">
                        Manhã (08:00-12:00)
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={`${day.value}-afternoon`}
                        checked={isScheduleActive(day.value, "afternoon")}
                        onCheckedChange={() => toggleSchedule(day.value, "afternoon")}
                      />
                      <Label
                        htmlFor={`${day.value}-afternoon`}
                        className="cursor-pointer"
                      >
                        Tarde (14:00-18:00)
                      </Label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3 justify-end">
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