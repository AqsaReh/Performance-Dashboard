import http from "@/config/http";
import { PermissionsEndpoints } from "./utils/endpoints";
import {
  CreatePermissionPayload,
  CreatePermissionResponse,
  UpdatePermissionResponse,
  DeletePermissionResponse,
  PermissionsApiResponse,
} from "./utils/types";

// Permissions API
export const getPermissions = async (): Promise<PermissionsApiResponse> => {
  return await http.get<PermissionsApiResponse>(PermissionsEndpoints.permissions);
};

export const getPermissionsList = async (): Promise<PermissionsApiResponse> => {
  return await http.get<PermissionsApiResponse>(PermissionsEndpoints.permissionsList);
};

export const createPermission = async (
  payload: CreatePermissionPayload
): Promise<CreatePermissionResponse> => {
  return await http.post<CreatePermissionResponse>(
    PermissionsEndpoints.permissions,
    payload
  );
};

export const updatePermission = async (
  id: number,
  payload: CreatePermissionPayload
): Promise<UpdatePermissionResponse> => {
  return await http.put<UpdatePermissionResponse>(
    `${PermissionsEndpoints.permissions}/${id}`,
    payload
  );
};

export const deletePermission = async (
  id: number
): Promise<DeletePermissionResponse> => {
  return await http.delete<DeletePermissionResponse>(
    `${PermissionsEndpoints.permissions}/${id}`
  );
};

