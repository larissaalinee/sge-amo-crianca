import { useState } from "react";
import { Link } from "react-router";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { mockAssistidos } from "../../data/amoData";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Car,
  Baby,
  AlertCircle,
  Phone,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";

export function AssistidosList() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAssistidos = mockAssistidos.filter(
    (assistido) =>
      assistido.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assistido.cpf.includes(searchTerm) ||
      assistido.phone.includes(searchTerm)
  );

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Tem certeza que deseja excluir o assistido ${name}?`)) {
      toast.success(`Assistido ${name} excluído com sucesso`);
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 lg:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            Assistidos
          </h1>
          <p className="text-gray-600">Gerencie os assistidos cadastrados</p>
        </div>
        <Link to="/assistidos/novo">
          <Button size="lg" className="bg-red-500 hover:bg-red-600">
            <Plus className="size-5 mr-2" />
            Novo Assistido
          </Button>
        </Link>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="p-4 lg:p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
            <Input
              placeholder="Buscar por nome, CPF ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600 mb-1">Total</p>
            <p className="text-2xl font-bold">{mockAssistidos.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600 mb-1">Com Transporte</p>
            <p className="text-2xl font-bold">
              {mockAssistidos.filter((p) => p.needsTransport).length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600 mb-1">Usa Cadeirinha</p>
            <p className="text-2xl font-bold">
              {mockAssistidos.filter((p) => p.usesCarSeat).length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600 mb-1">Com Alergias</p>
            <p className="text-2xl font-bold">
              {mockAssistidos.filter((p) => p.allergies.length > 0).length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Assistidos List */}
      <div className="space-y-4">
        {filteredAssistidos.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Search className="size-12 text-gray-300 mb-3" />
              <p className="text-gray-500">Nenhum assistido encontrado</p>
            </CardContent>
          </Card>
        ) : (
          filteredAssistidos.map((assistido) => (
            <Card key={assistido.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 lg:p-6">
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  {/* Assistido Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900 mb-1">
                          {assistido.name}
                        </h3>
                        <p className="text-sm text-gray-600">CPF: {assistido.cpf}</p>
                        <p className="text-sm text-gray-600">
                          Nascimento:{" "}
                          {format(assistido.birthDate, "dd/MM/yyyy", { locale: ptBR })}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {assistido.needsTransport && (
                          <Badge variant="secondary">
                            <Car className="size-3 mr-1" />
                            Transporte
                          </Badge>
                        )}
                        {assistido.usesCarSeat && (
                          <Badge variant="secondary">
                            <Baby className="size-3 mr-1" />
                            Cadeirinha
                          </Badge>
                        )}
                        {assistido.allergies.length > 0 && (
                          <Badge variant="destructive">
                            <AlertCircle className="size-3 mr-1" />
                            Alergias
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                      <div className="flex items-start gap-2 text-sm text-gray-600">
                        <Phone className="size-4 flex-shrink-0 mt-0.5" />
                        <span>{assistido.phone}</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm text-gray-600">
                        <MapPin className="size-4 flex-shrink-0 mt-0.5" />
                        <span className="break-words">{assistido.address}</span>
                      </div>
                    </div>

                    {assistido.allergies.length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          Alergias:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {assistido.allergies.map((allergy, i) => (
                            <Badge key={i} variant="outline" className="text-red-700 border-red-300">
                              {allergy}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {assistido.dietaryRestrictions.length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          Restrições Alimentares:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {assistido.dietaryRestrictions.map((restriction, i) => (
                            <Badge key={i} variant="outline">
                              {restriction}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {assistido.specialNeeds && (
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          Necessidades Especiais:
                        </p>
                        <p className="text-sm text-gray-600">{assistido.specialNeeds}</p>
                      </div>
                    )}

                    {assistido.familyMembers.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-2">
                          Familiares ({assistido.familyMembers.length}):
                        </p>
                        <div className="space-y-2">
                          {assistido.familyMembers.map((member) => (
                            <div
                              key={member.id}
                              className="text-sm text-gray-600 flex items-center gap-2"
                            >
                              <span className="font-medium">{member.name}</span>
                              <span className="text-gray-400">•</span>
                              <span>{member.relationship}</span>
                              <span className="text-gray-400">•</span>
                              <span>{member.phone}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex lg:flex-col gap-2">
                    <Link to={`/assistidos/editar/${assistido.id}`} className="flex-1 lg:flex-initial">
                      <Button variant="outline" size="sm" className="w-full">
                        <Edit className="size-4 mr-2" />
                        Editar
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(assistido.id, assistido.name)}
                      className="flex-1 lg:flex-initial text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="size-4 mr-2" />
                      Excluir
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}