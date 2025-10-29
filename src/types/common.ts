export type ApiResponse<T> = {
  success: boolean
  message: string
  data: T
  errors?: Record<string, string[]>
}

export type PaginatedData<T> = {
  items: T[]
  total: number
}

export type PaginatedResponse<T> = ApiResponse<PaginatedData<T>>

export type ApiError = {
  message: string
  status?: number
  details?: Record<string, string[]>
}
