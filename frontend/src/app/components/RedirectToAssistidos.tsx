import { Navigate } from "react-router";

export function RedirectToAssistidos() {
  return <Navigate to="/login" replace />;
}