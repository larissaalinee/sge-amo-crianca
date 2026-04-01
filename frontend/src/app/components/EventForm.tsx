import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { format } from "date-fns";
import { mockEvents, mockUsers } from "../data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Checkbox } from "./ui/checkbox";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";

const COLORS = [
  { name: "Azul", value: "#3b82f6" },
  { name: "Verde", value: "#10b981" },
  { name: "Laranja", value: "#f59e0b" },
  { name: "Roxo", value: "#8b5cf6" },
  { name: "Ciano", value: "#06b6d4" },
  { name: "Rosa", value: "#ec4899" },
  { name: "Teal", value: "#14b8a6" },
  { name: "Vermelho", value: "#ef4444" },
];

export function EventForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const existingEvent = isEditing
    ? mockEvents.find((e) => e.id === id)
    : undefined;

  const [formData, setFormData] = useState({
    title: existingEvent?.title || "",
    description: existingEvent?.description || "",
    date: existingEvent?.date
      ? format(existingEvent.date, "yyyy-MM-dd")
      : format(new Date(), "yyyy-MM-dd"),
    startTime: existingEvent?.startTime || "09:00",
    endTime: existingEvent?.endTime || "10:00",
    location: existingEvent?.location || "",
    color: existingEvent?.color || COLORS[0].value,
    attendees: existingEvent?.attendees || ["1"],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.date || !formData.startTime || !formData.endTime) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    // Mock save
    if (isEditing) {
      toast.success("Evento atualizado com sucesso!");
    } else {
      toast.success("Evento criado com sucesso!");
    }

    navigate("/eventos");
  };

  const toggleAttendee = (userId: string) => {
    setFormData((prev) => ({
      ...prev,
      attendees: prev.attendees.includes(userId)
        ? prev.attendees.filter((id) => id !== userId)
        : [...prev.attendees, userId],
    }));
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="size-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {isEditing ? "Editar Evento" : "Novo Evento"}
        </h1>
        <p className="text-gray-600">
          {isEditing
            ? "Atualize as informações do evento"
            : "Crie um novo evento na sua agenda compartilhada"}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Informações do Evento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Title */}
            <div>
              <Label htmlFor="title">
                Título <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Ex: Reunião de Equipe"
                required
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Descreva o evento..."
                rows={4}
              />
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="date">
                  Data <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="startTime">
                  Hora Início <span className="text-red-500">*</span>
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
                  Hora Fim <span className="text-red-500">*</span>
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

            {/* Location */}
            <div>
              <Label htmlFor="location">Localização</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="Ex: Sala de Reuniões A"
              />
            </div>

            {/* Color */}
            <div>
              <Label>Cor do Evento</Label>
              <div className="flex flex-wrap gap-3 mt-2">
                {COLORS.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, color: color.value })
                    }
                    className="relative"
                  >
                    <div
                      className="size-10 rounded-lg border-2 transition-transform hover:scale-110"
                      style={{
                        backgroundColor: color.value,
                        borderColor:
                          formData.color === color.value
                            ? color.value
                            : "transparent",
                        boxShadow:
                          formData.color === color.value
                            ? `0 0 0 2px white, 0 0 0 4px ${color.value}`
                            : "none",
                      }}
                      title={color.name}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Attendees */}
            <div>
              <Label>Participantes</Label>
              <div className="mt-3 space-y-3">
                {mockUsers.map((user) => (
                  <div key={user.id} className="flex items-center gap-3">
                    <Checkbox
                      id={`user-${user.id}`}
                      checked={formData.attendees.includes(user.id)}
                      onCheckedChange={() => toggleAttendee(user.id)}
                    />
                    <Label
                      htmlFor={`user-${user.id}`}
                      className="flex items-center gap-3 cursor-pointer flex-1"
                    >
                      <Avatar className="size-10">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>
                          {user.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="mt-6 flex gap-3 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
          >
            Cancelar
          </Button>
          <Button type="submit">
            <Save className="size-4 mr-2" />
            {isEditing ? "Atualizar Evento" : "Criar Evento"}
          </Button>
        </div>
      </form>
    </div>
  );
}
