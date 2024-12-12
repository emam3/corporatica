import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { DATA_TYPES } from "./enum/home";
import { environment } from "./environment";
import { convertSearchParamsToString } from "./functions/api";

class ApiClient {
  private instance: AxiosInstance;
  public headers: { [k: string]: string } = {};

  constructor(baseURL: string) {
    this.instance = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...this.headers,
      },
    });

    // Add a response interceptor
    this.instance.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        throw error;
      }
    );
  }

  // Methods to match the Axios API
  get<T = unknown>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    const parameters = config?.params;
    const searchParamsString = parameters
      ? convertSearchParamsToString(parameters)
      : "";
    const fullUrl = this.instance.defaults.baseURL + url + searchParamsString;
    return this.instance.get<T>(fullUrl, config);
  }

  post<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    const fullUrl = this.instance.defaults.baseURL + url;
    return this.instance.post<T>(fullUrl, data, config);
  }

  put<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    const fullUrl = this.instance.defaults.baseURL + url;
    return this.instance.put<T>(fullUrl, data, config);
  }

  delete<T = unknown>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    const parameters = config?.params;
    const searchParamsString = parameters
      ? convertSearchParamsToString(parameters)
      : "";
    const fullUrl = this.instance.defaults.baseURL + url + searchParamsString;
    return this.instance.delete<T>(fullUrl, config);
  }
}

export const analysisApi = new ApiClient(environment.REACT_APP_API_URL);

export const endPoints: { [k: string]: string } = {
  [DATA_TYPES.TEXT]: "/text-process",
  [DATA_TYPES.TABULAR]: "/analyze-tabular",
  [DATA_TYPES.IMAGE]: "/image-analysis",
};