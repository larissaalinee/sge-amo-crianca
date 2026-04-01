import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { format } from "date-fns";
import { mockAssistidos } from "../../data/amoData";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface FamilyMemberForm {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  allergies: string;
  dietaryRestrictions: string;
}

export function AssistidoForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const existingAssistido = isEditing
    ? mockAssistidos.find((p) => p.id === id)
    : undefined;

  const [formData, setFormData] = useState({
    name: existingAssistido?.name || "",
    cpf: existingAssistido?.cpf || "",
    birthDate: existingAssistido?.birthDate
      ? format(existingAssistido.birthDate, "yyyy-MM-dd")
      : "",
    address: existingAssistido?.address || "",
    phone: existingAssistido?.phone || "",
    needsTransport: existingAssistido?.needsTransport || false,
    allergies: existingAssistido?.allergies.join(", ") || "",
    dietaryRestrictions: existingAssistido?.dietaryRestrictions.join(", ") || "",
    specialNeeds: existingAssistido?.specialNeeds || "",
  });

  const [familyMembers, setFamilyMembers] = useState<FamilyMemberForm[]>(
    existingAssistido?.familyMembers.map((fm) => ({
      id: fm.id,
      name: fm.name,
      relationship: fm.relationship,
      phone: fm.phone,
      allergies: fm.allergies.join(", "),
      dietaryRestrictions: fm.dietaryRestrictions.join(", "),
    })) || []
  );

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação de campos obrigatórios
    if (!formData.name || !formData.cpf || !formData.birthDate || !formData.phone) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    try {
      // Chamada para a sua API Flask
      const response = await fetch("http://127.0.0.1:5000/api/assistidos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          familyMembers: familyMembers // Enviando a lista de familiares junto
        }),
      });

      if (response.ok) {
        if (isEditing) {
          toast.success("Assistido atualizado com sucesso!");
        } else {
          toast.success("Assistido cadastrado no sistema com sucesso!");
        }
        navigate("/assistidos");
      } else {
        const errorData = await response.json();
        toast.error(errorData.erro || "Erro ao salvar no servidor.");
      }
    } catch (error) {
      console.error("Erro na conexão:", error);
      toast.error("Não foi possível falar com o servidor backend. O Python está ligado?");
    }
  };
  const addFamilyMember = () => {
    setFamilyMembers([
      ...familyMembers,
      {
        id: `new-${Date.now()}`,
        name: "",
        relationship: "",
        phone: "",
        allergies: "",
        dietaryRestrictions: "",
      },
    ]);
  };

  const removeFamilyMember = (id: string) => {
    setFamilyMembers(familyMembers.filter((fm) => fm.id !== id));
  };

  const updateFamilyMember = (id: string, field: string, value: string) => {
    setFamilyMembers(
      familyMembers.map((fm) =>
        fm.id === id ? { ...fm, [field]: value } : fm
      )
    );
  };

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="size-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
          {isEditing ? "Editar Assistido" : "Novo Assistido"}
        </h1>
        <p className="text-gray-600">
          {isEditing
            ? "Atualize as informações do assistido"
            : "Cadastre um novo assistido no sistema"}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informações Básicas */}
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
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Ex: João da Silva"
                  required
                />
              </div>
              <div>
                <Label htmlFor="cpf">
                  CPF <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="cpf"
                  value={formData.cpf}
                  onChange={(e) =>
                    setFormData({ ...formData, cpf: e.target.value })
                  }
                  placeholder="000.000.000-00"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="birthDate">
                  Data de Nascimento <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) =>
                    setFormData({ ...formData, birthDate: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">
                  Telefone <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="(11) 99999-9999"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Endereço Completo</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                placeholder="Rua, número, complemento, bairro, cidade/estado"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Transporte */}
        <Card>
          <CardHeader>
            <CardTitle>Necessidades de Transporte</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Checkbox
                id="needsTransport"
                checked={formData.needsTransport}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, needsTransport: checked as boolean })
                }
              />
              <Label htmlFor="needsTransport" className="cursor-pointer">
                Necessita de transporte
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Alimentação */}
        <Card>
          <CardHeader>
            <CardTitle>Restrições Alimentares</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="allergies">Alergias</Label>
              <Input
                id="allergies"
                value={formData.allergies}
                onChange={(e) =>
                  setFormData({ ...formData, allergies: e.target.value })
                }
                placeholder="Ex: Amendoim, Lactose (separar por vírgula)"
              />
              <p className="text-xs text-gray-500 mt-1">
                Separe as alergias por vírgula
              </p>
            </div>

            <div>
              <Label htmlFor="dietaryRestrictions">Restrições Alimentares</Label>
              <Input
                id="dietaryRestrictions"
                value={formData.dietaryRestrictions}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dietaryRestrictions: e.target.value,
                  })
                }
                placeholder="Ex: Sem lactose, Vegetariano (separar por vírgula)"
              />
              <p className="text-xs text-gray-500 mt-1">
                Separe as restrições por vírgula
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Necessidades Especiais */}
        <Card>
          <CardHeader>
            <CardTitle>Necessidades Especiais</CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="specialNeeds">Observações</Label>
            <Textarea
              id="specialNeeds"
              value={formData.specialNeeds}
              onChange={(e) =>
                setFormData({ ...formData, specialNeeds: e.target.value })
              }
              placeholder="Ex: Cadeira de rodas, cadeirinha infantil, suporte para oxigênio, ou outras necessidades especiais para transporte e atendimento"
              rows={4}
            />
            <p className="text-xs text-gray-500 mt-1">
              Descreva equipamentos especiais necessários para o transporte (cadeira de rodas, cadeirinha infantil, etc.) e outras necessidades para o atendimento
            </p>
          </CardContent>
        </Card>

        {/* Familiares */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Núcleo Familiar</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={addFamilyMember}>
              <Plus className="size-4 mr-2" />
              Adicionar
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {familyMembers.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                Nenhum familiar cadastrado
              </p>
            ) : (
              familyMembers.map((member, index) => (
                <div
                  key={member.id}
                  className="border border-gray-200 rounded-lg p-4 space-y-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">
                      Familiar {index + 1}
                    </h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFamilyMember(member.id)}
                    >
                      <Trash2 className="size-4 text-red-600" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label>Nome</Label>
                      <Input
                        value={member.name}
                        onChange={(e) =>
                          updateFamilyMember(member.id, "name", e.target.value)
                        }
                        placeholder="Nome do familiar"
                      />
                    </div>
                    <div>
                      <Label>Parentesco</Label>
                      <Input
                        value={member.relationship}
                        onChange={(e) =>
                          updateFamilyMember(
                            member.id,
                            "relationship",
                            e.target.value
                          )
                        }
                        placeholder="Ex: Mãe, Pai, Irmão"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <Label>Telefone</Label>
                      <Input
                        value={member.phone}
                        onChange={(e) =>
                          updateFamilyMember(member.id, "phone", e.target.value)
                        }
                        placeholder="(11) 99999-9999"
                      />
                    </div>
                    <div>
                      <Label>Alergias</Label>
                      <Input
                        value={member.allergies}
                        onChange={(e) =>
                          updateFamilyMember(
                            member.id,
                            "allergies",
                            e.target.value
                          )
                        }
                        placeholder="Separar por vírgula"
                      />
                    </div>
                    <div>
                      <Label>Restrições</Label>
                      <Input
                        value={member.dietaryRestrictions}
                        onChange={(e) =>
                          updateFamilyMember(
                            member.id,
                            "dietaryRestrictions",
                            e.target.value
                          )
                        }
                        placeholder="Separar por vírgula"
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Cancelar
          </Button>
          <Button type="submit" className="bg-red-500 hover:bg-red-600">
            <Save className="size-4 mr-2" />
            {isEditing ? "Atualizar" : "Cadastrar"}
          </Button>
        </div>
      </form>
    </div>
  );
}