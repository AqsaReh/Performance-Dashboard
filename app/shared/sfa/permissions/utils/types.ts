// Permission interfaces
export interface Permission {
  id: number;
  name: string;
  label: string | null;
  guard_name: string;
  module_id?: number | string | null;
  created_at: string;
  updated_at: string;
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

export interface PermissionsApiResponse {
  success?: boolean;
  message?: string;
  data?: Permission[];
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

export interface CreatePermissionPayload {
  name: string;
  guard_name: string;
  module_id?: number | string | null;
  label?: string | null;
}

export interface CreatePermissionResponse {
  id?: number;
  message?: string;
}

export interface UpdatePermissionResponse {
  id?: number;
  message?: string;
}

export interface DeletePermissionResponse {
  id?: number;
  message?: string;
}

