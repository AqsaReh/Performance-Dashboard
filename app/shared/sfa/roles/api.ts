import http from "@/config/http";
import { RolesEndpoints } from "./utils/endpoints";
import {
  CreateRolePayload,
  CreateRoleResponse,
  UpdateRoleResponse,
  DeleteRoleResponse,
  RolesApiResponse,
  RolesPaginatedResponse,
} from "./utils/types";

export interface UseListOptions {
  page?: number;
  pageSize?: number;
  filters?: Record<string, any>;
}

// Roles API
export const getRoles = async (): Promise<RolesApiResponse> => {
  return await http.get<RolesApiResponse>(RolesEndpoints.roles);
};

export const getRolesList = async (options?: UseListOptions): Promise<RolesPaginatedResponse> => {
  const params = new URLSearchParams();
  if (options?.page) {
    params.append('page', options.page.toString());
  }
  if (options?.pageSize) {
    params.append('per_page', options.pageSize.toString());
  }
  if (options?.filters) {
    Object.entries(options.filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });
  }
  const queryString = params.toString();
  const url = queryString ? `${RolesEndpoints.rolesList}?${queryString}` : RolesEndpoints.rolesList;
  return await http.get<RolesPaginatedResponse>(url);
};

export const createRole = async (
  payload: CreateRolePayload
): Promise<CreateRoleResponse> => {
  return await http.post<CreateRoleResponse>(
    RolesEndpoints.roles,
    payload
  );
};

export const updateRole = async (
  id: number,
  payload: CreateRolePayload
): Promise<UpdateRoleResponse> => {
  return await http.put<UpdateRoleResponse>(
    `${RolesEndpoints.roles}/${id}`,
    payload
  );
};

export const deleteRole = async (
  id: number
): Promise<DeleteRoleResponse> => {
  return await http.delete<DeleteRoleResponse>(
    `${RolesEndpoints.roles}/${id}`
  );
};

