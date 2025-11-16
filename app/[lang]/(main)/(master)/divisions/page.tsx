import DivisionsPageView from "./page-view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Divisions | Master",
};
  
export default function DivisionsPage() {
  return <DivisionsPageView />;
}
