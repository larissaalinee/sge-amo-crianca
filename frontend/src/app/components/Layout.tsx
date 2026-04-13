import { Outlet, Link, useLocation } from "react-router";
import {
  Users,
  CalendarDays,
  UtensilsCrossed,
  FileText,
  Menu,
  X,
  LogIn,
  Calendar,
  TruckIcon,
} from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "./ui/utils";
import { useState } from "react";

type NavItem = {
  type: "link";
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

export function Layout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems: NavItem[] = [
    { type: "link", path: "/login", label: "Login", icon: LogIn },
    { type: "link", path: "/assistidos", label: "Assistidos", icon: Users },
    { type: "link", path: "/agenda", label: "Agenda Semanal", icon: CalendarDays },
    {
      type: "link",
      path: "/agenda-profissionais",
      label: "Agenda Profissionais",
      icon: Calendar,
    },
    {
      type: "link",
      path: "/gestao-transporte",
      label: "Gestão de Transporte",
      icon: TruckIcon,
    },
    { type: "link", path: "/lanches", label: "Lanches", icon: UtensilsCrossed },
    {
      type: "link",
      path: "/relatorio-semanal",
      label: "Relatório Semanal",
      icon: FileText,
    },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#D32F2F] border-r border-red-800 flex flex-col transition-transform lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6 border-b border-red-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 w-full">
              {/* Alterado para o caminho da pasta public */}
              <img
                src="/logo-amo.png"
                alt="AMO Criança"
                className="w-full h-auto brightness-0 invert"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-white hover:bg-red-800 flex-shrink-0"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="size-5" />
            </Button>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-base",
                  isActive(item.path)
                    ? "bg-red-800 text-white"
                    : "text-white/90 hover:bg-red-800/50"
                )}
              >
                <Icon className="size-6" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-red-800">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="size-10 bg-white rounded-full flex items-center justify-center p-1">
              {/* Alterado para o caminho da pasta public */}
              <img
                src="/logo-amo.png"
                alt="AMO"
                className="w-full h-full object-contain brightness-0 saturate-100 invert-[27%] sepia-[89%] saturate-[4735%] hue-rotate-[347deg] brightness-[97%] contrast-[91%]"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                Agenda AMO
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-gray-200 p-4 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="size-6" />
          </Button>
          {/* Alterado para o caminho da pasta public */}
          <img src="/logo-amo.png" alt="AMO Criança" className="h-8 w-auto" />
        </div>

        <Outlet />
      </main>
    </div>
  );
}
