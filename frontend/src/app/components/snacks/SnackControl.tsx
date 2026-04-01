import { useState } from "react";
import { format, startOfWeek, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  mockAppointments,
  mockAssistidos,
  getAssistidoName,
} from "../../data/amoData";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  UtensilsCrossed,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Circle,
  XCircle,
  Printer,
} from "lucide-react";
import { toast } from "sonner";

interface SnackConsumption {
  appointmentId: string;
  consumed: boolean | null; // null = não marcado, true = comeu, false = não comeu
  markedAt?: Date;
}

export function SnackControl() {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [snackConsumptions, setSnackConsumptions] = useState<SnackConsumption[]>([]);
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 5 }, (_, i) => addDays(weekStart, i));

  const getSnacksForDay = (day: Date) => {
    const dayAppointments = mockAppointments.filter(
      (apt) =>
        apt.date.toDateString() === day.toDateString() &&
        apt.status === "scheduled" &&
        apt.needsSnack
    );

    return dayAppointments.map((apt) => {
      const assistido = mockAssistidos.find((p) => p.id === apt.assistidoId);
      return {
        appointment: apt,
        assistido,
      };
    });
  };

  const getAllergiesAndRestrictions = () => {
    const all = new Set<string>();
    mockAssistidos.forEach((assistido) => {
      assistido.allergies.forEach((a) => all.add(a));
      assistido.dietaryRestrictions.forEach((r) => all.add(r));
    });
    return Array.from(all);
  };

  const weekTotal = weekDays.reduce(
    (sum, day) => sum + getSnacksForDay(day).length,
    0
  );

  const toggleSnackConsumption = (appointmentId: string, consumed: boolean) => {
    const existingConsumption = snackConsumptions.find(
      (c) => c.appointmentId === appointmentId
    );

    if (existingConsumption) {
      setSnackConsumptions((prev) =>
        prev.map((c) =>
          c.appointmentId === appointmentId
            ? { ...c, consumed, markedAt: new Date() }
            : c
        )
      );
    } else {
      setSnackConsumptions((prev) => [
        ...prev,
        { appointmentId, consumed, markedAt: new Date() },
      ]);
    }

    toast.success(
      consumed ? "Lanche marcado como consumido" : "Lanche marcado como não consumido"
    );
  };

  const handlePrintReport = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Não foi possível abrir a janela de impressão");
      return;
    }

    const allergiesAndRestrictions = getAllergiesAndRestrictions();

    let htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Relatório Semanal de Lanches - AMO Criança</title>
          <style>
            @media print {
              @page { margin: 1.5cm; }
            }
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              color: #333;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 3px solid #EF5350;
              padding-bottom: 15px;
            }
            .header h1 {
              color: #EF5350;
              font-size: 24px;
              margin-bottom: 5px;
            }
            .header h2 {
              font-size: 18px;
              color: #666;
              font-weight: normal;
            }
            .header .date {
              font-size: 14px;
              color: #999;
              margin-top: 5px;
            }
            .restrictions {
              background-color: #FFF3CD;
              border: 2px solid #FFC107;
              border-radius: 8px;
              padding: 15px;
              margin-bottom: 25px;
            }
            .restrictions h3 {
              color: #856404;
              font-size: 16px;
              margin-bottom: 10px;
            }
            .restrictions-list {
              display: flex;
              flex-wrap: wrap;
              gap: 8px;
            }
            .restriction-badge {
              background-color: white;
              border: 1px solid #FFC107;
              padding: 4px 12px;
              border-radius: 4px;
              font-size: 13px;
              color: #856404;
            }
            .day-section {
              margin-bottom: 25px;
              page-break-inside: avoid;
            }
            .day-header {
              background-color: #EF5350;
              color: white;
              padding: 10px 15px;
              border-radius: 6px;
              font-size: 16px;
              font-weight: bold;
              margin-bottom: 15px;
            }
            .snack-item {
              border: 1px solid #ddd;
              border-radius: 6px;
              padding: 12px;
              margin-bottom: 10px;
              background-color: #fafafa;
            }
            .snack-header {
              display: flex;
              justify-content: space-between;
              margin-bottom: 8px;
              padding-bottom: 8px;
              border-bottom: 1px solid #e0e0e0;
            }
            .snack-name {
              font-size: 15px;
              font-weight: bold;
              color: #333;
            }
            .snack-time {
              font-size: 14px;
              color: #666;
            }
            .snack-details {
              font-size: 13px;
              color: #555;
              line-height: 1.6;
            }
            .allergy {
              color: #D32F2F;
              font-weight: 600;
            }
            .restriction {
              color: #F57C00;
              font-weight: 600;
            }
            .no-restrictions {
              color: #4CAF50;
            }
            .checkbox-section {
              margin-top: 8px;
              padding-top: 8px;
              border-top: 1px dashed #ccc;
              display: flex;
              gap: 20px;
              font-size: 13px;
            }
            .checkbox-item {
              display: flex;
              align-items: center;
              gap: 5px;
            }
            .checkbox-item input {
              width: 16px;
              height: 16px;
            }
            .no-snacks {
              text-align: center;
              padding: 20px;
              color: #999;
              font-style: italic;
            }
            .footer {
              margin-top: 30px;
              padding-top: 15px;
              border-top: 2px solid #EF5350;
              text-align: center;
              font-size: 12px;
              color: #999;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🍴 AMO Criança - Controle de Lanches</h1>
            <h2>Relatório Semanal</h2>
            <p class="date">Semana de ${format(weekStart, "dd/MM/yyyy", { locale: ptBR })} a ${format(addDays(weekStart, 4), "dd/MM/yyyy", { locale: ptBR })}</p>
            <p class="date">Total: ${weekTotal} lanches</p>
          </div>

          ${allergiesAndRestrictions.length > 0 ? `
          <div class="restrictions">
            <h3>⚠️ Restrições Alimentares Cadastradas</h3>
            <div class="restrictions-list">
              ${allergiesAndRestrictions.map(item => `<span class="restriction-badge">${item}</span>`).join('')}
            </div>
          </div>
          ` : ''}
    `;

    weekDays.forEach((day) => {
      const snacks = getSnacksForDay(day);
      const dayName = format(day, "EEEE, dd 'de' MMMM", { locale: ptBR });
      const capitalizedDayName = dayName.charAt(0).toUpperCase() + dayName.slice(1);

      htmlContent += `
        <div class="day-section">
          <div class="day-header">
            ${capitalizedDayName} - ${snacks.length} lanche(s)
          </div>
      `;

      if (snacks.length === 0) {
        htmlContent += `<div class="no-snacks">Nenhum lanche necessário neste dia</div>`;
      } else {
        snacks.forEach((snack: any) => {
          const hasAllergies = snack.assistido?.allergies && snack.assistido.allergies.length > 0;
          const hasRestrictions = snack.assistido?.dietaryRestrictions && snack.assistido.dietaryRestrictions.length > 0;

          htmlContent += `
            <div class="snack-item">
              <div class="snack-header">
                <span class="snack-name">${snack.assistido?.name || "N/A"}</span>
                <span class="snack-time">⏰ ${snack.appointment.startTime}</span>
              </div>
              <div class="snack-details">
          `;

          if (hasAllergies) {
            htmlContent += `
              <div class="allergy">
                🚨 Alergias: ${snack.assistido.allergies.join(", ")}
              </div>
            `;
          }

          if (hasRestrictions) {
            htmlContent += `
              <div class="restriction">
                ⚠️ Restrições: ${snack.assistido.dietaryRestrictions.join(", ")}
              </div>
            `;
          }

          if (!hasAllergies && !hasRestrictions) {
            htmlContent += `<div class="no-restrictions">✓ Sem restrições alimentares</div>`;
          }

          htmlContent += `
              </div>
              <div class="checkbox-section">
                <div class="checkbox-item">
                  <input type="checkbox" id="sim-${snack.appointment.id}">
                  <label for="sim-${snack.appointment.id}">Consumiu: Sim</label>
                </div>
                <div class="checkbox-item">
                  <input type="checkbox" id="nao-${snack.appointment.id}">
                  <label for="nao-${snack.appointment.id}">Consumiu: Não</label>
                </div>
              </div>
            </div>
          `;
        });
      }

      htmlContent += `</div>`;
    });

    htmlContent += `
          <div class="footer">
            Relatório gerado em ${format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Aguarda o carregamento antes de imprimir
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
    };

    toast.success("Relatório preparado para impressão");
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
          Controle de Lanches
        </h1>
        <p className="text-gray-600">
          Gerencie os lanches considerando restrições alimentares
        </p>
      </div>

      {/* Week Navigation */}
      <Card className="mb-6">
        <CardContent className="p-4 flex items-center justify-between">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentWeek(addDays(currentWeek, -7))}
          >
            <ChevronLeft className="size-5" />
          </Button>
          <div className="text-center">
            <h2 className="font-bold text-lg">
              Semana de {format(weekStart, "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Total da semana: {weekTotal} lanches
            </p>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentWeek(addDays(currentWeek, 7))}
          >
            <ChevronRight className="size-5" />
          </Button>
        </CardContent>
      </Card>

      {/* Restrictions Alert */}
      <Card className="mb-6 bg-yellow-50 border-yellow-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="size-6 text-yellow-600 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-yellow-900 mb-2">
                Restrições Alimentares Cadastradas
              </h3>
              <div className="flex flex-wrap gap-2">
                {getAllergiesAndRestrictions().map((item, i) => (
                  <Badge key={i} variant="outline" className="bg-white border-yellow-300">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Snack Lists */}
      <div className="space-y-6">
        {weekDays.map((day) => {
          const snacks = getSnacksForDay(day);

          return (
            <Card key={day.toString()}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>
                    {format(day, "EEEE, dd 'de' MMMM", { locale: ptBR })}
                  </span>
                  <Badge variant="secondary">
                    <UtensilsCrossed className="size-3 mr-1" />
                    {snacks.length} lanche(s)
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {snacks.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    Nenhum lanche necessário neste dia
                  </p>
                ) : (
                  <div className="space-y-3">
                    {snacks.map((snack: any, idx) => {
                      const consumption = snackConsumptions.find(
                        (c) => c.appointmentId === snack.appointment.id
                      );

                      return (
                        <div
                          key={idx}
                          className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-semibold text-gray-900">
                                  {snack.assistido?.name}
                                </h4>
                                {consumption?.consumed === true && (
                                  <Badge className="bg-green-100 text-green-800">
                                    <CheckCircle className="size-3 mr-1" />
                                    Comeu
                                  </Badge>
                                )}
                                {consumption?.consumed === false && (
                                  <Badge className="bg-red-100 text-red-800">
                                    <XCircle className="size-3 mr-1" />
                                    Não comeu
                                  </Badge>
                                )}
                              </div>

                              <div className="space-y-1">
                                {snack.assistido?.allergies &&
                                  snack.assistido.allergies.length > 0 && (
                                    <div className="flex items-start gap-2">
                                      <AlertCircle className="size-4 text-red-600 flex-shrink-0 mt-0.5" />
                                      <div>
                                        <span className="text-sm font-medium text-red-900">
                                          Alergias:{" "}
                                        </span>
                                        <span className="text-sm text-red-700">
                                          {snack.assistido.allergies.join(", ")}
                                        </span>
                                      </div>
                                    </div>
                                  )}

                                {snack.assistido?.dietaryRestrictions &&
                                  snack.assistido.dietaryRestrictions.length > 0 && (
                                    <div className="flex items-start gap-2">
                                      <UtensilsCrossed className="size-4 text-orange-600 flex-shrink-0 mt-0.5" />
                                      <div>
                                        <span className="text-sm font-medium text-orange-900">
                                          Restrições:{" "}
                                        </span>
                                        <span className="text-sm text-orange-700">
                                          {snack.assistido.dietaryRestrictions.join(", ")}
                                        </span>
                                      </div>
                                    </div>
                                  )}

                                {(!snack.assistido?.allergies ||
                                  snack.assistido.allergies.length === 0) &&
                                  (!snack.assistido?.dietaryRestrictions ||
                                    snack.assistido.dietaryRestrictions.length === 0) && (
                                    <p className="text-sm text-gray-500">
                                      Sem restrições alimentares
                                    </p>
                                  )}
                              </div>
                            </div>

                            <div className="text-right ml-4">
                              <p className="text-sm text-gray-600">Horário</p>
                              <p className="font-medium">
                                {snack.appointment.startTime}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                            <span className="text-sm text-gray-600 mr-2">Consumiu:</span>
                            <Button
                              size="sm"
                              variant={consumption?.consumed === true ? "default" : "outline"}
                              onClick={() => toggleSnackConsumption(snack.appointment.id, true)}
                              className="flex-1"
                            >
                              <CheckCircle className="size-4 mr-1" />
                              Sim
                            </Button>
                            <Button
                              size="sm"
                              variant={consumption?.consumed === false ? "destructive" : "outline"}
                              onClick={() => toggleSnackConsumption(snack.appointment.id, false)}
                              className="flex-1"
                            >
                              <XCircle className="size-4 mr-1" />
                              Não
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Print Button */}
      <div className="mt-8 text-center">
        <Button
          size="lg"
          variant="default"
          onClick={handlePrintReport}
          className="flex items-center gap-2"
        >
          <Printer className="size-5" />
          Imprimir Relatório
        </Button>
      </div>
    </div>
  );
}