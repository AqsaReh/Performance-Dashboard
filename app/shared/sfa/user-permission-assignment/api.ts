import http from "@/config/http";
import { UserPermissionAssignmentEndpoints } from "./utils/endpoints";
import {
  UsersApiResponse,
  AssignPermissionsPayload,
  AssignPermissionsResponse,
  RevokePermissionsPayload,
  RevokePermissionsResponse,
} from "./utils/types";

// User Permission Assignment API
export const getUsers = async (): Promise<UsersApiResponse> => {
  return await http.get<UsersApiResponse>(UserPermissionAssignmentEndpoints.users);
};

export const getUsersList = async (): Promise<UsersApiResponse> => {
  return await http.get<UsersApiResponse>(UserPermissionAssignmentEndpoints.usersList);
};

export const assignPermissionsToUser = async (
  userId: number,
  payload: AssignPermissionsPayload
): Promise<AssignPermissionsResponse> => {
  const url = UserPermissionAssignmentEndpoints.assignPermissions.replace('{user}', userId.toString());
  return await http.post<AssignPermissionsResponse>(url, payload);
};

export const revokePermissionsFromUser = async (
  userId: number,
  payload: RevokePermissionsPayload
): Promise<RevokePermissionsResponse> => {
  const url = UserPermissionAssignmentEndpoints.revokePermissions.replace('{user}', userId.toString());
  return await http.post<RevokePermissionsResponse>(url, payload);
};

