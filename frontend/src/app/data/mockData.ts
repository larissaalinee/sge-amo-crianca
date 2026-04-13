export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  startTime: string;
  endTime: string;
  location: string;
  color: string;
  attendees: string[];
  createdBy: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface Assistido {
  id: string;
  nome: string;
  dataNascimento: string;
  categoria: string;
  status: 'Ativo' | 'Inativo';
  atendimentos: number;
}

export const mockUsers: User[] = [
  {
    id: "1",
    name: "Você",
    email: "voce@exemplo.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
  },
  {
    id: "2",
    name: "Maria Silva",
    email: "maria@exemplo.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
  },
  {
    id: "3",
    name: "João Santos",
    email: "joao@exemplo.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=3",
  },
  {
    id: "4",
    name: "Ana Oliveira",
    email: "ana@exemplo.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=4",
  },
  {
    id: "5",
    name: "Pedro Costa",
    email: "pedro@exemplo.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=5",
  },
];

export const mockEvents: Event[] = [
  {
    id: "1",
    title: "Reunião de Planejamento",
    description: "Planejamento do Q2 2026",
    date: new Date(2026, 2, 15, 9, 0),
    startTime: "09:00",
    endTime: "11:00",
    location: "Sala de Conferências A",
    color: "#3b82f6",
    attendees: ["1", "2", "3"],
    createdBy: "1",
  },
  {
    id: "2",
    title: "Apresentação do Projeto",
    description: "Apresentação para stakeholders",
    date: new Date(2026, 2, 16, 14, 0),
    startTime: "14:00",
    endTime: "15:30",
    location: "Auditório Principal",
    color: "#10b981",
    attendees: ["1", "2", "4"],
    createdBy: "2",
  },
  {
    id: "3",
    title: "Workshop de UX",
    description: "Workshop sobre design de experiência do usuário",
    date: new Date(2026, 2, 18, 10, 0),
    startTime: "10:00",
    endTime: "12:00",
    location: "Sala de Treinamento",
    color: "#f59e0b",
    attendees: ["1", "3", "5"],
    createdBy: "3",
  },
  {
    id: "4",
    title: "Almoço com Cliente",
    description: "Reunião informal com cliente VIP",
    date: new Date(2026, 2, 19, 12, 30),
    startTime: "12:30",
    endTime: "14:00",
    location: "Restaurante Bella Vista",
    color: "#8b5cf6",
    attendees: ["1", "2"],
    createdBy: "1",
  },
  {
    id: "5",
    title: "Stand-up Diário",
    description: "Sincronização da equipe de desenvolvimento",
    date: new Date(2026, 2, 13, 9, 30),
    startTime: "09:30",
    endTime: "10:00",
    location: "Online - Google Meet",
    color: "#06b6d4",
    attendees: ["1", "3", "5"],
    createdBy: "1",
  },
  {
    id: "6",
    title: "Revisão de Sprint",
    description: "Retrospectiva e planejamento da próxima sprint",
    date: new Date(2026, 2, 20, 16, 0),
    startTime: "16:00",
    endTime: "17:30",
    location: "Sala de Reuniões B",
    color: "#ec4899",
    attendees: ["1", "2", "3", "5"],
    createdBy: "2",
  },
  {
    id: "7",
    title: "Treinamento Onboarding",
    description: "Treinamento para novos colaboradores",
    date: new Date(2026, 2, 14, 13, 0),
    startTime: "13:00",
    endTime: "16:00",
    location: "Sala de Treinamento",
    color: "#14b8a6",
    attendees: ["1", "4"],
    createdBy: "4",
  },
];

export interface SharedCalendar {
  id: string;
  userId: string;
  permission: "view" | "edit";
  sharedAt: Date;
}

export const mockSharedCalendars: SharedCalendar[] = [
  {
    id: "1",
    userId: "2",
    permission: "edit",
    sharedAt: new Date(2026, 1, 1),
  },
  {
    id: "2",
    userId: "3",
    permission: "edit",
    sharedAt: new Date(2026, 1, 5),
  },
  {
    id: "3",
    userId: "4",
    permission: "view",
    sharedAt: new Date(2026, 1, 10),
  },
  {
    id: "4",
    userId: "5",
    permission: "view",
    sharedAt: new Date(2026, 2, 1),
  },
];
