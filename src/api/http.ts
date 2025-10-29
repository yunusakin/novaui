import axios, { type AxiosError, type AxiosInstance } from 'axios'
import { appEnv } from '@/config/env'
import type { ApiError, ApiResponse } from '@/types/common'

const defaultHeaders = {
  'Content-Type': 'application/json',
}

const mapError = (error: AxiosError<ApiResponse<unknown>>): ApiError => {
  if (error.response) {
    const { status, data } = error.response
    return {
      message: data?.message ?? error.message,
      status,
      details: data?.errors,
    }
  }

  return {
    message: error.message,
  }
}

const attachInterceptors = (instance: AxiosInstance): AxiosInstance => {
  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ApiResponse<unknown>>) => Promise.reject(mapError(error)),
  )

  return instance
}

export const createHttpClient = (baseURL: string): AxiosInstance =>
  attachInterceptors(
    axios.create({
      baseURL,
      headers: defaultHeaders,
    }),
  )

export const userClient = createHttpClient(appEnv.userApi)
export const productClient = createHttpClient(appEnv.productApi)
export const orderClient = createHttpClient(appEnv.orderApi)
