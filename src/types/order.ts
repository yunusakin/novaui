import type { Product } from './product'
import type { User } from './user'

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'COMPLETED'
  | 'CANCELLED'

export type Order = {
  id: string
  userId: string
  productId: string
  quantity: number
  totalAmount: number
  status: OrderStatus
  createdAt: string
  updatedAt: string
  user?: User
  product?: Product
}

export type CreateOrderDto = {
  userId: string
  productId: string
  quantity: number
}
