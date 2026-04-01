// Tipos e interfaces
export type UserRole = "admin" | "coordenador" | "profissional" | "motorista" | "cozinha" | "apoio";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
}

export interface Assistido {
  id: string;
  name: string;
  cpf: string;
  birthDate: Date;
  address: string;
  phone: string;
  needsTransport: boolean;
  allergies: string[];
  dietaryRestrictions: string[];
  specialNeeds: string;
  familyMembers: FamilyMember[];
  status: "active" | "discharged"; // Alta do paciente
  createdAt: Date;
  createdBy: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  allergies: string[];
  dietaryRestrictions: string[];
}

export interface Professional {
  id: string;
  name: string;
  specialty: string;
  cpf: string;
  phone: string;
  email: string;
  workSchedule: WorkSchedule[];
  color: string;
  createdAt: Date;
}

export interface WorkSchedule {
  dayOfWeek: number; // 0-6 (domingo a sábado)
  startTime: string;
  endTime: string;
}

export interface Vehicle {
  id: string;
  plate: string;
  model: string;
  capacity: number;
  hasCarSeat: boolean;
  active: boolean;
  createdAt: Date;
}

// Associação de motorista com veículo por data
export interface VehicleAssignment {
  id: string;
  vehicleId: string;
  driverId: string;
  date: Date;
  createdAt: Date;
}

