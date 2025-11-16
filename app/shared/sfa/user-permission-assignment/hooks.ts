import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  UsersApiResponse,
  AssignPermissionsPayload,
  AssignPermissionsResponse,
  RevokePermissionsPayload,
  RevokePermissionsResponse,
} from "./utils/types";
import {
  getUsers,
  getUsersList,
  assignPermissionsToUser,
  revokePermissionsFromUser,
} from "./api";

// User Permission Assignment hooks
export const useUsers = () => {
  return useQuery<UsersApiResponse>({
    queryKey: ["users-permissions"],
    queryFn: getUsers,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 30,
  });
};

export const useUsersList = () => {
  return useQuery<UsersApiResponse>({
    queryKey: ["users-permissions-list"],
    queryFn: getUsersList,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 30,
  });
};

export const useAssignPermissions = () => {
  const queryClient = useQueryClient();
  return useMutation<AssignPermissionsResponse, any, { userId: number; payload: AssignPermissionsPayload }>({
    mutationFn: ({ userId, payload }) => assignPermissionsToUser(userId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users-permissions-list"] });
    },
  });
};

export const useRevokePermissions = () => {
  const queryClient = useQueryClient();
  return useMutation<RevokePermissionsResponse, any, { userId: number; payload: RevokePermissionsPayload }>({
    mutationFn: ({ userId, payload }) => revokePermissionsFromUser(userId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users-permissions-list"] });
    },
  });
};

