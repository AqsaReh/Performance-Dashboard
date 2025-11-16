import { ApiBase } from "@/config/api";

const gatewayServiceName = "eworkflow";
const apiServiceName = "api/sfa";
const baseApiUrl = `${ApiBase.gateway}/${gatewayServiceName}/${apiServiceName}`;

export const RolesEndpoints = {
  roles: `${baseApiUrl}/roles`,
  rolesList: `${baseApiUrl}/roles/list`,
};

