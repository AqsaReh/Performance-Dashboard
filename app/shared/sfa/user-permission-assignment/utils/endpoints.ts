import { ApiBase } from "@/config/api";

const gatewayServiceName = "eworkflow";
const baseApiUrl = `${ApiBase.gateway}/${gatewayServiceName}/api`;

export const UserPermissionAssignmentEndpoints = {
  users: `${baseApiUrl}/users`,
  usersList: `${baseApiUrl}/users/permissions/list`,
  assignPermissions: `${baseApiUrl}/users/{user}/assign-permissions`,
  revokePermissions: `${baseApiUrl}/users/{user}/permissions`,
};

