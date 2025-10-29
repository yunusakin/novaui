import { productClient } from './http'
import type { ApiResponse } from '@/types/common'
import type { Product, SaveProductDto } from '@/types/product'

const basePath = '/'

export const productApi = {
  async list(): Promise<Product[]> {
    const { data } = await productClient.get<ApiResponse<Product[]>>(basePath)
    return data.data
  },
  async create(payload: SaveProductDto): Promise<ApiResponse<Product>> {
    const { data } = await productClient.post<ApiResponse<Product>>(basePath, payload)
    return data
  },
  async update(id: string, payload: SaveProductDto): Promise<ApiResponse<Product>> {
    const { data } = await productClient.put<ApiResponse<Product>>(`${basePath}${id}`, payload)
    return data
  },
  async remove(id: string): Promise<ApiResponse<null>> {
    const { data } = await productClient.delete<ApiResponse<null>>(`${basePath}${id}`)
    return data
  },
}

export type ProductApi = typeof productApi
