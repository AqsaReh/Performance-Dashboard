import http from "@/config/http";
import { PageEndpoints } from "./utils/endpoints";
import {
  Product,
  DistGroup,
  DistMaster,
  SalesSummary,
  SalesPerformance,
} from "./utils/types";

export const getProductList = async (): Promise<Product[]> => {
  return await http.get<Product[]>(PageEndpoints.products);
};
export const getDistGroupList = async (): Promise<DistGroup[]> => {
  return await http.get<DistGroup[]>(PageEndpoints.distGroups);
};
export const getDistributorList = async (
  distGroup?: string | null
): Promise<DistMaster[]> => {
  return await http.get<DistMaster[]>(PageEndpoints.distributors(distGroup));
};

export const getSalesSummary = async (
  selectMonth: string,
  distGroup?: string | null,
  distCode?: string | null,
  prdCode?: string | null,
  measureType?: string | null
): Promise<SalesSummary> => {
  const response = await http.get<{ data: SalesSummary }>(
    PageEndpoints.salesSummary(
      selectMonth,
      distGroup,
      distCode,
      prdCode,
      measureType
    )
  );
  return response.data;
};

export const getDistributionSalesPerformance = async (
  selectMonth: string,
  saleType: number,
  distGroup?: string | null,
  distCode?: string | null,
  prdCode?: string | null,
  measureType?: string | null
): Promise<SalesPerformance[]> => {
  const response = await http.get<{ data: SalesPerformance[] }>(
    PageEndpoints.distributionSalesPerformance(
      selectMonth,
      saleType,
      distGroup,
      distCode,
      prdCode,
      measureType
    )
  );
  return response.data;
};

export const getDistributorSalesPerformance = async (
  selectMonth: string,
  saleType: number,
  distGroup?: string | null,
  distCode?: string | null,
  prdCode?: string | null,
  measureType?: string | null
): Promise<SalesPerformance[]> => {
  const response = await http.get<{ data: SalesPerformance[] }>(
    PageEndpoints.distributorSalesPerformance(
      selectMonth,
      saleType,
      distGroup,
      distCode,
      prdCode,
      measureType
    )
  );
  return response.data;
};

export const getBookerSalesPerformance = async (
  selectMonth: string,
  saleType: number,
  distGroup?: string | null,
  distCode?: string | null,
  prdCode?: string | null,
  measureType?: string | null
): Promise<SalesPerformance[]> => {
  const response = await http.get<{ data: SalesPerformance[] }>(
    PageEndpoints.bookerSalesPerformance(
      selectMonth,
      saleType,
      distGroup,
      distCode,
      prdCode,
      measureType
    )
  );
  return response.data;
};
