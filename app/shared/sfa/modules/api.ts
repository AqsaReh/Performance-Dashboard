import http from "@/config/http";
import { ModulesEndpoints } from "./utils/endpoints";
import { 
  CreateModulePayload, 
  CreateModuleResponse, 
  UpdateModuleResponse, 
  DeleteModuleResponse, 
  ModulesApiResponse,
  ModulesPaginatedResponse,
  ToggleStatusPayload,
  ToggleStatusResponse
} from "./utils/types";

export interface UseListOptions {
  page?: number;
  pageSize?: number;
  filters?: Record<string, any>;
}

// Modules API
export const getModules = async (): Promise<ModulesApiResponse> => {
  return await http.get<ModulesApiResponse>(ModulesEndpoints.modules);
};

export const getModulesList = async (options?: UseListOptions): Promise<ModulesPaginatedResponse> => {
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
  const url = queryString ? `${ModulesEndpoints.modulesList}?${queryString}` : ModulesEndpoints.modulesList;
  return await http.get<ModulesPaginatedResponse>(url);
};

export const createModule = async (
  payload: CreateModulePayload
): Promise<CreateModuleResponse> => {
  return await http.post<CreateModuleResponse>(
    ModulesEndpoints.modules,
    payload
  );
};

export const updateModule = async (
  id: number,
  payload: CreateModulePayload
): Promise<UpdateModuleResponse> => {
  return await http.put<UpdateModuleResponse>(
    `${ModulesEndpoints.modules}/${id}`,
    payload
  );
};

export const deleteModule = async (
  id: number
): Promise<DeleteModuleResponse> => {
  return await http.delete<DeleteModuleResponse>(
    `${ModulesEndpoints.modules}/${id}`
  );
};

export const toggleModuleStatus = async (
  payload: ToggleStatusPayload
): Promise<ToggleStatusResponse> => {
  const url = ModulesEndpoints.modulesToggleStatus.replace('{module}', payload.id.toString());
  return await http.post<ToggleStatusResponse>(url, payload);
};

