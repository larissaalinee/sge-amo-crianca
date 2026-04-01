import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { mockEvents, mockUsers } from "../data/mockData";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { cn } from "./ui/utils";
import { Link } from "react-router";

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEventsForDay = (day: Date) => {
    return mockEvents.filter((event) => isSameDay(event.date, day));
  };

  const previousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const today = new Date();
  const isToday = (day: Date) => isSameDay(day, today);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Calendário</h1>
          <p className="text-gray-600">Visualize todos os seus eventos em um só lugar</p>
        </div>
        <Link to="/novo-evento">
          <Button size="lg">
            <Plus className="size-5 mr-2" />
            Novo Evento
          </Button>
        </Link>
      </div>

      {/* Calendar Controls */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {format(currentDate, "MMMM yyyy", { locale: ptBR })}
            </h2>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={previousMonth}>
                <ChevronLeft className="size-5" />
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentDate(new Date())}
              >
                Hoje
              </Button>
              <Button variant="outline" size="icon" onClick={nextMonth}>
                <ChevronRight className="size-5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendar Grid */}
      <Card>
        <CardContent className="p-6">
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-4 mb-4">
            {["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"].map((day) => (
              <div key={day} className="text-center font-semibold text-gray-700 text-sm">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-4">
            {/* Empty cells for days before month starts */}
            {Array.from({ length: monthStart.getDay() }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}

            {/* Days of the month */}
            {daysInMonth.map((day) => {
              const dayEvents = getEventsForDay(day);
              const isTodayDate = isToday(day);

              return (
                <div
                  key={day.toString()}
                  className={cn(
                    "aspect-square border rounded-lg p-2 flex flex-col",
                    isTodayDate ? "border-blue-600 bg-blue-50" : "border-gray-200 bg-white"
                  )}
                >
                  <div
                    className={cn(
                      "text-sm font-medium mb-2",
                      isTodayDate ? "text-blue-600" : "text-gray-900"
                    )}
                  >
                    {format(day, "d")}
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-1">
                    {dayEvents.slice(0, 3).map((event) => (
                      <div
                        key={event.id}
                        className="text-xs px-2 py-1 rounded truncate cursor-pointer hover:opacity-80 transition-opacity"
                        style={{
                          backgroundColor: event.color,
                          color: "white",
                        }}
                        title={event.title}
                      >
                        {event.startTime} {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-xs text-gray-500 px-2">
                        +{dayEvents.length - 3} mais
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card className="mt-6">
        <CardContent className="p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Legenda de Cores</h3>
          <div className="flex flex-wrap gap-4">
            {Array.from(new Set(mockEvents.map((e) => e.color))).map((color) => {
              const eventsWithColor = mockEvents.filter((e) => e.color === color);
              const createdBy = mockUsers.find((u) => u.id === eventsWithColor[0].createdBy);
              return (
                <div key={color} className="flex items-center gap-2">
                  <div
                    className="size-4 rounded"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-sm text-gray-700">
                    {createdBy?.name || "Eventos"}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
