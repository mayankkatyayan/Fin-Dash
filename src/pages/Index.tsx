import { FinanceProvider } from "@/context/FinanceContext";
import DashboardPage from "@/pages/DashboardPage";

const Index = () => (
  <FinanceProvider>
    <DashboardPage />
  </FinanceProvider>
);

export default Index;
