import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CreatePermissionPayload,
  CreatePermissionResponse,
  UpdatePermissionResponse,
  DeletePermissionResponse,
  PermissionsApiResponse,
} from "./utils/types";
import {
  getPermissions,
  getPermissionsList,
  createPermission,
  updatePermission,
  deletePermission,
} from "./api";

// Permissions hooks
export const usePermissions = () => {
  return useQuery<PermissionsApiResponse>({
    queryKey: ["permissions"],
    queryFn: getPermissions,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 30,
  });
};

export const usePermissionsList = () => {
  return useQuery<PermissionsApiResponse>({
    queryKey: ["permissions-list"],
    queryFn: getPermissionsList,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 30,
  });
};

export const useCreatePermission = () => {
  const queryClient = useQueryClient();
  return useMutation<CreatePermissionResponse, any, CreatePermissionPayload>({
    mutationFn: (payload) => createPermission(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions-list"] });
    },
  });
};

export const useUpdatePermission = () => {
  const queryClient = useQueryClient();
  return useMutation<UpdatePermissionResponse, any, { id: number; payload: CreatePermissionPayload }>({
    mutationFn: ({ id, payload }) => updatePermission(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions-list"] });
    },
  });
};

export const useDeletePermission = () => {
  const queryClient = useQueryClient();
  return useMutation<DeletePermissionResponse, any, number>({
    mutationFn: (id) => deletePermission(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions-list"] });
    },
  });
};

