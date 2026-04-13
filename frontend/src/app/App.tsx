import { RouterProvider, createBrowserRouter, Navigate } from 'react-router';
import { Toaster } from "./components/ui/sonner";
import { Layout } from "./components/Layout";
import { Login } from "./components/Login";
import { RedirectToAssistidos } from "./components/RedirectToAssistidos";
import { AssistidosWrapper } from "./components/wrappers/AssistidosWrapper";
import { AssistidoFormWrapper } from "./components/wrappers/AssistidoFormWrapper";
import { ProfessionalFormWrapper } from "./components/wrappers/ProfessionalFormWrapper";
import { VehicleFormWrapper } from "./components/wrappers/VehicleFormWrapper";
import { DriverFormWrapper } from "./components/wrappers/DriverFormWrapper";
import { AgendaWrapper } from "./components/wrappers/AgendaWrapper";
import { AppointmentFormWrapper } from "./components/wrappers/AppointmentFormWrapper";
import { TransporteWrapper } from "./components/wrappers/TransporteWrapper";
import { TransportManagerWrapper } from "./components/wrappers/TransportManagerWrapper";
import { TransportTabsWrapper } from "./components/wrappers/TransportTabsWrapper";
import { LanchesWrapper } from "./components/wrappers/LanchesWrapper";
import { RelatorioWrapper } from "./components/wrappers/RelatorioWrapper";
import { ProfessionalTabsWrapper } from "./components/wrappers/ProfessionalTabsWrapper";

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
      { path: "profissionais", element: <Navigate to="/agenda-profissionais/profissionais" replace /> },
      {
        path: "profissionais/novo",
        Component: ProfessionalFormWrapper,
      },
      {
        path: "profissionais/editar/:id",
        Component: ProfessionalFormWrapper,
      },
      { path: "veiculos", element: <Navigate to="/gestao-transporte/veiculos" replace /> },
      { path: "veiculos/novo", Component: VehicleFormWrapper },
      { path: "veiculos/editar/:id", Component: VehicleFormWrapper },
      { path: "motoristas", element: <Navigate to="/gestao-transporte/motoristas" replace /> },
      { path: "motoristas/novo", Component: DriverFormWrapper },
      { path: "motoristas/editar/:id", Component: DriverFormWrapper },
      { path: "agenda", Component: AgendaWrapper },
      { path: "agenda/novo", Component: AppointmentFormWrapper },
      { path: "agenda/editar/:id", Component: AppointmentFormWrapper },
      { path: "agenda-profissionais", element: <Navigate to="/agenda-profissionais/agenda" replace /> },
      { path: "agenda-profissionais/:tab", Component: ProfessionalTabsWrapper },
      { path: "minha-agenda", element: <Navigate to="/agenda-profissionais/agenda" replace /> },
      { path: "transporte", Component: TransporteWrapper },
      { path: "gestao-translado", Component: TransportManagerWrapper },
      { path: "rotas", element: <Navigate to="/gestao-transporte/rotas" replace /> },
      { path: "gestao-transporte", element: <Navigate to="/gestao-transporte/rotas" replace /> },
      { path: "gestao-transporte/:tab", Component: TransportTabsWrapper },
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