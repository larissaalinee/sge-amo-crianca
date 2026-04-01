import { useNavigate } from "react-router";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export function AccessDenied() {
  const navigate = useNavigate();

  return (
    <div className="p-4 lg:p-8 max-w-2xl mx-auto">
      <Card className="text-center">
        <CardContent className="pt-12 pb-12">
          <div className="flex justify-center mb-6">
            <div className="size-20 bg-red-50 rounded-full flex items-center justify-center">
              <ShieldAlert className="size-10 text-red-500" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Acesso Negado
          </h1>

          <p className="text-gray-600 mb-8">
            Você não tem permissão para acessar este módulo do sistema.
            <br />
            Entre em contato com a coordenação se precisar de acesso.
          </p>

          <Button onClick={() => navigate(-1)} className="bg-red-500 hover:bg-red-600">
            <ArrowLeft className="size-4 mr-2" />
            Voltar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
