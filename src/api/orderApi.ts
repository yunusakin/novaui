import { orderClient } from './http'
import type { ApiResponse } from '@/types/common'
import type { CreateOrderDto, Order, OrderStatus } from '@/types/order'

const basePath = '/'

export const orderApi = {
  async list(): Promise<Order[]> {
    const { data } = await orderClient.get<ApiResponse<Order[]>>(basePath)
    return data.data
  },
  async create(payload: CreateOrderDto): Promise<ApiResponse<Order>> {
    const { data } = await orderClient.post<ApiResponse<Order>>(basePath, payload)
    return data
  },
  async updateStatus(id: string, status: OrderStatus): Promise<ApiResponse<Order>> {
    const { data } = await orderClient.patch<ApiResponse<Order>>(`${basePath}${id}/status`, {
      status,
    })
    return data
  },
}

export type OrderApi = typeof orderApi
