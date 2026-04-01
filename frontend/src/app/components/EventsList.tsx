import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { mockEvents, mockUsers } from "../data/mockData";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Calendar, Clock, MapPin, Search, Users, Plus, Edit, Trash2 } from "lucide-react";
import { Link } from "react-router";

export function EventsList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState<string>("all");

  const getUserById = (id: string) => {
    return mockUsers.find((user) => user.id === id);
  };

  const filteredEvents = mockEvents
    .filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase());

      if (filterBy === "all") return matchesSearch;
      if (filterBy === "upcoming") {
        return matchesSearch && event.date >= new Date();
      }
      if (filterBy === "past") {
        return matchesSearch && event.date < new Date();
      }
      return matchesSearch;
    })
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Todos os Eventos</h1>
          <p className="text-gray-600">Gerencie todos os eventos da sua agenda</p>
        </div>
        <Link to="/novo-evento">
          <Button size="lg">
            <Plus className="size-5 mr-2" />
            Novo Evento
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
              <Input
                placeholder="Buscar eventos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filtrar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="upcoming">Próximos</SelectItem>
                <SelectItem value="past">Passados</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Events List */}
      <div className="space-y-4">
        {filteredEvents.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Calendar className="size-12 text-gray-300 mb-3" />
              <p className="text-gray-500">Nenhum evento encontrado</p>
            </CardContent>
          </Card>
        ) : (
          filteredEvents.map((event) => {
            const createdByUser = getUserById(event.createdBy);
            const isPast = event.date < new Date();

            return (
              <Card
                key={event.id}
                className={`hover:shadow-md transition-shadow ${isPast ? "opacity-70" : ""}`}
              >
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    {/* Date Badge */}
                    <div className="flex-shrink-0">
                      <div
                        className="w-20 h-20 rounded-lg flex flex-col items-center justify-center text-white"
                        style={{ backgroundColor: event.color }}
                      >
                        <span className="text-2xl font-bold">
                          {format(event.date, "dd")}
                        </span>
                        <span className="text-xs uppercase">
                          {format(event.date, "MMM", { locale: ptBR })}
                        </span>
                      </div>
                    </div>

                    {/* Event Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-xl text-gray-900 mb-1">
                            {event.title}
                          </h3>
                          <p className="text-gray-600">{event.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <Link to={`/editar-evento/${event.id}`}>
                            <Button variant="ghost" size="icon">
                              <Edit className="size-4" />
                            </Button>
                          </Link>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="size-4 text-red-600" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="size-5 flex-shrink-0" />
                          <span>
                            {format(event.date, "EEEE, d 'de' MMMM 'de' yyyy", {
                              locale: ptBR,
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="size-5 flex-shrink-0" />
                          <span>
                            {event.startTime} - {event.endTime}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="size-5 flex-shrink-0" />
                          <span>{event.location}</span>
                        </div>
                      </div>

                      {/* Attendees */}
                      <div className="flex items-center gap-3">
                        <Users className="size-5 text-gray-500" />
                        <div className="flex items-center gap-3">
                          <div className="flex -space-x-2">
                            {event.attendees.slice(0, 5).map((attendeeId) => {
                              const user = getUserById(attendeeId);
                              return (
                                <Avatar
                                  key={attendeeId}
                                  className="size-8 border-2 border-white"
                                >
                                  <AvatarImage src={user?.avatar} />
                                  <AvatarFallback>
                                    {user?.name.substring(0, 2).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                              );
                            })}
                          </div>
                          <span className="text-sm text-gray-600">
                            {event.attendees.length} participante
                            {event.attendees.length !== 1 ? "s" : ""}
                          </span>
                        </div>
                        <div className="ml-auto">
                          <Badge variant="outline">
                            Criado por {createdByUser?.name}
                          </Badge>
                        </div>
                      </div>

                      {isPast && (
                        <div className="mt-3">
                          <Badge variant="secondary">Evento Passado</Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
