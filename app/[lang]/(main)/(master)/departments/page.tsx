import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Departments | Master",
};
  
import MasterDepartmentsPageView from "./page-view";
export default function DepartmentsPage() {
  return (
    <div>
      <MasterDepartmentsPageView />
    </div>
  );
}