// Nova interface para gerenciar associações de transporte
export interface TransportAssignment {
  id: string;
  assistidoId: string;
  appointmentId: string;
  vehicleId: string;
  driverId: string;
  date: Date;
  pickupStatus: "pending" | "picked_up" | "delivered" | "cancelled" | "unable"; // unable = impossibilidade de buscar
  pickedUpAt?: Date;
  deliveredAt?: Date;
  // Novos campos para ida e volta
  outboundPickupAt?: Date; // Buscou em casa (ida)
  outboundDeliveredAt?: Date; // Entregou na AMO (ida)
  returnPickupAt?: Date; // Buscou na AMO (volta)
  returnDeliveredAt?: Date; // Entregou em casa (volta)
  cancelledReason?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface Driver {
  id: string;
  name: string;
  cpf: string;
  phone: string;
  cnh: string;
  cnhCategory: string;
  email: string;
  active: boolean;
  createdAt: Date;
}

export interface Appointment {
  id: string;
  assistidoId: string;
  professionalId: string;
  date: Date;
  startTime: string;
  endTime: string;
  type: "individual" | "group" | "event";
  isRecurring: boolean; // se repete semanalmente
  groupParticipants?: string[]; // IDs de assistidos/familiares no grupo
  notes: string;
  status: "scheduled" | "completed" | "cancelled";
  needsSnack: boolean;
  needsTransport: boolean; // se o assistido precisa de transporte para este atendimento
  hasCompanion: boolean; // se o assistido vai acompanhado (conta 2 passageiros)
  transportId?: string;
  createdAt: Date;
  createdBy: string;
  updatedBy?: string;
  updatedAt?: Date;
  cancelReason?: string; // Motivo do cancelamento
}

export interface Transport {
  id: string;
  vehicleId: string;
  driverId: string;
  date: Date;
  route: TransportStop[];
  status: "pending" | "in-progress" | "completed";
  createdAt: Date;
}

export interface TransportStop {
  id: string;
  assistidoId: string;
  address: string;
  pickupTime: string;
  type: "pickup" | "dropoff";
  appointmentId?: string;
}

// Dados mock
export const mockUsers: User[] = [
  {
    id: "1",
    name: "Admin Sistema",
    email: "admin@amo.com.br",
    role: "admin",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
  },
  {
    id: "2",
    name: "Maria Coordenadora",
    email: "maria.coord@amo.com.br",
    role: "coordenador",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=maria",
  },
  {
    id: "3",
    name: "Carlos Motorista",
    email: "carlos.motorista@amo.com.br",
    role: "motorista",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=carlos",
  },
  {
    id: "4",
    name: "Ana Cozinha",
    email: "ana.cozinha@amo.com.br",
    role: "cozinha",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ana",
  },
];

export const mockProfessionals: Professional[] = [
  {
    id: "p1",
    name: "Dr. João Silva",
    specialty: "Psicologia",
    cpf: "123.456.789-00",
    phone: "(11) 98765-4321",
    email: "joao.psicologo@amo.com.br",
    workSchedule: [
      { dayOfWeek: 1, startTime: "08:00", endTime: "12:00" },
      { dayOfWeek: 1, startTime: "14:00", endTime: "18:00" },
      { dayOfWeek: 3, startTime: "08:00", endTime: "12:00" },
      { dayOfWeek: 3, startTime: "14:00", endTime: "18:00" },
      { dayOfWeek: 5, startTime: "08:00", endTime: "12:00" },
    ],
    color: "#3b82f6",
    createdAt: new Date(2026, 0, 1),
  },
  {
    id: "p2",
    name: "Dra. Fernanda Costa",
    specialty: "Fonoaudiologia",
    cpf: "987.654.321-00",
    phone: "(11) 98765-1234",
    email: "fernanda.fono@amo.com.br",
    workSchedule: [
      { dayOfWeek: 1, startTime: "08:00", endTime: "12:00" },
      { dayOfWeek: 2, startTime: "14:00", endTime: "18:00" },
      { dayOfWeek: 4, startTime: "08:00", endTime: "12:00" },
      { dayOfWeek: 4, startTime: "14:00", endTime: "18:00" },
    ],
    color: "#10b981",
    createdAt: new Date(2026, 0, 1),
  },
  {
    id: "p3",
    name: "Prof. Roberto Alves",
    specialty: "Fisioterapia",
    cpf: "456.789.123-00",
    phone: "(11) 98765-5678",
    email: "roberto.fisio@amo.com.br",
    workSchedule: [
      { dayOfWeek: 2, startTime: "08:00", endTime: "12:00" },
      { dayOfWeek: 2, startTime: "14:00", endTime: "18:00" },
      { dayOfWeek: 4, startTime: "08:00", endTime: "12:00" },
      { dayOfWeek: 5, startTime: "14:00", endTime: "18:00" },
    ],
    color: "#f59e0b",
    createdAt: new Date(2026, 0, 1),
  },
  {
    id: "p4",
    name: "Dra. Paula Mendes",
    specialty: "Terapia Ocupacional",
    cpf: "321.654.987-00",
    phone: "(11) 98765-9999",
    email: "paula.to@amo.com.br",
    workSchedule: [
      { dayOfWeek: 1, startTime: "08:00", endTime: "12:00" },
      { dayOfWeek: 3, startTime: "08:00", endTime: "12:00" },
      { dayOfWeek: 3, startTime: "14:00", endTime: "18:00" },
      { dayOfWeek: 5, startTime: "08:00", endTime: "12:00" },
      { dayOfWeek: 5, startTime: "14:00", endTime: "18:00" },
    ],
    color: "#8b5cf6",
    createdAt: new Date(2026, 0, 1),
  },
];

export const mockAssistidos: Assistido[] = [
  {
    id: "pac1",
    name: "Lucas Oliveira",
    cpf: "111.222.333-44",
    birthDate: new Date(2018, 5, 15),
    address: "Rua Júlio de Castilhos, 245 - Centro - Novo Hamburgo/RS",
    phone: "(51) 99999-1111",
    needsTransport: true,
    allergies: ["Amendoim", "Lactose"],
    dietaryRestrictions: ["Sem lactose", "Sem glúten"],
    specialNeeds: "Cadeirinha infantil obrigatória",
    familyMembers: [
      {
        id: "fam1",
        name: "Sandra Oliveira",
        relationship: "Mãe",
        phone: "(51) 99999-1111",
        allergies: [],
        dietaryRestrictions: [],
      },
    ],
    status: "active",
    createdAt: new Date(2026, 1, 1),
    createdBy: "2",
  },
  {
    id: "pac2",
    name: "Julia Santos",
    cpf: "222.333.444-55",
    birthDate: new Date(2015, 8, 20),
    address: "Av. Victor Barreto, 1580 - Centro - Novo Hamburgo/RS",
    phone: "(51) 99999-2222",
    needsTransport: true,
    allergies: [],
    dietaryRestrictions: ["Vegetariana"],
    specialNeeds: "Cadeira de rodas - necessita de rampa de acesso",
    familyMembers: [
      {
        id: "fam2",
        name: "Roberto Santos",
        relationship: "Pai",
        phone: "(51) 99999-2222",
        allergies: [],
        dietaryRestrictions: [],
      },
    ],
    status: "active",
    createdAt: new Date(2026, 1, 5),
    createdBy: "2",
  },
  {
    id: "pac3",
    name: "Pedro Souza",
    cpf: "333.444.555-66",
    birthDate: new Date(2020, 2, 10),
    address: "Rua Gen. Osório, 890 - Hamburgo Velho - Novo Hamburgo/RS",
    phone: "(51) 99999-3333",
    needsTransport: false,
    allergies: ["Ovo"],
    dietaryRestrictions: ["Sem ovo"],
    specialNeeds: "",
    familyMembers: [
      {
        id: "fam3",
        name: "Mariana Souza",
        relationship: "Mãe",
        phone: "(51) 99999-3333",
        allergies: [],
        dietaryRestrictions: [],
      },
    ],
    status: "active",
    createdAt: new Date(2026, 1, 10),
    createdBy: "2",
  },
  {
    id: "pac4",
    name: "Ana Clara Lima",
    cpf: "444.555.666-77",
    birthDate: new Date(2017, 11, 5),
    address: "Rua Pedro Adams Filho, 456 - Rio Branco - Novo Hamburgo/RS",
    phone: "(51) 99999-4444",
    needsTransport: true,
    allergies: [],
    dietaryRestrictions: [],
    specialNeeds: "",
    familyMembers: [],
    status: "active",
    createdAt: new Date(2026, 1, 15),
    createdBy: "2",
  },
  {
    id: "pac5",
    name: "Gabriel Ferreira",
    cpf: "555.666.777-88",
    birthDate: new Date(2019, 3, 22),
    address: "Rua Leopoldo Rassier, 320 - Pátria Nova - Novo Hamburgo/RS",
    phone: "(51) 99999-5555",
    needsTransport: true,
    allergies: [],
    dietaryRestrictions: [],
    specialNeeds: "Recebeu alta médica em março/2026",
    familyMembers: [
      {
        id: "fam5",
        name: "Camila Ferreira",
        relationship: "Mãe",
        phone: "(51) 99999-5555",
        allergies: [],
        dietaryRestrictions: [],
      },
    ],
    status: "discharged",
    createdAt: new Date(2025, 6, 10),
    createdBy: "2",
  },
  {
    id: "pac6",
    name: "Mariana Costa",
    cpf: "666.777.888-99",
    birthDate: new Date(2016, 7, 18),
    address: "Av. Nações Unidas, 1250 - Santo Afonso - Novo Hamburgo/RS",
    phone: "(51) 99999-6666",
    needsTransport: true,
    allergies: [],
    dietaryRestrictions: [],
    specialNeeds: "Precisa de assento elevado",
    familyMembers: [
      {
        id: "fam6",
        name: "Patrícia Costa",
        relationship: "Mãe",
        phone: "(51) 99999-6666",
        allergies: [],
        dietaryRestrictions: [],
      },
    ],
    status: "active",
    createdAt: new Date(2026, 1, 20),
    createdBy: "2",
  },
  {
    id: "pac7",
    name: "Felipe Martins",
    cpf: "777.888.999-00",
    birthDate: new Date(2019, 9, 25),
    address: "Rua First, 780 - Ideal - Novo Hamburgo/RS",
    phone: "(51) 99999-7777",
    needsTransport: true,
    allergies: [],
    dietaryRestrictions: [],
    specialNeeds: "Acompanhado pela avó - mãe trabalha",
    familyMembers: [
      {
        id: "fam7",
        name: "Maria Martins",
        relationship: "Avó",
        phone: "(51) 99999-7777",
        allergies: [],
        dietaryRestrictions: [],
      },
    ],
    status: "active",
    createdAt: new Date(2026, 2, 1),
    createdBy: "2",
  },
];

export const mockVehicles: Vehicle[] = [
  {
    id: "v1",
    plate: "ABC-1234",
    model: "Fiat Ducato 2022",
    capacity: 8,
    hasCarSeat: true,
    active: true,
    createdAt: new Date(2026, 0, 1),
  },
  {
    id: "v2",
    plate: "XYZ-5678",
    model: "Mercedes Sprinter 2021",
    capacity: 12,
    hasCarSeat: true,
    active: true,
    createdAt: new Date(2026, 0, 1),
  },
  {
    id: "v3",
    plate: "DEF-9012",
    model: "Volkswagen Kombi 2020",
    capacity: 6,
    hasCarSeat: false,
    active: false,
    createdAt: new Date(2025, 11, 1),
  },
  {
    id: "v4",
    plate: "GHI-3456",
    model: "Renault Master 2023",
    capacity: 10,
    hasCarSeat: true,
    active: true,
    createdAt: new Date(2026, 0, 15),
  },
];

export const mockVehicleAssignments: VehicleAssignment[] = [
  {
    id: "va1",
    vehicleId: "v1",
    driverId: "d1",
    date: new Date(2026, 2, 17), // Segunda-feira
    createdAt: new Date(2026, 2, 1),
  },
  {
    id: "va2",
    vehicleId: "v2",
    driverId: "d2",
    date: new Date(2026, 2, 17), // Segunda-feira
    createdAt: new Date(2026, 2, 1),
  },
  {
    id: "va3",
    vehicleId: "v1",
    driverId: "d1",
    date: new Date(2026, 2, 18), // Terça-feira
    createdAt: new Date(2026, 2, 1),
  },
  {
    id: "va4",
    vehicleId: "v4",
    driverId: "d2",
    date: new Date(2026, 2, 18), // Terça-feira
    createdAt: new Date(2026, 2, 1),
  },
  {
    id: "va5",
    vehicleId: "v2",
    driverId: "d2",
    date: new Date(2026, 2, 19), // Quarta-feira
    createdAt: new Date(2026, 2, 1),
  },
  {
    id: "va6",
    vehicleId: "v4",
    driverId: "d1",
    date: new Date(2026, 2, 19), // Quarta-feira
    createdAt: new Date(2026, 2, 1),
  },
];

export const mockDrivers: Driver[] = [
  {
    id: "d1",
    name: "Carlos Motorista",
    cpf: "123.456.789-00",
    phone: "(11) 98765-4321",
    cnh: "12345678901",
    cnhCategory: "B",
    email: "carlos.motorista@amo.com.br",
    active: true,
    createdAt: new Date(2026, 0, 1),
  },
  {
    id: "d2",
    name: "Mariana Silva",
    cpf: "987.654.321-00",
    phone: "(11) 98765-1234",
    cnh: "01234567890",
    cnhCategory: "D",
    email: "mariana.silva@amo.com.br",
    active: true,
    createdAt: new Date(2026, 0, 1),
  },
];

export const mockAppointments: Appointment[] = [
  {
    id: "apt1",
    assistidoId: "pac1",
    professionalId: "p1",
    date: new Date(2026, 2, 17), // Segunda-feira
    startTime: "09:00",
    endTime: "10:00",
    type: "individual",
    isRecurring: true,
    notes: "Sessão de avaliação inicial",
    status: "scheduled",
    needsSnack: true,
    needsTransport: true,
    hasCompanion: false,
    createdAt: new Date(2026, 2, 1),
    createdBy: "2",
  },
  {
    id: "apt2",
    assistidoId: "pac1",
    professionalId: "p2",
    date: new Date(2026, 2, 18), // Terça-feira
    startTime: "14:30",
    endTime: "15:30",
    type: "individual",
    isRecurring: true,
    notes: "",
    status: "scheduled",
    needsSnack: true,
    needsTransport: true,
    hasCompanion: true,
    createdAt: new Date(2026, 2, 1),
    createdBy: "2",
  },
  {
    id: "apt3",
    assistidoId: "pac2",
    professionalId: "p3",
    date: new Date(2026, 2, 18), // Terça-feira
    startTime: "09:00",
    endTime: "10:00",
    type: "individual",
    isRecurring: true,
    notes: "",
    status: "scheduled",
    needsSnack: true,
    needsTransport: true,
    hasCompanion: true,
    createdAt: new Date(2026, 2, 1),
    createdBy: "2",
  },
  {
    id: "apt4",
    assistidoId: "pac4",
    professionalId: "p4",
    date: new Date(2026, 2, 19), // Quarta-feira
    startTime: "10:00",
    endTime: "11:00",
    type: "individual",
    isRecurring: true,
    notes: "",
    status: "scheduled",
    needsSnack: true,
    needsTransport: true,
    hasCompanion: false,
    createdAt: new Date(2026, 2, 1),
    createdBy: "2",
  },
  {
    id: "apt5",
    assistidoId: "pac1",
    professionalId: "p4",
    date: new Date(2026, 2, 19), // Quarta-feira
    startTime: "14:00",
    endTime: "15:00",
    type: "individual",
    isRecurring: true,
    notes: "",
    status: "scheduled",
    needsSnack: true,
    needsTransport: true,
    hasCompanion: false,
    createdAt: new Date(2026, 2, 1),
    createdBy: "2",
  },
  {
    id: "apt6",
    assistidoId: "pac2",
    professionalId: "p1",
    date: new Date(2026, 2, 19), // Quarta-feira
    startTime: "15:30",
    endTime: "16:30",
    type: "individual",
    isRecurring: true,
    notes: "",
    status: "scheduled",
    needsSnack: true,
    needsTransport: true,
    hasCompanion: false,
    createdAt: new Date(2026, 2, 1),
    createdBy: "2",
  },
  {
    id: "apt7",
    assistidoId: "pac3",
    professionalId: "p1",
    date: new Date(2026, 2, 20), // Quinta-feira (assistido sem transporte)
    startTime: "09:00",
    endTime: "10:00",
    type: "individual",
    isRecurring: true,
    notes: "",
    status: "scheduled",
    needsSnack: true,
    needsTransport: false,
    hasCompanion: false,
    createdAt: new Date(2026, 2, 1),
    createdBy: "2",
  },
  {
    id: "apt8",
    assistidoId: "pac4",
    professionalId: "p2",
    date: new Date(2026, 2, 17), // Segunda-feira
    startTime: "14:00",
    endTime: "15:00",
    type: "individual",
    isRecurring: true,
    notes: "",
    status: "scheduled",
    needsSnack: true,
    needsTransport: true,
    hasCompanion: true,
    createdAt: new Date(2026, 2, 1),
    createdBy: "2",
  },
  {
    id: "apt9",
    assistidoId: "pac6",
    professionalId: "p1",
    date: new Date(2026, 2, 17), // Segunda-feira
    startTime: "10:30",
    endTime: "11:30",
    type: "individual",
    isRecurring: true,
    notes: "",
    status: "scheduled",
    needsSnack: true,
    needsTransport: true,
    hasCompanion: false,
    createdAt: new Date(2026, 2, 1),
    createdBy: "2",
  },
  {
    id: "apt10",
    assistidoId: "pac7",
    professionalId: "p4",
    date: new Date(2026, 2, 17), // Segunda-feira
    startTime: "15:30",
    endTime: "16:30",
    type: "individual",
    isRecurring: true,
    notes: "",
    status: "scheduled",
    needsSnack: true,
    needsTransport: true,
    hasCompanion: true,
    createdAt: new Date(2026, 2, 1),
    createdBy: "2",
  },
  {
    id: "apt11",
    assistidoId: "pac2",
    professionalId: "p2",
    date: new Date(2026, 2, 17), // Segunda-feira
    startTime: "11:00",
    endTime: "12:00",
    type: "individual",
    isRecurring: true,
    notes: "",
    status: "scheduled",
    needsSnack: true,
    needsTransport: true,
    hasCompanion: true,
    createdAt: new Date(2026, 2, 1),
    createdBy: "2",
  },
  {
    id: "apt12",
    assistidoId: "pac4",
    professionalId: "p3",
    date: new Date(2026, 2, 17), // Segunda-feira
    startTime: "09:00",
    endTime: "10:00",
    type: "individual",
    isRecurring: true,
    notes: "",
    status: "scheduled",
    needsSnack: true,
    needsTransport: true,
    hasCompanion: false,
    createdAt: new Date(2026, 2, 1),
    createdBy: "2",
  },
  // Cancelamentos e faltas
  {
    id: "apt_cancel1",
    assistidoId: "pac3",
    professionalId: "p2",
    date: new Date(2026, 2, 18), // Terça-feira
    startTime: "10:30",
    endTime: "11:30",
    type: "individual",
    isRecurring: false,
    notes: "Cancelado - criança com febre",
    status: "cancelled",
    needsSnack: true,
    needsTransport: false,
    hasCompanion: false,
    cancelReason: "Criança doente",
    createdAt: new Date(2026, 2, 1),
    createdBy: "2",
  },
  {
    id: "apt_cancel2",
    assistidoId: "pac5",
    professionalId: "p3",
    date: new Date(2026, 2, 19), // Quarta-feira
    startTime: "09:30",
    endTime: "10:30",
    type: "individual",
    isRecurring: false,
    notes: "Falta sem aviso",
    status: "cancelled",
    needsSnack: true,
    needsTransport: true,
    hasCompanion: false,
    cancelReason: "Falta sem justificativa",
    createdAt: new Date(2026, 2, 1),
    createdBy: "2",
  },
  {
    id: "apt_cancel3",
    assistidoId: "pac6",
    professionalId: "p4",
    date: new Date(2026, 2, 20), // Quinta-feira
    startTime: "14:30",
    endTime: "15:30",
    type: "individual",
    isRecurring: false,
    notes: "Cancelado pela família",
    status: "cancelled",
    needsSnack: true,
    needsTransport: true,
    hasCompanion: false,
    cancelReason: "Compromisso familiar",
    createdAt: new Date(2026, 2, 1),
    createdBy: "2",
  },
];

// Associações de transporte (assistidos já alocados em carros)
export const mockTransportAssignments: TransportAssignment[] = [
  // Segunda-feira (17/03/2026) - Veículo v1
  {
    id: "ta1",
    assistidoId: "pac1",
    appointmentId: "apt1",
    vehicleId: "v1",
    driverId: "d1",
    date: new Date(2026, 2, 17),
    pickupStatus: "pending",
    createdAt: new Date(2026, 2, 16),
  },
  {
    id: "ta2",
    assistidoId: "pac2",
    appointmentId: "apt11",
    vehicleId: "v1",
    driverId: "d1",
    date: new Date(2026, 2, 17),
    pickupStatus: "pending",
    createdAt: new Date(2026, 2, 16),
  },
  {
    id: "ta3",
    assistidoId: "pac6",
    appointmentId: "apt9",
    vehicleId: "v1",
    driverId: "d1",
    date: new Date(2026, 2, 17),
    pickupStatus: "pending",
    createdAt: new Date(2026, 2, 16),
  },
  // Segunda-feira (17/03/2026) - Veículo v2
  {
    id: "ta4",
    assistidoId: "pac4",
    appointmentId: "apt8",
    vehicleId: "v2",
    driverId: "d2",
    date: new Date(2026, 2, 17),
    pickupStatus: "pending",
    createdAt: new Date(2026, 2, 16),
  },
  {
    id: "ta5",
    assistidoId: "pac7",
    appointmentId: "apt10",
    vehicleId: "v2",
    driverId: "d2",
    date: new Date(2026, 2, 17),
    pickupStatus: "pending",
    createdAt: new Date(2026, 2, 16),
  },
  // Terça-feira (18/03/2026) - Veículo v1
  {
    id: "ta6",
    assistidoId: "pac1",
    appointmentId: "apt2",
    vehicleId: "v1",
    driverId: "d1",
    date: new Date(2026, 2, 18),
    pickupStatus: "pending",
    createdAt: new Date(2026, 2, 16),
  },
  // Terça-feira (18/03/2026) - Veículo v4
  {
    id: "ta2",
    assistidoId: "pac2",
    appointmentId: "apt3",
    vehicleId: "v4",
    driverId: "d2",
    date: new Date(2026, 2, 18),
    pickupStatus: "pending",
    createdAt: new Date(2026, 2, 16),
  },
  // Quarta-feira (19/03/2026) - Veículo v2
  {
    id: "ta7",
    assistidoId: "pac4",
    appointmentId: "apt4",
    vehicleId: "v2",
    driverId: "d2",
    date: new Date(2026, 2, 19),
    pickupStatus: "pending",
    createdAt: new Date(2026, 2, 16),
  },
  {
    id: "ta8",
    assistidoId: "pac1",
    appointmentId: "apt5",
    vehicleId: "v2",
    driverId: "d2",
    date: new Date(2026, 2, 19),
    pickupStatus: "pending",
    createdAt: new Date(2026, 2, 16),
  },
  // Quarta-feira (19/03/2026) - Veículo v4
  {
    id: "ta9",
    assistidoId: "pac2",
    appointmentId: "apt6",
    vehicleId: "v4",
    driverId: "d1",
    date: new Date(2026, 2, 19),
    pickupStatus: "pending",
    createdAt: new Date(2026, 2, 16),
  },
];

// Função auxiliar para obter nome de assistido
export function getAssistidoName(assistidoId: string): string {
  return mockAssistidos.find((p) => p.id === assistidoId)?.name || "Desconhecido";
}

// Função auxiliar para obter nome de profissional
export function getProfessionalName(professionalId: string): string {
  return mockProfessionals.find((p) => p.id === professionalId)?.name || "Desconhecido";
}

// Função auxiliar para detectar conflitos
export function detectConflicts(
  appointments: Appointment[],
  newAppointment: Partial<Appointment>
): string[] {
  const conflicts: string[] = [];

  if (!newAppointment.date || !newAppointment.startTime || !newAppointment.endTime) {
    return conflicts;
  }

  const sameDay = appointments.filter(
    (apt) =>
      apt.id !== newAppointment.id &&
      apt.date.toDateString() === new Date(newAppointment.date).toDateString() &&
      apt.status !== "cancelled"
  );

  for (const apt of sameDay) {
    // Verifica se os horários se sobrepõem
    const overlap =
      (newAppointment.startTime >= apt.startTime && newAppointment.startTime < apt.endTime) ||
      (newAppointment.endTime > apt.startTime && newAppointment.endTime <= apt.endTime) ||
      (newAppointment.startTime <= apt.startTime && newAppointment.endTime >= apt.endTime);

    if (!overlap) continue;

    // Conflito de assistido
    if (newAppointment.assistidoId === apt.assistidoId) {
      conflicts.push(
        `Assistido ${getAssistidoName(apt.assistidoId)} já tem atendimento às ${apt.startTime}`
      );
    }

    // Conflito de profissional em atendimento individual
    if (
      newAppointment.professionalId === apt.professionalId &&
      (newAppointment.type === "individual" || apt.type === "individual")
    ) {
      conflicts.push(
        `Profissional ${getProfessionalName(apt.professionalId)} já tem atendimento às ${apt.startTime}`
      );
    }
  }

  return conflicts;
}