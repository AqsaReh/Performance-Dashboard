import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateCurrencyPayload, CreateCurrencyResponse, CurrenciesApiResponse, DeleteCurrencyResponse, ToggleStatusPayload, ToggleStatusResponse, UpdateCurrencyResponse, CreateDivisionPayload, CreateDivisionResponse, UpdateDivisionResponse, DeleteDivisionResponse, DivisionsApiResponse, CompaniesApiResponse, CreateCompanyPayload, CreateCompanyResponse, UpdateCompanyResponse, DeleteCompanyResponse, CreateDepartmentPayload, CreateDepartmentResponse, UpdateDepartmentResponse, DeleteDepartmentResponse, DepartmentsApiResponse } from "./utils/types";
import { createCurrency, deleteCurrency, getCurrencies, getCurrenciesList, getDepartments, getDepartmentsList, toggleCurrencyStatus, updateCurrency, createDivision, deleteDivision, getDivisions, getDivisionsList, toggleDivisionStatus, updateDivision, getCompanies, getCompaniesList, createCompany, updateCompany, deleteCompany, toggleCompanyStatus, createDepartment, updateDepartment, deleteDepartment, toggleDepartmentStatus } from "./api";

export const useDepartments = () => {
  return useQuery({
    queryKey: ["departments"],
    queryFn: getDepartments,
  });
};

export interface UseListOptions {
  page?: number;
  pageSize?: number;
  filters?: Record<string, any>;
}

export const useDepartmentsList = (options?: UseListOptions) => {
  return useQuery({
    queryKey: ["departments-list", options],
    queryFn: () => getDepartmentsList(options),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 30,
  });
};

export const useCreateDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation<CreateDepartmentResponse, any, CreateDepartmentPayload>({
    mutationFn: (payload) => createDepartment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments-list"] });
    },
  });
};

export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation<UpdateDepartmentResponse, any, { id: number; payload: CreateDepartmentPayload }>({
    mutationFn: ({ id, payload }) => updateDepartment(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments-list"] });
    },
  });
};

export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation<DeleteDepartmentResponse, any, number>({
    mutationFn: (id) => deleteDepartment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments-list"] });
    },
  });
};

export const useToggleDepartmentStatus = () => {
  const queryClient = useQueryClient();
  return useMutation<ToggleStatusResponse, any, ToggleStatusPayload>({
    mutationFn: (payload) => toggleDepartmentStatus(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments-list"] });
    },
  });
};


export const useCurrencies = () => {
  return useQuery<CurrenciesApiResponse>({
    queryKey: ["currencies"],
    queryFn: getCurrencies,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
};

export const useCurrenciesList = (options?: UseListOptions) => {
  return useQuery({
    queryKey: ["currencies-list", options],
    queryFn: () => getCurrenciesList(options),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
};

export const useCreateCurrency = () => {
  const queryClient = useQueryClient();
  return useMutation<CreateCurrencyResponse, any, CreateCurrencyPayload>({
    mutationFn: (payload) => createCurrency(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currencies-list"] });
    },
  });
};

export const useUpdateCurrency = () => {
  const queryClient = useQueryClient();
  return useMutation<UpdateCurrencyResponse, any, { currency_id: number; payload: CreateCurrencyPayload }>({
    mutationFn: ({ currency_id, payload }) => updateCurrency(currency_id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currencies-list"] });
    },
  });
};

export const useDeleteCurrency = () => {
  const queryClient = useQueryClient();
  return useMutation<DeleteCurrencyResponse, any, number>({
    mutationFn: (currency_id) => deleteCurrency(currency_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currencies-list"] });
    },
  });
};

export const useToggleCurrencyStatus = () => {
  const queryClient = useQueryClient();
  return useMutation<ToggleStatusResponse, any, ToggleStatusPayload>({
    mutationFn: (payload) => toggleCurrencyStatus(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currencies-list"] });
    },
  });
};




// Divisions hooks
export const useDivisions = () => {
  return useQuery<DivisionsApiResponse>({
    queryKey: ["divisions"],
    queryFn: getDivisions,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 30,
  });
};

export const useDivisionsList = (options?: UseListOptions) => {
  return useQuery({
    queryKey: ["divisions-list", options],
    queryFn: () => getDivisionsList(options),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 30,
  });
};

export const useCreateDivision = () => {
  const queryClient = useQueryClient();
  return useMutation<CreateDivisionResponse, any, CreateDivisionPayload>({
    mutationFn: (payload) => createDivision(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["divisions-list"] });
    },
  });
};

export const useUpdateDivision = () => {
  const queryClient = useQueryClient();
  return useMutation<UpdateDivisionResponse, any, { id: number; payload: CreateDivisionPayload }>({
    mutationFn: ({ id, payload }) => updateDivision(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["divisions-list"] });
    },
  });
};

export const useDeleteDivision = () => {
  const queryClient = useQueryClient();
  return useMutation<DeleteDivisionResponse, any, number>({
    mutationFn: (id) => deleteDivision(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["divisions-list"] });
    },
  });
};

export const useToggleDivisionStatus = () => {
  const queryClient = useQueryClient();
  return useMutation<ToggleStatusResponse, any, ToggleStatusPayload>({
    mutationFn: (payload) => toggleDivisionStatus(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["divisions-list"] });
    },
  });
};

// Companies hooks (for selects)
export const useCompanies = () => {
  return useQuery<CompaniesApiResponse>({
    queryKey: ["companies"],
    queryFn: getCompanies,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 30,
  });
};

export const useCompaniesList = (options?: UseListOptions) => {
  return useQuery({
    queryKey: ["companies-list", options],
    queryFn: () => getCompaniesList(options),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 30,
  });
};

export const useCreateCompany = () => {
  const queryClient = useQueryClient();
  return useMutation<CreateCompanyResponse, any, CreateCompanyPayload>({
    mutationFn: (payload) => createCompany(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies-list"] });
    },
  });
};

export const useUpdateCompany = () => {
  const queryClient = useQueryClient();
  return useMutation<UpdateCompanyResponse, any, { id: number; payload: CreateCompanyPayload }>({
    mutationFn: ({ id, payload }) => updateCompany(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies-list"] });
    },
  });
};

export const useDeleteCompany = () => {
  const queryClient = useQueryClient();
  return useMutation<DeleteCompanyResponse, any, number>({
    mutationFn: (id) => deleteCompany(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies-list"] });
    },
  });
};

export const useToggleCompanyStatus = () => {
  const queryClient = useQueryClient();
  return useMutation<ToggleStatusResponse, any, ToggleStatusPayload>({
    mutationFn: (payload) => toggleCompanyStatus(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies-list"] });
    },
  });
};
