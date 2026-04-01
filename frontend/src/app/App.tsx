import { RouterProvider, createBrowserRouter } from 'react-router';
import { Toaster } from "./components/ui/sonner";
import { Layout } from "./components/Layout";
import { Login } from "./components/Login";
import { RedirectToAssistidos } from "./components/RedirectToAssistidos";
import { AssistidosWrapper } from "./components/wrappers/AssistidosWrapper";
import { AssistidoFormWrapper } from "./components/wrappers/AssistidoFormWrapper";
import { ProfissionaisWrapper } from "./components/wrappers/ProfissionaisWrapper";
import { ProfessionalFormWrapper } from "./components/wrappers/ProfessionalFormWrapper";
import { VeiculosWrapper } from "./components/wrappers/VeiculosWrapper";
import { VehicleFormWrapper } from "./components/wrappers/VehicleFormWrapper";
import { DriversWrapper } from "./components/wrappers/DriversWrapper";
import { DriverFormWrapper } from "./components/wrappers/DriverFormWrapper";
import { AgendaWrapper } from "./components/wrappers/AgendaWrapper";
import { AppointmentFormWrapper } from "./components/wrappers/AppointmentFormWrapper";
import { TransporteWrapper } from "./components/wrappers/TransporteWrapper";
import { TransportManagerWrapper } from "./components/wrappers/TransportManagerWrapper";
import { DriverRoutesWrapper } from "./components/wrappers/DriverRoutesWrapper";
import { LanchesWrapper } from "./components/wrappers/LanchesWrapper";
import { RelatorioWrapper } from "./components/wrappers/RelatorioWrapper";
import { ProfessionalScheduleWrapper } from "./components/wrappers/ProfessionalScheduleWrapper";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        Component: Login,
      },
      {
        path: "login",
        Component: Login,
      },
      {
        path: "assistidos",
        Component: AssistidosWrapper,
      },
      { path: "assistidos/novo", Component: AssistidoFormWrapper },
      { path: "assistidos/editar/:id", Component: AssistidoFormWrapper },
      { path: "profissionais", Component: ProfissionaisWrapper },
      {
        path: "profissionais/novo",
        Component: ProfessionalFormWrapper,
      },
      {
        path: "profissionais/editar/:id",
        Component: ProfessionalFormWrapper,
      },
      { path: "veiculos", Component: VeiculosWrapper },
      { path: "veiculos/novo", Component: VehicleFormWrapper },
      { path: "veiculos/editar/:id", Component: VehicleFormWrapper },
      { path: "motoristas", Component: DriversWrapper },
      { path: "motoristas/novo", Component: DriverFormWrapper },
      { path: "motoristas/editar/:id", Component: DriverFormWrapper },
      { path: "agenda", Component: AgendaWrapper },
      { path: "agenda/novo", Component: AppointmentFormWrapper },
      { path: "agenda/editar/:id", Component: AppointmentFormWrapper },
      { path: "minha-agenda", Component: ProfessionalScheduleWrapper },
      { path: "transporte", Component: TransporteWrapper },
      { path: "gestao-translado", Component: TransportManagerWrapper },
      { path: "rotas", Component: DriverRoutesWrapper },
      { path: "lanches", Component: LanchesWrapper },
      {
        path: "relatorio-semanal",
        Component: RelatorioWrapper,
      },
      {
        path: "*",
        Component: RedirectToAssistidos,
      },
    ],
  },
]);

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}