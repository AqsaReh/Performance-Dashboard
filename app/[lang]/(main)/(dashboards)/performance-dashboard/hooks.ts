import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getProductList,
  getDistGroupList,
  getDistributorList,
  getSalesSummary,
  getDistributionSalesPerformance,
  getDistributorSalesPerformance,
  getBookerSalesPerformance,
} from "./api";
import {
  Product,
  DistGroup,
  DistMaster,
  SalesSummary,
  SalesPerformance,
} from "./utils/types";

export const useProductList = () => {
  return useQuery<Product[]>({
    queryKey: ["product-list"],
    queryFn: getProductList,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    placeholderData: [], // Provide a placeholder to avoid undefined values
  });
};

export const useDistGroupList = () => {
  return useQuery<DistGroup[]>({
    queryKey: ["dist-group-list"],
    queryFn: getDistGroupList,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    placeholderData: [], // Provide a placeholder to avoid undefined values
  });
};

export const useDistributorList = (distGroup?: string | null) => {
  return useQuery<DistMaster[]>({
    queryKey: ["distributor-list", distGroup],
    queryFn: () => getDistributorList(distGroup),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    placeholderData: [], // Provide a placeholder to avoid undefined values
  });
};

export const useSalesSummary = (
  selectMonth: string,
  distGroup?: string | null,
  distCode?: string | null,
  prdCode?: string | null,
  measureType?: string | null,
) => {
  return useQuery<SalesSummary>({
    queryKey: ["sales-summary", selectMonth, distGroup, distCode, prdCode, measureType],
    queryFn: () => getSalesSummary(selectMonth, distGroup, distCode, prdCode, measureType),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    placeholderData: {
      reporting_date: "",
      current_day_sales: 0,
      last_day_sales: 0,
      growth_current_day: 0,
      current_day_target: 0,
      current_month_sale: 0,
      last_month_sale: 0,
      growth_current_month: 0,
      sply_month_sale: 0,
      growth_sply_month_sale: 0,
      current_month_target: 0,
      current_year_sale: 0,
      last_year_sale: 0,
      growth_current_year: 0,
      current_year_target: 0,
      current_month_sale_values: [],
      last_month_sale_values: [],
      total_chemists: 0,
      ucc: 0,
      repeat_orders: 0,
      existence: 0,
    }, // Provide a placeholder to avoid undefined values
  });
}

export const useDistributionSalesPerformance = (
  selectMonth: string,
  saleType: number,
  distGroup?: string | null,
  distCode?: string | null,
  prdCode?: string | null,
  measureType?: string | null,
) => {
  return useQuery<SalesPerformance[]>({
    queryKey: ["distribution-sales-performance", selectMonth, saleType, distGroup, distCode, prdCode, measureType],
    queryFn: () => getDistributionSalesPerformance(selectMonth, saleType, distGroup, distCode, prdCode, measureType),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    placeholderData: [], // Provide a placeholder to avoid undefined values
  });
}

export const useDistributorSalesPerformance = (
  selectMonth: string,
  saleType: number,
  distGroup?: string | null,
  distCode?: string | null,
  prdCode?: string | null,
  measureType?: string | null,
) => {
  return useQuery<SalesPerformance[]>({
    queryKey: ["distributor-sales-performance", selectMonth, saleType, distGroup, distCode, prdCode, measureType],
    queryFn: () => getDistributorSalesPerformance(selectMonth, saleType, distGroup, distCode, prdCode, measureType),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    placeholderData: [], // Provide a placeholder to avoid undefined values
  });
}

export const useBookerSalesPerformance = (
  selectMonth: string,
  saleType: number,
  distGroup?: string | null,
  distCode?: string | null,
  prdCode?: string | null,
  measureType?: string | null,
) => {
  return useQuery<SalesPerformance[]>({
    queryKey: ["booker-sales-performance", selectMonth, saleType, distGroup, distCode, prdCode, measureType],
    queryFn: () => getBookerSalesPerformance(selectMonth, saleType, distGroup, distCode, prdCode, measureType),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    placeholderData: [], // Provide a placeholder to avoid undefined values
  });
}

