import { PaginationMeta, PaginatedResponse } from "@/app/shared/master/utils/types";

// Role interfaces
export interface Permission {
  id: number;
  name: string;
  guard_name: string;
}

export interface Role {
  id: number;
  name: string;
  guard_name: string;
  permissions?: Permission[] | null;
  users_count?: number;
  created_at: string;
  updated_at: string;
  users: User[];
}
export interface User {
  id: number;
  pno: string;
  nickname: string;
  full_name: string;
  title: string;
  email: string;
}

export interface RolesApiResponse {
  data?: Role[];
  meta?: PaginationMeta;
  [key: string]: any;
}

export interface RolesPaginatedResponse extends PaginatedResponse<Role> {
  [key: string]: any;
}

export interface CreateRolePayload {
  name: string;
  guard_name: string;
}

export interface CreateRoleResponse {
  id?: number;
  message?: string;
}

export interface UpdateRoleResponse {
  id?: number;
  message?: string;
}

export interface DeleteRoleResponse {
  id?: number;
  message?: string;
}

