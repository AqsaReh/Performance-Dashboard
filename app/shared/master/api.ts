import http from "@/config/http";
import { 
    MasterEndpoints
} from "./utils/endpoints";
import { CreateCurrencyPayload, CreateCurrencyResponse, DeleteCurrencyResponse, ToggleStatusPayload, ToggleStatusResponse, UpdateCurrencyResponse, CreateDivisionPayload, CreateDivisionResponse, UpdateDivisionResponse, DeleteDivisionResponse, DivisionsApiResponse, CompaniesApiResponse, CreateCompanyPayload, CreateCompanyResponse, UpdateCompanyResponse, DeleteCompanyResponse, CreateDepartmentPayload, CreateDepartmentResponse, UpdateDepartmentResponse, DeleteDepartmentResponse, DepartmentsApiResponse, PaginatedResponse, Department, Currency, Company, Division } from "./utils/types";
import { UseListOptions } from "./hooks";

export const getDepartments = async (): Promise<any> => {
  return await http.get<any>(MasterEndpoints.departments);
};

export const getDepartmentsList = async (options?: UseListOptions): Promise<PaginatedResponse<Department>> => {
  const params = new URLSearchParams();
  
  if (options?.page) {
    params.append('page', options.page.toString());
  }
  
  if (options?.pageSize) {
    params.append('per_page', options.pageSize.toString());
  }
  
  // Add filters if any
  if (options?.filters) {
    Object.entries(options.filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });
  }
  
  const queryString = params.toString();
  const url = queryString ? `${MasterEndpoints.departmentsList}?${queryString}` : MasterEndpoints.departmentsList;
  
  return await http.get<PaginatedResponse<Department>>(url);
};

export const createDepartment = async (
  payload: CreateDepartmentPayload
): Promise<CreateDepartmentResponse> => {
  return await http.post<CreateDepartmentResponse>(
    MasterEndpoints.departments,
    payload
  );
};

export const updateDepartment = async (
  id: number,
  payload: CreateDepartmentPayload
): Promise<UpdateDepartmentResponse> => {
  return await http.put<UpdateDepartmentResponse>(
    `${MasterEndpoints.departments}/${id}`,
    payload
  );
};

export const deleteDepartment = async (
  id: number
): Promise<DeleteDepartmentResponse> => {
  return await http.delete<DeleteDepartmentResponse>(
    `${MasterEndpoints.departments}/${id}`
  );
};

export const toggleDepartmentStatus = async (
  payload: ToggleStatusPayload
): Promise<ToggleStatusResponse> => {
  const url = MasterEndpoints.departmentsToggleStatus.replace('{department}', payload.id.toString());
  return await http.post<ToggleStatusResponse>(url, payload);
};

export const createCurrency = async (
  payload: CreateCurrencyPayload
): Promise<CreateCurrencyResponse> => {
  return await http.post<CreateCurrencyResponse>(
    MasterEndpoints.currencies,
    payload
  );
};

export const updateCurrency = async (
  currency_id: number,
  payload: CreateCurrencyPayload
): Promise<UpdateCurrencyResponse> => {
  return await http.put<UpdateCurrencyResponse>(
    `${MasterEndpoints.currencies}/${currency_id}`,
    payload
  );
};


export const deleteCurrency = async (
  currency_id: number
): Promise<DeleteCurrencyResponse> => {
  return await http.delete<DeleteCurrencyResponse>(
    `${MasterEndpoints.currencies}/${currency_id}`
  );
};

export const getCurrencies = async (): Promise<any> => {
  return await http.get<any>(MasterEndpoints.currencies);
};

export const toggleCurrencyStatus = async (
  payload: ToggleStatusPayload
): Promise<ToggleStatusResponse> => {
  const url = MasterEndpoints.currenciesToggleStatus.replace('{currency}', payload.id.toString());
  return await http.post<ToggleStatusResponse>(url, payload);
};

