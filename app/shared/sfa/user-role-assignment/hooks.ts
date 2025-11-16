import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  UsersApiResponse,
  AssignRolesPayload,
  AssignRolesResponse,
  RevokeRolesPayload,
  RevokeRolesResponse,
} from "./utils/types";
import {
  getUsers,
  getUsersList,
  assignRolesToUser,
  revokeRolesFromUser,
} from "./api";

// User Role Assignment hooks
export const useUsers = () => {
  return useQuery<UsersApiResponse>({
    queryKey: ["users"],
    queryFn: getUsers,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 30,
  });
};

export const useUsersList = () => {
  return useQuery<UsersApiResponse>({
    queryKey: ["users-list"],
    queryFn: getUsersList,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 30,
  });
};

export const useAssignRoles = () => {
  const queryClient = useQueryClient();
  return useMutation<AssignRolesResponse, any, { userId: number; payload: AssignRolesPayload }>({
    mutationFn: ({ userId, payload }) => assignRolesToUser(userId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users-list"] });
    },
  });
};

export const useRevokeRoles = () => {
  const queryClient = useQueryClient();
  return useMutation<RevokeRolesResponse, any, { userId: number; payload: RevokeRolesPayload }>({
    mutationFn: ({ userId, payload }) => revokeRolesFromUser(userId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users-list"] });
    },
  });
};

