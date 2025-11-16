import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LayoutGrid,
  BarChart3,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Toggle } from "@/components/ui/toggle";
import { motion, AnimatePresence } from "framer-motion";
import MiniAreaChart from "./mini-area-chart";

interface SFAPerformanceProps {
  title: string;
  value?: string;
  callRate: number;
  callFrequency: number;
  planAdherence: number;
  planCoverage: number;
  trend: "up" | "down";
  defaultView?: "grid" | "graph";
}

export const SFAPerformance = ({
  title,
  callRate,
  callFrequency,
  planAdherence,
  planCoverage,
  trend,
  defaultView = "grid",
}: SFAPerformanceProps) => {
  const [view, setView] = useState<"grid" | "graph">(defaultView);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "g")
        setView((v) => (v === "grid" ? "graph" : "grid"));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          {title}
          <div className="ml-auto flex items-center gap-1">
            <Toggle
              pressed={view === "grid"}
              onPressedChange={() => setView("grid")}
              aria-pressed={view === "grid"}
              aria-label="Show Grid"
              className="px-3 h-9 data-[state=off]:bg-primary/10 data-[state=off]:text-primary"
            >
              <LayoutGrid className="w-4 h-4" />
            </Toggle>
            <Toggle
              pressed={view === "graph"}
              onPressedChange={() => setView("graph")}
              aria-pressed={view === "graph"}
              aria-label="Show Graph"
              className="px-3 h-9 data-[state=off]:bg-primary/10 data-[state=off]:text-primary"
            >
              <BarChart3 className="w-4 h-4" />
            </Toggle>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <AnimatePresence mode="wait">
          {view === "graph" ? (
            <motion.div
              key="graph"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
            >
              <div className="grid grid-cols-2 gap-2 w-full">
                <div className="relative text-center bg-muted/40 rounded-lg w-full">
                  <span className="absolute top-[70%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    Call Rate
                  </span>
                  <MiniAreaChart
                    data={[
                      { value: 85, month: "May" },
                      { value: 80, month: "June" },
                      { value: 75, month: "Jul" },
                      { value: 70, month: "Aug" },
                      { value: 78, month: "Sept" },
                      { value: 82, month: "Oct" },
                    ]}
                    color="primary"
                    metricName="Call Rate"
                  />
                </div>

                <div className="relative text-center bg-muted/40 rounded-lg w-full">
                  <span className="absolute top-[70%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    Call Frequency
                  </span>
                  <MiniAreaChart
                    data={[
                      { value: 80, month: "May" },
                      { value: 70, month: "June" },
                      { value: 95, month: "Jul" },
                      { value: 75, month: "Aug" },
                      { value: 65, month: "Sept" },
                      { value: 80, month: "Oct" },
                    ]}
                    color="primary"
                    metricName="Call Frequency"
                  />
                </div>

                <div className="relative text-center bg-muted/40 rounded-lg w-full">
                  <span className="absolute top-[70%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    Plan Adherence
                  </span>
                  <MiniAreaChart
                    data={[
                      { value: 60, month: "May" },
                      { value: 75, month: "June" },
                      { value: 70, month: "Jul" },
                      { value: 85, month: "Aug" },
                      { value: 80, month: "Sept" },
                      { value: 90, month: "Oct" },
                    ]}
                    color="primary"
                    metricName="Plan Adherence"
                  />
                </div>

                <div className="relative text-center bg-muted/40 rounded-lg w-full">
                  <span className="absolute top-[70%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    Plan Coverage
                  </span>
                  <MiniAreaChart
                    data={[
                      { value: 70, month: "May" },
                      { value: 78, month: "June" },
                      { value: 82, month: "Jul" },
                      { value: 88, month: "Aug" },
                      { value: 85, month: "Sept" },
                      { value: 92, month: "Oct" },
                    ]}
                    color="primary"
                    metricName="Plan Coverage"
                  />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
            >
              <div className="grid grid-cols-2 gap-2 w-full">
                <div className="text-center bg-muted/40 rounded-lg px-2 pt-2 w-full">
                  <h3 className="font-semibold text-3xl text-foreground mb-1">
                    {callRate.toFixed(1)}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Call Rate
                  </p>
                </div>

                <div className="text-center bg-muted/40 rounded-lg px-2 pt-2 w-full">
                  <h3 className="font-semibold text-3xl text-foreground mb-1">
                    {callFrequency.toFixed(1)}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Call Frequency
                  </p>
                </div>

                <div className="text-center bg-muted/40 rounded-lg px-2 pt-2 w-full">
                  <h3 className="font-semibold text-foreground mb-1">
                    <span className="text-3xl">{planAdherence}</span> %
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Plan Adherence
                  </p>
                </div>

                <div className="text-center bg-muted/40 rounded-lg px-2 pt-2 w-full">
                  <h3 className="font-semibold text-foreground mb-1">
                    <span className="text-3xl">{planCoverage}</span> %
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Plan Coverage
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default SFAPerformance;
