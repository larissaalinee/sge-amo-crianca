import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { mockSharedCalendars, mockUsers } from "../data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Mail, UserPlus, Trash2, Shield, Eye, Edit } from "lucide-react";
import { toast } from "sonner";

export function ShareManagement() {
  const [email, setEmail] = useState("");
  const [permission, setPermission] = useState<"view" | "edit">("view");

  const handleShare = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Por favor, insira um e-mail");
      return;
    }

    // Mock share
    toast.success(`Convite enviado para ${email}`);
    setEmail("");
  };

  const handleRemoveAccess = (userId: string) => {
    const user = mockUsers.find((u) => u.id === userId);
    toast.success(`Acesso removido para ${user?.name}`);
  };

  const handleChangePermission = (userId: string, newPermission: string) => {
    const user = mockUsers.find((u) => u.id === userId);
    toast.success(`Permissão atualizada para ${user?.name}`);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Compartilhamentos
        </h1>
        <p className="text-gray-600">
          Gerencie quem tem acesso à sua agenda compartilhada
        </p>
      </div>

      {/* Share Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="size-5" />
            Compartilhar Agenda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleShare} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Input
                  type="email"
                  placeholder="email@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex gap-2">
                <Select value={permission} onValueChange={(v: "view" | "edit") => setPermission(v)}>
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="view">
                      <div className="flex items-center gap-2">
                        <Eye className="size-4" />
                        <span>Visualizar</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="edit">
                      <div className="flex items-center gap-2">
                        <Edit className="size-4" />
                        <span>Editar</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Button type="submit">
                  <Mail className="size-4 mr-2" />
                  Convidar
                </Button>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              Enviaremos um convite por e-mail para a pessoa acessar sua agenda
            </p>
          </form>
        </CardContent>
      </Card>

      {/* Shared Users List */}
      <Card>
        <CardHeader>
          <CardTitle>Pessoas com Acesso ({mockSharedCalendars.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockSharedCalendars.map((shared) => {
              const user = mockUsers.find((u) => u.id === shared.userId);
              if (!user) return null;

              return (
                <div
                  key={shared.id}
                  className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Avatar className="size-12">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>
                      {user.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Compartilhado em{" "}
                      {format(shared.sharedAt, "d 'de' MMMM 'de' yyyy", {
                        locale: ptBR,
                      })}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Select
                      value={shared.permission}
                      onValueChange={(v) => handleChangePermission(user.id, v)}
                    >
                      <SelectTrigger className="w-36">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="view">
                          <div className="flex items-center gap-2">
                            <Eye className="size-4" />
                            <span>Visualizar</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="edit">
                          <div className="flex items-center gap-2">
                            <Edit className="size-4" />
                            <span>Editar</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveAccess(user.id)}
                    >
                      <Trash2 className="size-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Permissions Info */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="size-5" />
            Sobre as Permissões
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <Badge variant="outline" className="bg-blue-50">
                <Eye className="size-3 mr-1" />
                Visualizar
              </Badge>
            </div>
            <p className="text-sm text-gray-600">
              Pode ver todos os eventos da agenda, mas não pode criar, editar ou
              excluir
            </p>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <Badge variant="outline" className="bg-green-50">
                <Edit className="size-3 mr-1" />
                Editar
              </Badge>
            </div>
            <p className="text-sm text-gray-600">
              Pode ver, criar, editar e excluir eventos na agenda compartilhada
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
