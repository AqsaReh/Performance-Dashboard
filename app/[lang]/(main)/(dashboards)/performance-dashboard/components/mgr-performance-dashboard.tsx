"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import MonthPicker from "../components/month-picker";
import { ProfileCard } from "../components/profile-card";
import { MetricsCard } from "../components/metrics-card";
import SFAPerformance from "../components/sfa-performance";
import { BrandPerformanceTable } from "../components/brand-performance-table";
import BrandPerformanceChart from "../components/brand-performance-chart";
import SaleVsTarget from "../components/sale-vs-target-chart";
import SalesGrowth from "../components/sales-growth";
import ExpenseChart from "../components/expense";
import IncentiveChart from "../components/incentive";
import { Filter } from "lucide-react";
import Filters from "../components/filters";
import { ProfileCardSkeleton } from "../components/skeleton/profile-card-skeleton";
import { MetricsCardSkeleton } from "../components/skeleton/metrics-card-skeleton";
import SFAPerformanceSkeleton from "../components/skeleton/sfa-performance-skeleton";
import { BrandPerformanceTableSkeleton } from "../components/skeleton/brand-performance-table-skeleton";
import BrandPerformanceChartSkeleton from "../components/skeleton/brand-performance-chart-skeleton";
import SaleVsTargetSkeleton from "../components/skeleton/sale-vs-target-chart-skeleton";
import ExpenseChartSkeleton from "../components/skeleton/expense-chart-skeleton";
import { Button } from "@/components/ui/button";
import BrandPerformance from "../components/brand-performance";
// import GeographicalPerformance from "../../manager-performance-dashboard/components/geographical-performance";
import Performance from "../components/performance";
import { PerformanceGroup } from "../utils/types";

interface MgrPerformanceDashboardProps {
  trans: {
    [key: string]: string;
  };
}

const mockApiData: PerformanceGroup[] = [
  {
    dataShowing: "self",
    dataType: "ach",
    columns: [
      {
        id: 1,
        name: "Combivair",
        sales: 10123,
        qty: 1200,
        achievementPercent: 123,
        growthPercent: 25,
        monthlyAch: [68, 72, 114, 80, 85, 116, 94, 50, 105, 110, 62, 78],
      },
      {
        id: 2,
        name: "Prospan",
        sales: 8123,
        qty: 980,
        achievementPercent: 97,
        growthPercent: 18,
        monthlyAch: [78, 40, 82, 90, 25, 88, 96, 32, 100, 103, 80, 15],
      },
      {
        id: 3,
        name: "Cyrocin",
        sales: 8123,
        qty: 980,
        achievementPercent: 97,
        growthPercent: 18,
        monthlyAch: [113, 101, 115, 65, 61, 72, 64, 112, 114, 104, 82, 103],
      },
    ],
  },
  {
    dataShowing: "self",
    dataType: "growth",
    columns: [
      {
        id: 1,
        name: "Combivair",
        sales: 10123,
        qty: 1200,
        achievementPercent: 123,
        growthPercent: 25,
        monthlyAch: [68, 72, 114, 80, 85, 116, 94, 100, 105, 110, 62, 48],
      },
      {
        id: 2,
        name: "Prospan",
        sales: 8123,
        qty: 980,
        achievementPercent: 97,
        growthPercent: 18,
        monthlyAch: [78, 40, 82, 90, 85, 88, 96, 92, 100, 63, 110, 15],
      },
    ],
  },
  {
    dataShowing: "team",
    dataType: "ach",
    columns: [
      {
        id: 101,
        name: "Ali Khan",
        sales: 9800,
        qty: 410,
        achievementPercent: 95,
        growthPercent: 8,
        monthlyAch: [72, 74, 75, 78, 82, 88, 90, 92, 95, 98, 100, 102],
      },
      {
        id: 102,
        name: "Sara Ahmed",
        sales: 11200,
        qty: 480,
        achievementPercent: 115,
        growthPercent: 22,
        monthlyAch: [88, 90, 92, 95, 100, 105, 108, 110, 115, 120, 118, 125],
      },
    ],
  },
  {
    dataShowing: "team",
    dataType: "growth",
    columns: [
      {
        id: 101,
        name: "Ali Khan",
        sales: 9800,
        qty: 410,
        achievementPercent: 95,
        growthPercent: 8,
        monthlyAch: [72, 74, 75, 78, 82, 88, 70, 92, 95, 98, 100, 102],
      },
      {
        id: 102,
        name: "Sara Ahmed",
        sales: 11200,
        qty: 480,
        achievementPercent: 115,
        growthPercent: 22,
        monthlyAch: [88, 90, 92, 95, 100, 105, 108, 110, 115, 120, 118, 125],
      },
    ],
  },
];

