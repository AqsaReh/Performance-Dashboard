import CompaniesPageView from "./page-view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Companies | Master",
};
  
export default function CompaniesPage() {
  return <CompaniesPageView />;
}