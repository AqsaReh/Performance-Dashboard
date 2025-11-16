// User Permission Assignment interfaces
export interface UserPermission {
  id: number;
  name: string;
  label: string | null;
  guard_name: string;
  module_id?: number | string | null;
  created_at?: string;
  updated_at?: string;
  module?: {
    id: number;
    name: string;
    created_at?: string;
    updated_at?: string;
    status?: string;
    slug?: string;
    icon?: string;
    route?: string;
    parent_id?: string | number | null;
    order_no?: string;
  } | null;
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
  permissions?: UserPermission[] | number[] | null;
  permissions_count?: number;
}

export interface UsersApiResponse {
  success?: boolean;
  message?: string;
  data?: User[];
  meta?: {
    current_page?: number;
    last_page?: number;
    per_page?: number;
    total?: number;
    from?: number;
    to?: number;
  };
  [key: string]: any;
}

export interface AssignPermissionsPayload {
  permission_ids: number[];
}

export interface AssignPermissionsResponse {
  message?: string;
  [key: string]: any;
}

export interface RevokePermissionsPayload {
  permission_ids: number[];
}

export interface RevokePermissionsResponse {
  message?: string;
  [key: string]: any;
}

