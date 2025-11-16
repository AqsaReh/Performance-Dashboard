import { getDictionary } from "@/app/dictionaries";
import PSPerformanceDashboardPageView from "./page-view";

interface DashboardProps {
  params: {
    lang: any;
  };
}
const Dashboard = async ({ params: { lang } }: DashboardProps) => {
  const trans = await getDictionary(lang);
  return <PSPerformanceDashboardPageView trans={trans} />;
};

export default Dashboard;