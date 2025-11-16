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

interface PSPerformanceDashboardProps {
  trans: {
    [key: string]: string;
  };
}

const PSPerformanceDashboard = ({
  trans,
}: PSPerformanceDashboardProps) => {
  const [timeSpan, setTimeSpan] = React.useState("Month");
  const [metric, setMetric] = React.useState<"ACH" | "Growth">("Growth");
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

  return (
    <div className="space-y-6">
      <div className="flex items-center flex-wrap justify-between gap-4">
        <div className="text-2xl font-medium text-default-800 ">
          PS Performance Dashboard
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

        {/* 3rd Row */}
        {/* 
        <div className="col-span-12 2xl:col-span-5">
          {loading ? (
            <BrandPerformanceTableSkeleton />
          ) : (
            <BrandPerformanceTable title="Brand Performance" />
          )}
        </div>

        <div className="col-span-12 2xl:col-span-7">
          {loading ? (
            <BrandPerformanceChartSkeleton
              metric={metric}
              onMetricChange={setMetric}
            />
          ) : (
            <BrandPerformanceChart
              title="Brand Performance"
              metric={metric}
              onMetricChange={setMetric}
            />
          )}
        </div> */}

        {/* 3rd row */}

        <div className="col-span-12 2xl:col-span-12">
          <BrandPerformance
            title="Brand Performance"
            metric={metric}
            onMetricChange={setMetric}
          />
        </div>

        {/* 4th Row */}

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

export default PSPerformanceDashboard;
