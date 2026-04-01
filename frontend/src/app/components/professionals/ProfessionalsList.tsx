import { useState } from "react";
import { Link } from "react-router";
import { mockProfessionals } from "../../data/amoData";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Search, Plus, Edit, Trash2, Phone, Mail, Clock } from "lucide-react";
import { toast } from "sonner";

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export function ProfessionalsList() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProfessionals = mockProfessionals.filter(
    (prof) =>
      prof.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prof.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Excluir profissional ${name}?`)) {
      toast.success(`${name} excluído com sucesso`);
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6 lg:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            Profissionais
          </h1>
          <p className="text-gray-600">Gerencie a equipe multidisciplinar</p>
        </div>
        <Link to="/profissionais/novo">
          <Button size="lg">
            <Plus className="size-5 mr-2" />
            Novo Profissional
          </Button>
        </Link>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4 lg:p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
            <Input
              placeholder="Buscar por nome ou especialidade..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredProfessionals.map((prof) => (
          <Card key={prof.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 lg:p-6">
              <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                <div
                  className="w-2 h-full rounded-full hidden lg:block"
                  style={{ backgroundColor: prof.color }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{prof.name}</h3>
                      <Badge className="mt-1" style={{ backgroundColor: prof.color }}>
                        {prof.specialty}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="size-4" />
                      {prof.phone}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="size-4" />
                      {prof.email}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="size-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">
                        Horários de Trabalho:
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {prof.workSchedule.map((schedule, i) => (
                        <Badge key={i} variant="outline">
                          {WEEKDAYS[schedule.dayOfWeek]}: {schedule.startTime} -{" "}
                          {schedule.endTime}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex lg:flex-col gap-2">
                  <Link
                    to={`/profissionais/editar/${prof.id}`}
                    className="flex-1 lg:flex-initial"
                  >
                    <Button variant="outline" size="sm" className="w-full">
                      <Edit className="size-4 mr-2" />
                      Editar
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(prof.id, prof.name)}
                    className="flex-1 lg:flex-initial text-red-600"
                  >
                    <Trash2 className="size-4 mr-2" />
                    Excluir
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
