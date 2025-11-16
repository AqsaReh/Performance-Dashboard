"use client"; 
import React, { useEffect, useState } from "react"; 
import PSPerformanceDashboard from "./components/ps-performance-dashboard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MgrPerformanceDashboard from "./components/mgr-performance-dashboard";

interface PSPerformanceDashboardPageViewProps {
  trans: {
    [key: string]: string;
  };
}

const PSPerformanceDashboardPageView = ({

  trans,
}: PSPerformanceDashboardPageViewProps) => {
 
const [showDasshboardType, setShowDashboardType] = useState<string>('ps');
const onChangeDashboardType = (val: string) => {
  setShowDashboardType (val);
}
  return (
  <>
  <div className=" space-y-4 mb-4 w-48">
     <Select onValueChange={onChangeDashboardType} defaultValue="ps">
      <SelectTrigger>
        <SelectValue placeholder="Select a subject" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ps">PS Dashboard</SelectItem>
        <SelectItem value="mgr">Manager Dashboard</SelectItem>
        
      </SelectContent>
    </Select>

  </div>
    {showDasshboardType === 'ps' ? <PSPerformanceDashboard trans={trans}/> : <MgrPerformanceDashboard trans={trans}/>} 
  </>
  );
};

export default PSPerformanceDashboardPageView;
