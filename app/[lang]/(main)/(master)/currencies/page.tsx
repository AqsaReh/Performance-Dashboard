import CurrenciesPageView from "./page-view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Currencies | Master",
};
  
export default function CurrenciesPage() {
  return <CurrenciesPageView />;
}
