import { ApiBase } from "@/config/api";

const gatewayServiceName = "ps-performance";
const apiServiceName = "api";
const baseApiUrl = `${ApiBase.gateway}/${gatewayServiceName}/${apiServiceName}`;

const buildQueryString = (params: Record<string, string | number | null | undefined>): string => {
  const queryParams = Object.entries(params)
    .filter(([_, value]) => value !== null && value !== undefined && value !== "")
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join("&");
  
  return queryParams ? `?${queryParams}` : "";
};

export const PageEndpoints = {
  products: `${baseApiUrl}/products`,
  distGroups: `${baseApiUrl}/dist-groups`,
  distributors: (distGroup?: string | null) => {
    const query = distGroup ? `?distGroup=${encodeURIComponent(distGroup)}` : "";
    return `${baseApiUrl}/distributors${query}`;
  },
  salesSummary: (
    selectMonth: string,
    distGroup?: string | null,
    distCode?: string | null,
    prdCode?: string | null,
    measureType?: string | null
  ) => {
    const query = buildQueryString({
      selectMonth,
      distGroup,
      distCode,
      prdCode,
      measureType,
    });
    return `${baseApiUrl}/sales-summary${query}`;
  },
  distributionSalesPerformance: (
    selectMonth: string,
    saleType: number,
    distGroup?: string | null,
    distCode?: string | null,
    prdCode?: string | null,
    measureType?: string | null
  ) => {
    const query = buildQueryString({
      selectMonth,
      saleType,
      distGroup,
      distCode,
      prdCode,
      measureType,
    });
    return `${baseApiUrl}/distribution-sales-performance${query}`;
  },
  distributorSalesPerformance: (
    selectMonth: string,
    saleType: number,
    distGroup?: string | null,
    distCode?: string | null,
    prdCode?: string | null,
    measureType?: string | null
  ) => {
    const query = buildQueryString({
      selectMonth,
      saleType,
      distGroup,
      distCode,
      prdCode,
      measureType,
    });
    return `${baseApiUrl}/distributor-sales-performance${query}`;
  },
  bookerSalesPerformance: (
    selectMonth: string,
    saleType: number,
    distGroup?: string | null,
    distCode?: string | null,
    prdCode?: string | null,
    measureType?: string | null
  ) => {
    const query = buildQueryString({
      selectMonth,
      saleType,
      distGroup,
      distCode,
      prdCode,
      measureType,
    });
    return `${baseApiUrl}/booker-sales-performance${query}`;
  },
};