export const getCurrenciesList = async (options?: UseListOptions): Promise<PaginatedResponse<Currency>> => {
  const params = new URLSearchParams();
  
  if (options?.page) {
    params.append('page', options.page.toString());
  }
  
  if (options?.pageSize) {
    params.append('per_page', options.pageSize.toString());
  }
  
  // Add filters if any
  if (options?.filters) {
    Object.entries(options.filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });
  }
  
  const queryString = params.toString();
  const url = queryString ? `${MasterEndpoints.currenciesList}?${queryString}` : MasterEndpoints.currenciesList;
  
  return await http.get<PaginatedResponse<Currency>>(url);
};

export const getCurrenciesToggleStatus = async (currency: string): Promise<any> => {
  return await http.get<any>(MasterEndpoints.currenciesToggleStatus.replace('{currency}', currency));
};

// Divisions API
export const getDivisions = async (): Promise<DivisionsApiResponse> => {
  return await http.get<DivisionsApiResponse>(MasterEndpoints.divisions);
};

export const getDivisionsList = async (options?: UseListOptions): Promise<PaginatedResponse<Division>> => {
  const params = new URLSearchParams();
  
  if (options?.page) {
    params.append('page', options.page.toString());
  }
  
  if (options?.pageSize) {
    params.append('per_page', options.pageSize.toString());
  }
  
  // Add filters if any
  if (options?.filters) {
    Object.entries(options.filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });
  }
  
  const queryString = params.toString();
  const url = queryString ? `${MasterEndpoints.divisionsList}?${queryString}` : MasterEndpoints.divisionsList;
  
  return await http.get<PaginatedResponse<Division>>(url);
};

export const createDivision = async (
  payload: CreateDivisionPayload
): Promise<CreateDivisionResponse> => {
  return await http.post<CreateDivisionResponse>(
    MasterEndpoints.divisions,
    payload
  );
};

export const updateDivision = async (
  id: number,
  payload: CreateDivisionPayload
): Promise<UpdateDivisionResponse> => {
  return await http.put<UpdateDivisionResponse>(
    `${MasterEndpoints.divisions}/${id}`,
    payload
  );
};

export const deleteDivision = async (
  id: number
): Promise<DeleteDivisionResponse> => {
  return await http.delete<DeleteDivisionResponse>(
    `${MasterEndpoints.divisions}/${id}`
  );
};

export const toggleDivisionStatus = async (
  payload: ToggleStatusPayload
): Promise<ToggleStatusResponse> => {
  const url = MasterEndpoints.divisionsToggleStatus.replace('{division}', payload.id.toString());
  return await http.post<ToggleStatusResponse>(url, payload);
};

// Companies
export const getCompanies = async (): Promise<CompaniesApiResponse> => {
  return await http.get<CompaniesApiResponse>(MasterEndpoints.companies);
};

export const getCompaniesList = async (options?: UseListOptions): Promise<PaginatedResponse<Company>> => {
  const params = new URLSearchParams();
  
  if (options?.page) {
    params.append('page', options.page.toString());
  }
  
  if (options?.pageSize) {
    params.append('per_page', options.pageSize.toString());
  }
  
  // Add filters if any
  if (options?.filters) {
    Object.entries(options.filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });
  }
  
  const queryString = params.toString();
  const url = queryString ? `${MasterEndpoints.companiesList}?${queryString}` : MasterEndpoints.companiesList;
  
  return await http.get<PaginatedResponse<Company>>(url);
};

export const createCompany = async (
  payload: CreateCompanyPayload
): Promise<CreateCompanyResponse> => {
  return await http.post<CreateCompanyResponse>(
    MasterEndpoints.companies,
    payload
  );
};

export const updateCompany = async (
  id: number,
  payload: CreateCompanyPayload
): Promise<UpdateCompanyResponse> => {
  return await http.put<UpdateCompanyResponse>(
    `${MasterEndpoints.companies}/${id}`,
    payload
  );
};

export const deleteCompany = async (
  id: number
): Promise<DeleteCompanyResponse> => {
  return await http.delete<DeleteCompanyResponse>(
    `${MasterEndpoints.companies}/${id}`
  );
};

export const toggleCompanyStatus = async (
  payload: ToggleStatusPayload
): Promise<ToggleStatusResponse> => {
  const url = MasterEndpoints.companiesToggleStatus.replace('{company}', payload.id.toString());
  return await http.post<ToggleStatusResponse>(url, payload);
};