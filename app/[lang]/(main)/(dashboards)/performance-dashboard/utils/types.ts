

export interface Product {
  Prd_Code: string;
  Prd_Desc: string;
}

export interface DistGroup {
  Dist_Group: string;
}

export interface DistMaster {
  Dist_Code: string;
  Dist_Desc: string;
}

export interface SalesSummary {
  reporting_date: string;
  current_day_sales: number;
  last_day_sales: number;
  growth_current_day: number;
  current_day_target: number;
  current_month_sale: number;
  last_month_sale: number;
  growth_current_month: number;
  sply_month_sale: number;
  growth_sply_month_sale: number;
  current_month_target: number;
  current_year_sale: number;
  last_year_sale: number;
  growth_current_year: number;
  current_year_target: number;
  current_month_sale_values: number[];
  last_month_sale_values: number[];
  total_chemists: number;
  ucc: number;
  repeat_orders: number;
  existence: number;
}

export interface SalesPerformance {
  dist_group?: string;
  dist_code?: string;
  dist_desc?: string;
  supplier_id?: string;
  supplier_name?: string;

  // Common fields
  current_month_sale: number;
  ucc: number;
  repeat_orders: number;
}



export type DataShowing = "self" | "team";
export type DataType = "ach" | "growth";

export interface PerformanceColumn {
  id: number;
  name: string; // Generic: Brand name (Self) OR Employee name (Team)
  sales: number;
  qty: number;
  achievementPercent: number;
  growthPercent: number;
  monthlyAch: number[]; // 12 monthly achievement values
}

export interface PerformanceGroup {
  dataShowing: DataShowing;
  dataType: DataType;
  columns: PerformanceColumn[];
}
