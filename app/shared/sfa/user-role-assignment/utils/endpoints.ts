import { ApiBase } from "@/config/api";

const gatewayServiceName = "eworkflow";
const baseApiUrl = `${ApiBase.gateway}/${gatewayServiceName}/api`;

export const UserRoleAssignmentEndpoints = {
  users: `${baseApiUrl}/users`,
  usersList: `${baseApiUrl}/users/roles/list`,
  assignRoles: `${baseApiUrl}/users/{user}/assign-roles`,
  revokeRoles: `${baseApiUrl}/users/{user}/roles`,
};

