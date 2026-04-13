import { useParams, useNavigate } from "react-router";
import { TransportTabs } from "../transport/TransportTabs";

const VALID_TABS = ["rotas", "motoristas", "veiculos"];

export function TransportTabsWrapper() {
  const { tab } = useParams<{ tab: string }>();
  const navigate = useNavigate();

  const activeTab = VALID_TABS.includes(tab || "") ? tab! : "rotas";

  const handleTabChange = (newTab: string) => {
    navigate(`/gestao-transporte/${newTab}`);
  };

  return <TransportTabs activeTab={activeTab} onTabChange={handleTabChange} />;
}
