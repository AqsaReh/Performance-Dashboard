import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CreateRolePayload,
  CreateRoleResponse,
  UpdateRoleResponse,
  DeleteRoleResponse,
  RolesApiResponse,
} from "./utils/types";
import {
  getRoles,
  getRolesList,
  createRole,
  updateRole,
  deleteRole,
  UseListOptions,
} from "./api";

export type { UseListOptions } from "./api";

// Roles hooks
export const useRoles = () => {
  return useQuery<RolesApiResponse>({
    queryKey: ["roles"],
    queryFn: getRoles,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 30,
  });
};

export const useRolesList = (options?: UseListOptions) => {
  return useQuery({
    queryKey: ["roles-list", options],
    queryFn: () => getRolesList(options),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 30,
  });
};

export const useCreateRole = () => {
  const queryClient = useQueryClient();
  return useMutation<CreateRoleResponse, any, CreateRolePayload>({
    mutationFn: (payload) => createRole(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles-list"] });
    },
  });
};

export const useUpdateRole = () => {
  const queryClient = useQueryClient();
  return useMutation<UpdateRoleResponse, any, { id: number; payload: CreateRolePayload }>({
    mutationFn: ({ id, payload }) => updateRole(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles-list"] });
    },
  });
};

export const useDeleteRole = () => {
  const queryClient = useQueryClient();
  return useMutation<DeleteRoleResponse, any, number>({
    mutationFn: (id) => deleteRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles-list"] });
    },
  });
};

