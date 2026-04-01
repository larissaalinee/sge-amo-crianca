import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { format } from "date-fns";
import {
  mockAppointments,
  mockAssistidos,
  mockProfessionals,
  detectConflicts,
} from "../../data/amoData";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ArrowLeft, Save, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export function AppointmentForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const existing = isEditing ? mockAppointments.find((a) => a.id === id) : undefined;

  const [formData, setFormData] = useState({
    assistidoId: existing?.assistidoId || "",
    professionalId: existing?.professionalId || "",
    date: existing?.date ? format(existing.date, "yyyy-MM-dd") : "",
    startTime: existing?.startTime || "09:00",
    endTime: existing?.endTime || "10:00",
    type: existing?.type || "individual",
    isRecurring: existing?.isRecurring || false,
    needsSnack: existing?.needsSnack ?? true,
    needsTransport: existing?.needsTransport ?? false,
    hasCompanion: existing?.hasCompanion ?? false,
    notes: existing?.notes || "",
    eventTitle: existing?.type === "event" ? existing.notes.split(":")[0] : "",
  });

  const conflicts = detectConflicts(mockAppointments, {
    ...formData,
    id,
    date: formData.date ? new Date(formData.date) : undefined,
  } as any);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validação específica para eventos especiais
    if (formData.type === "event") {
      if (!formData.eventTitle || !formData.date) {
        toast.error("Preencha o título do evento e a data");
        return;
      }
    } else {
      if (!formData.assistidoId || !formData.professionalId || !formData.date) {
        toast.error("Preencha todos os campos obrigatórios");
        return;
      }
    }

    if (conflicts.length > 0) {
      toast.error("Existem conflitos de horário. Verifique e ajuste.");
      return;
    }

    toast.success(
      isEditing
        ? formData.type === "event"
          ? "Evento atualizado!"
          : "Atendimento atualizado!"
        : formData.type === "event"
        ? "Evento criado!"
        : "Atendimento agendado!"
    );
    navigate("/agenda");
  };

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="size-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
          {isEditing ? "Editar Atendimento" : "Novo Atendimento"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {conflicts.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="size-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-900 mb-2">
                  Conflitos Detectados:
                </h4>
                <ul className="space-y-1">
                  {conflicts.map((conflict, i) => (
                    <li key={i} className="text-sm text-red-800">
                      • {conflict}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Informações do Atendimento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Tipo de Atendimento */}
            <div>
              <Label htmlFor="type">
                Tipo de Atendimento <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value: any) =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Atendimento Individual</SelectItem>
                  <SelectItem value="group">Atendimento em Grupo</SelectItem>
                  <SelectItem value="event">Evento Especial</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-1">
                {formData.type === "event" && "Eventos especiais não requerem profissional específico"}
                {formData.type === "group" && "Atendimentos em grupo permitem múltiplos participantes"}
                {formData.type === "individual" && "Atendimentos individuais são exclusivos"}
              </p>
            </div>

            {/* Campos condicionais baseados no tipo */}
            {formData.type === "event" ? (
              <div>
                <Label htmlFor="eventTitle">
                  Título do Evento <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="eventTitle"
                  value={formData.eventTitle}
                  onChange={(e) => setFormData({ ...formData, eventTitle: e.target.value })}
                  placeholder="Ex: Festa Junina, Reunião de Pais, etc."
                  required
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="assistidoId">
                    Assistido <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.assistidoId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, assistidoId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o assistido" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockAssistidos.filter(a => a.status === "active").map((assistido) => (
                        <SelectItem key={assistido.id} value={assistido.id}>
                          {assistido.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="professionalId">
                    Profissional <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.professionalId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, professionalId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o profissional" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockProfessionals.map((prof) => (
                        <SelectItem key={prof.id} value={prof.id}>
                          {prof.name} - {prof.specialty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="date">
                  Data <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="startTime">
                  Início <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData({ ...formData, startTime: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="endTime">
                  Fim <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) =>
                    setFormData({ ...formData, endTime: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Adicione observações sobre o atendimento"
                rows={3}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="isRecurring"
                  checked={formData.isRecurring}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isRecurring: checked as boolean })
                  }
                />
                <Label htmlFor="isRecurring" className="cursor-pointer">
                  Atendimento recorrente (repetir semanalmente)
                </Label>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="needsSnack"
                  checked={formData.needsSnack}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, needsSnack: checked as boolean })
                  }
                />
                <Label htmlFor="needsSnack" className="cursor-pointer">
                  Necessita lanche
                </Label>
              </div>

              {formData.type !== "event" && (
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="needsTransport"
                    checked={formData.needsTransport}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, needsTransport: checked as boolean })
                    }
                  />
                  <Label htmlFor="needsTransport" className="cursor-pointer">
                    Necessita transporte
                  </Label>
                </div>
              )}

              {formData.type !== "event" && (
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="hasCompanion"
                    checked={formData.hasCompanion}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, hasCompanion: checked as boolean })
                    }
                  />
                  <Label htmlFor="hasCompanion" className="cursor-pointer">
                    Possui acompanhante
                  </Label>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3 justify-end">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Cancelar
          </Button>
          <Button type="submit" disabled={conflicts.length > 0}>
            <Save className="size-4 mr-2" />
            {isEditing ? "Atualizar" : "Agendar"}
          </Button>
        </div>
      </form>
    </div>
  );
}