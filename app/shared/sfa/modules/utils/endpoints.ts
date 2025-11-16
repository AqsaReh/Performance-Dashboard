import { ApiBase } from "@/config/api";

const gatewayServiceName = "eworkflow";
const apiServiceName = "api/sfa";
const baseApiUrl = `${ApiBase.gateway}/${gatewayServiceName}/${apiServiceName}`;

export const ModulesEndpoints = {
  modules: `${baseApiUrl}/modules`,
  modulesList: `${baseApiUrl}/modules/list`,
  modulesToggleStatus: `${baseApiUrl}/modules/{module}/toggle-status`,
};

