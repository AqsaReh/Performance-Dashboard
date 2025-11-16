import { ApiBase } from "@/config/api";

const gatewayServiceName = "eworkflow";
const apiServiceName = "api/sfa";
const baseApiUrl = `${ApiBase.gateway}/${gatewayServiceName}/${apiServiceName}`;

export const PermissionsEndpoints = {
  permissions: `${baseApiUrl}/permissions`,
  permissionsList: `${baseApiUrl}/permissions/list`,
};

