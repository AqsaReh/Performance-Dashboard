import { ApiBase } from "@/config/api";

// TODO: Change this to sfa (sales force automation)
const gatewayServiceName = "eworkflow";
const apiServiceName = "api/sfa";
const baseApiUrl = `${ApiBase.gateway}/${gatewayServiceName}/${apiServiceName}`;

export const MasterEndpoints = {
  departments: `${baseApiUrl}/departments`,
  departmentsList: `${baseApiUrl}/departments/list`,
  departmentsToggleStatus: `${baseApiUrl}/departments/{department}/toggle-status`,
  divisions: `${baseApiUrl}/divisions`,
  divisionsList: `${baseApiUrl}/divisions/list`,
  divisionsToggleStatus: `${baseApiUrl}/divisions/{division}/toggle-status`,
  companies: `${baseApiUrl}/companies`,
  companiesList: `${baseApiUrl}/companies/list`,
  companiesToggleStatus: `${baseApiUrl}/companies/{company}/toggle-status`,
  currencies: `${baseApiUrl}/currencies`,
  currenciesList: `${baseApiUrl}/currencies/list`,
  currenciesToggleStatus: `${baseApiUrl}/currencies/{currency}/toggle-status`,
};