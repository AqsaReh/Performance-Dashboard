// User Role Assignment interfaces
export interface UserRole {
  id: number;
  name: string;
  guard_name: string;
}

export interface User {
  id: number;
  email: string;
  pno: string;
  full_name: string;
  nickname?: string;
  title?: string;
  department?: string;
  division?: string;
  company?: string;
  is_active?: boolean;
  roles?: UserRole[] | null;
  roles_count?: number;
}

export interface UsersApiResponse {
  data?: User[];
  [key: string]: any;
}

export interface AssignRolesPayload {
  role_ids: number[];
}

export interface AssignRolesResponse {
  message?: string;
  [key: string]: any;
}

export interface RevokeRolesPayload {
  role_ids: number[];
}

export interface RevokeRolesResponse {
  message?: string;
  [key: string]: any;
}

