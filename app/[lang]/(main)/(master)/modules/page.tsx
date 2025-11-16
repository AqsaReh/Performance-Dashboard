import ModulesPageView from "./page-view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Modules | Master",
};
  
export default function ModulesPage() {
  return <ModulesPageView />;
}
