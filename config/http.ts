import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { getSession, signOut } from "next-auth/react";

// Map to track active requests and their corresponding abort controllers
const activeRequests = new Map<string, AbortController>();

// Create an Axios instance with a base URL
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001",
  withCredentials: true, // Important for sending cookies
});

// Centralized HTTP Error Handling
const handleHttpError = (error: unknown): void => {
  if (axios.isCancel(error)) {
    // Request was canceled, no further action needed
    return;
  }
  if (error instanceof AxiosError) {
    if (error.response) {
      console.error(`HTTP Error ${error.response.status}:`, {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers
      });
      
      switch (error.response.status) {
        case 401:
          console.error("Unauthorized access - redirecting to login.");
          break;
        case 403:
          console.error("Forbidden - insufficient permissions.");
          break;
        case 404:
          console.error("Resource not found.");
          break;
        case 500:
          console.error("Internal server error.");
          break;
        default:
          console.error(`HTTP Error: ${error.response.status}`);
      }
    } else if (error.request) {
      console.error("No response received from the server:", {
        url: error.config?.url,
        method: error.config?.method,
        message: error.message
      });
    } else {
      console.error("Request setup error:", error.message);
    }
  } else {
    console.error("Unknown error occurred:", error);
  }
};

// Request Interceptor
api.interceptors.request.use(
  async (config) => {
    // for development only
    if (process.env.NODE_ENV === "development") {
      console.log("Request URL:", config.url);
      console.log("Base URL:", config.baseURL);
      console.log("Request method:", config.method);
    }

    const session = await getSession(); // Fetch the current session
    // for development only
    if (process.env.NODE_ENV === "development") {
      console.log("Retrieved session:", session);
      console.log("Session user:", session?.user);
      console.log("Access token available:", !!session?.user?.accessToken);
    }

    const key = `${config.method}-${config.url}`;

    // Abort the existing request with the same key to prevent duplicates
    if (activeRequests.has(key)) {
      const controller = activeRequests.get(key);
      controller?.abort();
    }

    // Create a new AbortController for this request
    const controller = new AbortController();
    config.signal = controller.signal;
    activeRequests.set(key, controller);

    // for development only
    if (process.env.NODE_ENV === "development") {
      console.log("Request Headers:", config.headers);
      console.log("Request access token:", session);
    }

    // Attach access token to Authorization header if available
    if (session?.user?.accessToken && config.headers) {
      // for development only
      if (process.env.NODE_ENV === "development") {
        console.log(
          "Access token attached to request:",
          session.user.accessToken
        );
      }
      config.headers["Authorization"] = `Bearer ${session.user.accessToken}`;
      config.headers["X-Gateway-Token"] = process.env.NEXT_PUBLIC_GATEWAY_TOKEN || "r/MH9vS0eQlP/ZT91BKXENY2pdAEzhT+DX5lHtCTccI=";
      config.headers['Accept'] = 'application/json';
    } else {
      // for development only
      if (process.env.NODE_ENV === "development") {
        console.warn("No session or access token available for request:", config.url);
        console.warn("Session:", session);
        console.warn("User:", session?.user);
        console.warn("Session status:", session ? "exists" : "null");
        console.warn("Access token exists:", !!session?.user?.accessToken);
      }
    }

    return config;
  },
  (error) => {
    // Handle request setup errors
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // for development only
    if (process.env.NODE_ENV === "development") {
      console.log("Response received for URL:", response.config.url);
    }
    const key = `${response.config.method}-${response.config.url}`;
    activeRequests.delete(key); // Remove the completed request from the map
    return response;
  },
  async (error: AxiosError) => {
    const { config, response } = error;
    const key = `${config?.method}-${config?.url}`;
    activeRequests.delete(key); // Clean up the map entry on error

    if (response?.status === 401) {
      // Unauthorized - possibly invalid token, sign out the user
      await signOut({ callbackUrl: "/login" });
      return Promise.reject(error);
    }

    handleHttpError(error); // Handle other HTTP errors
    return Promise.reject(error);
  }
);

// HTTP Utility Methods
const http = {
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await api.get<T>(url, config);
    return response.data;
  },
  post: async <T>(
    url: string,
    data?: Record<string, any>,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const response = await api.post<T>(url, data, config);
    return response.data;
  },
  put: async <T>(
    url: string,
    data?: Record<string, any>,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const response = await api.put<T>(url, data, config);
    return response.data;
  },
  patch: async <T>(
    url: string,
    data?: Record<string, any>,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const response = await api.patch<T>(url, data, config);
    return response.data;
  },
  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await api.delete<T>(url, config);
    return response.data;
  },
  cancelAll: () => {
    // Cancel all ongoing requests
    activeRequests.forEach((controller) => controller.abort());
    activeRequests.clear();
  },
};

export default http;
