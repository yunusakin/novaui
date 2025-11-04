import { userClient } from './http'
import type { ApiResponse } from '@/types/common'
import type { CreateUserDto, User } from '@/types/user'

const basePath = '/'

export const userApi = {
  async list(): Promise<User[]> {
    const { data } = await userClient.get<ApiResponse<User[]>>(basePath)
    return data.data
  },
  async create(payload: CreateUserDto): Promise<ApiResponse<User>> {
    const { data } = await userClient.post<ApiResponse<User>>(basePath, payload)
    return data
  },
  async remove(id: string): Promise<ApiResponse<null>> {
    const { data } = await userClient.delete<ApiResponse<null>>(`${basePath}${id}`)
    return data
  },
}

export type UserApi = typeof userApi
