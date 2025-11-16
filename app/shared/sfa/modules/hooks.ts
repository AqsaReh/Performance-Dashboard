import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CreateModulePayload,
  CreateModuleResponse,
  UpdateModuleResponse,
  DeleteModuleResponse,
  ModulesApiResponse,
  ToggleStatusPayload,
  ToggleStatusResponse,
} from "./utils/types";
import {
  getModules,
  getModulesList,
  createModule,
  updateModule,
  deleteModule,
  toggleModuleStatus,
  UseListOptions,
} from "./api";

export type { UseListOptions } from "./api";

// Modules hooks
export const useModules = () => {
  return useQuery<ModulesApiResponse>({
    queryKey: ["modules"],
    queryFn: getModules,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 30,
  });
};

export const useModulesList = (options?: UseListOptions) => {
  return useQuery({
    queryKey: ["modules-list", options],
    queryFn: () => getModulesList(options),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 30,
  });
};

export const useCreateModule = () => {
  const queryClient = useQueryClient();
  return useMutation<CreateModuleResponse, any, CreateModulePayload>({
    mutationFn: (payload) => createModule(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["modules-list"] });
    },
  });
};

export const useUpdateModule = () => {
  const queryClient = useQueryClient();
  return useMutation<UpdateModuleResponse, any, { id: number; payload: CreateModulePayload }>({
    mutationFn: ({ id, payload }) => updateModule(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["modules-list"] });
    },
  });
};

export const useDeleteModule = () => {
  const queryClient = useQueryClient();
  return useMutation<DeleteModuleResponse, any, number>({
    mutationFn: (id) => deleteModule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["modules-list"] });
    },
  });
};

export const useToggleModuleStatus = () => {
  const queryClient = useQueryClient();
  return useMutation<ToggleStatusResponse, any, ToggleStatusPayload>({
    mutationFn: (payload) => toggleModuleStatus(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["modules-list"] });
    },
  });
};

