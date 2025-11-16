import http from "@/config/http";
import { UserRoleAssignmentEndpoints } from "./utils/endpoints";
import {
  UsersApiResponse,
  AssignRolesPayload,
  AssignRolesResponse,
  RevokeRolesPayload,
  RevokeRolesResponse,
} from "./utils/types";

// User Role Assignment API
export const getUsers = async (): Promise<UsersApiResponse> => {
  return await http.get<UsersApiResponse>(UserRoleAssignmentEndpoints.users);
};

export const getUsersList = async (): Promise<UsersApiResponse> => {
  return await http.get<UsersApiResponse>(UserRoleAssignmentEndpoints.usersList);
};

export const assignRolesToUser = async (
  userId: number,
  payload: AssignRolesPayload
): Promise<AssignRolesResponse> => {
  const url = UserRoleAssignmentEndpoints.assignRoles.replace('{user}', userId.toString());
  return await http.post<AssignRolesResponse>(url, payload);
};

export const revokeRolesFromUser = async (
  userId: number,
  payload: RevokeRolesPayload
): Promise<RevokeRolesResponse> => {
  const url = UserRoleAssignmentEndpoints.revokeRoles.replace('{user}', userId.toString());
  return await http.post<RevokeRolesResponse>(url, payload);
};

