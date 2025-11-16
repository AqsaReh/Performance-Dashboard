import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutGrid, BarChart3 } from "lucide-react";
import { useEffect, useState } from "react";
import { Toggle } from "@/components/ui/toggle";
import { motion, AnimatePresence } from "framer-motion";
import MiniAreaChart from "../mini-area-chart";
import { Skeleton } from "@/components/ui/skeleton";

export const SFAPerformanceSkeleton = () => {
  //   const [view, setView] = useState<"grid" | "graph">(defaultView);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Skeleton className="w-1/4 h-6 " />
          <div className="ml-auto flex  items-center gap-1">
            <Skeleton className="w-9 h-9 rounded" />

            <Skeleton className="w-9 h-9 rounded" />
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <AnimatePresence mode="wait">
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
          >
            <div className="grid grid-cols-2 gap-2 w-full">
              <div className="text-center bg-muted/40 rounded-lg px-2 pt-2 w-full">
                <h3 className="font-semibold text-3xl text-foreground mb-2">
                  <Skeleton className="w-1/3 h-7 mx-auto" />
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  <Skeleton className="w-1/3 h-6 mx-auto" />
                </p>
              </div>

              <div className="text-center bg-muted/40 rounded-lg px-2 pt-2 w-full">
                <h3 className="font-semibold text-3xl text-foreground mb-2">
                  <Skeleton className="w-1/3 h-7 mx-auto" />
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  <Skeleton className="w-1/3 h-6 mx-auto" />
                </p>
              </div>

              <div className="text-center bg-muted/40 rounded-lg px-2 pt-2 w-full">
                <h3 className="font-semibold text-3xl text-foreground mb-2">
                  <Skeleton className="w-1/3 h-7 mx-auto" />
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  <Skeleton className="w-1/3 h-6 mx-auto" />
                </p>
              </div>

              <div className="text-center bg-muted/40 rounded-lg px-2 pt-2 w-full">
                <h3 className="font-semibold text-3xl text-foreground mb-2">
                  <Skeleton className="w-1/3 h-7 mx-auto" />
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  <Skeleton className="w-1/3 h-6 mx-auto" />
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default SFAPerformanceSkeleton;