const MgrPerformanceDashboard = ({
  trans,
}: MgrPerformanceDashboardProps) => {
  const [timeSpan, setTimeSpan] = React.useState("Month");
  const [metric, setMetric] = React.useState<"ach" | "growth">("growth");
  const [employee, setEmployee] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [month, setMonth] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const defaultPerformanceData = mockApiData.filter(
    (item) => item.dataShowing === "self" && item.dataType === metric
  );

  const [performanceData, setPerformanceData] = useState<PerformanceGroup[]>(
    defaultPerformanceData
  );

  const onChangeDataShowing = (dataShowing: string) => {
    const newData = mockApiData.filter(
      (item) => item.dataShowing === dataShowing && item.dataType === metric
    );
    setPerformanceData(newData);
  };
  const onChangeDataType = (dataType: string) => {
    const newData = mockApiData.filter(
      (item) => item.dataType === dataType && item.dataType === metric
    );
    setPerformanceData(newData);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center flex-wrap justify-between gap-4">
        <div className="text-2xl font-medium text-default-800 ">
          Manager Performance Dashboard
        </div>
        <div className="flex gap-4">
          <Filters
            employee={employee}
            setEmployee={setEmployee}
            duration={duration}
            setDuration={setDuration}
            month={month}
            setMonth={setMonth}
          />
          {/* <MonthPicker /> */}

          {month && <Button>{new Date(month).toLocaleDateString()}</Button>}

          {duration && <Button>{duration}</Button>}
        </div>
      </div>

      {/*  First Row */}

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 2xl:col-span-3">
          {loading ? (
            <ProfileCardSkeleton />
          ) : (
            <ProfileCard
              name={employee || "Employee"}
              role="Senior Product Executive"
              team="Team 3 - Bannu - 01"
              startDate="January 01, 2024"
              endDate="March 01, 2024"
              badge={2}
            />
          )}
        </div>

        <div className="col-span-12 2xl:col-span-4">
          {loading ? (
            <MetricsCardSkeleton />
          ) : (
            <MetricsCard
              title="Sales Performance"
              value="10,123"
              achievement={50}
              achievementGoal={100}
              goal={120}
              goalPercentage={50}
              trend="up"
            />
          )}
        </div>

        <div className="col-span-12 2xl:col-span-5">
          {loading ? (
            <SFAPerformanceSkeleton />
          ) : (
            <SFAPerformance
              title="SFA Performance"
              callRate={2.5}
              callFrequency={3.1}
              planAdherence={78}
              planCoverage={82}
              // kpiData={{
              //   callRate: 2.5,
              //   callFrequency: 3.1,
              //   planAdherence: 78,
              //   planCoverage: 82,
              // }}
              // trendData={{
              //   months: ["May", "June", "Jul", "Aug", "Sept", "Oct"],
              //   callRate: [85, 80, 75, 70, 78, 82],
              //   callFrequency: [80, 70, 95, 75, 65, 80],
              //   planAdherence: [60, 75, 70, 85, 80, 90],
              //   planCoverage: [70, 78, 82, 88, 85, 92],
              // }}
              trend="up"
            />
          )}
        </div>
        {/* Second Row */}

        <div className="col-span-12 2xl:col-span-6">
          {loading ? (
            <SaleVsTargetSkeleton />
          ) : (
            <SaleVsTarget
              title="Sale vs Target"
              sales={[
                1292, 4432, 5423, 6653, 8133, 7132, 7332, 6553, 1292, 6553,
                6553, 6553,
              ]}
              targets={[
                2400, 5400, 6200, 6900, 9600, 7500, 8700, 7300, 2400, 7300,
                7300, 7300,
              ]}
            />
          )}
        </div>

        <div className="col-span-12 2xl:col-span-6">
          {loading ? (
            <SaleVsTargetSkeleton />
          ) : (
            <SalesGrowth title="Sales Growth" />
          )}
        </div>

        {/* 3rd row */}
        <div className="col-span-12 2xl:col-span-12">
          <Performance
            title="Brand Performance"
            metric={metric}
            onMetricChange={setMetric}
            data={performanceData || []}
            onChangeDataShowing={onChangeDataShowing}
            onChangeDataType ={onChangeDataType}
          />
        </div>
        {/* <div className="col-span-12 2xl:col-span-12">
          <BrandPerformance
            title="Brand Performance"
            metric={metric}
            onMetricChange={setMetric}
          />
        </div> */}

        {/* 4th Row */}

        {/* <div className="col-span-12 2xl:col-span-12">
          <GeographicalPerformance
            title="Geographical Performance"
            metric={metric}
            onMetricChange={setMetric}
          />
        </div> */}

        {/* 5th Row */}

        <div className="col-span-12 2xl:col-span-6">
          {loading ? (
            <ExpenseChartSkeleton />
          ) : (
            <ExpenseChart title="Expenses — Last 6 Months" />
          )}
        </div>

        <div className="col-span-12 2xl:col-span-6">
          {loading ? (
            <ExpenseChartSkeleton />
          ) : (
            <IncentiveChart title="Incentive — Last 6 Months" />
          )}
        </div>
      </div>
    </div>
  );
};

export default MgrPerformanceDashboard;
