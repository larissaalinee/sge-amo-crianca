import { useParams, useNavigate } from "react-router";
import { ProfessionalTabs } from "../professional/ProfessionalTabs";

const VALID_TABS = ["agenda", "profissionais"];

export function ProfessionalTabsWrapper() {
  const { tab } = useParams<{ tab: string }>();
  const navigate = useNavigate();

  const activeTab = VALID_TABS.includes(tab || "") ? tab! : "agenda";

  const handleTabChange = (newTab: string) => {
    navigate(`/agenda-profissionais/${newTab}`);
  };

  return <ProfessionalTabs activeTab={activeTab} onTabChange={handleTabChange} />;
}
