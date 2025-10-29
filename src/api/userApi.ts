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
}

export type UserApi = typeof userApi
