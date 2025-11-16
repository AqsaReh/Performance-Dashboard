


export interface Department {
  id: number;
  code: string;
  name: string;
  short_name: string;
  parent_id: number | null;
  division?: any;
  division_id?: number | string;
  company?: any;
  company_id?: number | string;
  location: string;
  is_active: boolean | number | string;
  created_by: string;
  updated_by: string;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}
export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  meta: PaginationMeta;
}
export interface DepartmentsApiResponse extends PaginatedResponse<Department> {
  [key: string]: any;
}

export interface CreateDepartmentPayload {
  code: string;
  name: string;
  short_name?: string;
  parent_id?: number | string | null;
  division_id?: number | string;
  company_id?: number | string;
  location?: string;
  is_active: 0 | 1;
}

export interface CreateDepartmentResponse { id?: number; message?: string; }
export interface UpdateDepartmentResponse { id?: number; message?: string; }
export interface DeleteDepartmentResponse { id?: number; message?: string; }

// Currency interfaces
export interface Currency {
  currency_id: number;
  code: string;
  name: string;
  symbol: string;
  is_active: string;
  is_default: string;
  created_at: string;
  updated_at: string;
}


export interface CreateCurrencyPayload {
  code: string;
  name: string;
  symbol: string;
  is_default: string;
  is_active: string;
}

export interface UpdateCurrencyPayload extends CreateCurrencyPayload {
  currency_id: number;
}


export interface CurrenciesApiResponse {
  data?: Currency[];
  [key: string]: any;
}

export interface CreateCurrencyResponse {
  id?: number;
  message?: string;
}

export interface UpdateCurrencyResponse {
  id?: number;
  message?: string;
}

export interface DeleteCurrencyResponse {
  id?: number;
  message?: string;
}

export interface ToggleStatusPayload {
  id: number;
  status: 0 | 1;
}

export interface ToggleStatusResponse {
  id?: number;
  status?: number;
  message?: string;
}

// Division interfaces
export interface Division {
  id: number;
  code: string;
  name: string;
  company_id: number;
  is_active: number | boolean;
  created_at: string;
  updated_at: string;
  company: Company;
}

export interface CreateDivisionPayload {
  code: string;
  name: string;
  company_id: number | string;
  is_active: 0 | 1;
}

export interface UpdateDivisionPayload extends CreateDivisionPayload {
  id: number;
}

export interface DivisionsApiResponse {
  data?: Division[];
  [key: string]: any;
}

export interface CreateDivisionResponse {
  id?: number;
  message?: string;
}

export interface UpdateDivisionResponse {
  id?: number;
  message?: string;
}

export interface DeleteDivisionResponse {
  id?: number;
  message?: string;
}

// Companies
export interface Company {
  id: number;
  code: string;
  name: string;
  short_name?: string;
  is_active: string | number | boolean;
  created_at: string;
  updated_at: string;
}

export interface CompaniesApiResponse {
  data?: Company[];
  [key: string]: any;
}

export interface CreateCompanyPayload {
  code: string;
  name: string;
  short_name: string;
  is_active: 0 | 1;
}

export interface CreateCompanyResponse {
  id?: number;
  message?: string;
}

export interface UpdateCompanyResponse {
  id?: number;
  message?: string;
}

export interface DeleteCompanyResponse {
  id?: number;
  message?: string;
}
