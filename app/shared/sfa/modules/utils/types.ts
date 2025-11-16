import { PaginationMeta, PaginatedResponse } from "@/app/shared/master/utils/types";

// Module interfaces
export interface Module {
  id: number;
  name: string;
  slug: string | null;
  icon: string | null;
  route: string | null;
  parent_id: number | string | null;
  parent_name?: string | null;
  order_no: number | string;
  status: string; // "active" | "inactive"
  created_at: string;
  updated_at: string;
}

export interface ModulesApiResponse {
  data?: Module[];
  meta?: PaginationMeta;
  [key: string]: any;
}

export interface ModulesPaginatedResponse extends PaginatedResponse<Module> {
  [key: string]: any;
}

export interface CreateModulePayload {
  name: string;
  slug?: string | null;
  icon?: string | null;
  route?: string | null;
  parent_id?: number | string | null;
  order_no?: number;
  status: "active" | "inactive";
}

export interface CreateModuleResponse {
  id?: number;
  message?: string;
}

export interface UpdateModuleResponse {
  id?: number;
  message?: string;
}

export interface DeleteModuleResponse {
  id?: number;
  message?: string;
}

export interface ToggleStatusPayload {
  id: number;
  status: number;
}

export interface ToggleStatusResponse {
  message?: string;
}

