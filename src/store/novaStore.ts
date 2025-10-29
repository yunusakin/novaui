import { create } from 'zustand'
import { orderApi } from '@/api/orderApi'
import { productApi } from '@/api/productApi'
import { userApi } from '@/api/userApi'
import type { ApiResponse } from '@/types/common'
import type { CreateOrderDto, Order, OrderStatus } from '@/types/order'
import type { Product, SaveProductDto } from '@/types/product'
import type { CreateUserDto, User } from '@/types/user'

type LoadingState = {
  users: boolean
  products: boolean
  orders: boolean
}

type MutationState = {
  user: boolean
  product: boolean
  order: boolean
}

type NovaStore = {
  users: User[]
  products: Product[]
  orders: Order[]
  loading: LoadingState
  mutations: MutationState
  fetchUsers: () => Promise<void>
  fetchProducts: () => Promise<void>
  fetchOrders: () => Promise<void>
  refreshAll: () => Promise<void>
  createUser: (payload: CreateUserDto) => Promise<ApiResponse<User>>
  createProduct: (payload: SaveProductDto) => Promise<ApiResponse<Product>>
  updateProduct: (id: string, payload: SaveProductDto) => Promise<ApiResponse<Product>>
  deleteProduct: (id: string) => Promise<ApiResponse<null>>
  createOrder: (payload: CreateOrderDto) => Promise<ApiResponse<Order>>
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<ApiResponse<Order>>
}

const setLoading = (
  set: (fn: (state: NovaStore) => Partial<NovaStore>) => void,
  key: keyof LoadingState,
  value: boolean,
) => {
  set((state) => ({
    loading: {
      ...state.loading,
      [key]: value,
    },
  }))
}

const setMutation = (
  set: (fn: (state: NovaStore) => Partial<NovaStore>) => void,
  key: keyof MutationState,
  value: boolean,
) => {
  set((state) => ({
    mutations: {
      ...state.mutations,
      [key]: value,
    },
  }))
}

export const useNovaStore = create<NovaStore>((set, get) => ({
  users: [],
  products: [],
  orders: [],
  loading: {
    users: false,
    products: false,
    orders: false,
  },
  mutations: {
    user: false,
    product: false,
    order: false,
  },
  async fetchUsers() {
    setLoading(set, 'users', true)
    try {
      const users = await userApi.list()
      set(() => ({ users }))
    } finally {
      setLoading(set, 'users', false)
    }
  },
  async fetchProducts() {
    setLoading(set, 'products', true)
    try {
      const products = await productApi.list()
      set(() => ({ products }))
    } finally {
      setLoading(set, 'products', false)
    }
  },
  async fetchOrders() {
    setLoading(set, 'orders', true)
    try {
      const orders = await orderApi.list()
      set(() => ({ orders }))
    } finally {
      setLoading(set, 'orders', false)
    }
  },
  async refreshAll() {
    const { fetchUsers, fetchProducts, fetchOrders } = get()
    await Promise.all([fetchUsers(), fetchProducts(), fetchOrders()])
  },
  async createUser(payload) {
    setMutation(set, 'user', true)
    try {
      const response = await userApi.create(payload)
      set((state) => ({ users: [...state.users, response.data] }))
      return response
    } finally {
      setMutation(set, 'user', false)
    }
  },
  async createProduct(payload) {
    setMutation(set, 'product', true)
    try {
      const response = await productApi.create(payload)
      set((state) => ({ products: [...state.products, response.data] }))
      return response
    } finally {
      setMutation(set, 'product', false)
    }
  },
  async updateProduct(id, payload) {
    setMutation(set, 'product', true)
    try {
      const response = await productApi.update(id, payload)
      set((state) => ({
        products: state.products.map((product) =>
          product.id === id ? response.data : product,
        ),
      }))
      return response
    } finally {
      setMutation(set, 'product', false)
    }
  },
  async deleteProduct(id) {
    setMutation(set, 'product', true)
    try {
      const response = await productApi.remove(id)
      set((state) => ({
        products: state.products.filter((product) => product.id !== id),
      }))
      return response
    } finally {
      setMutation(set, 'product', false)
    }
  },
  async createOrder(payload) {
    setMutation(set, 'order', true)
    try {
      const response = await orderApi.create(payload)
      set((state) => ({ orders: [response.data, ...state.orders] }))
      return response
    } finally {
      setMutation(set, 'order', false)
    }
  },
  async updateOrderStatus(id, status) {
    setMutation(set, 'order', true)
    try {
      const response = await orderApi.updateStatus(id, status)
      set((state) => ({
        orders: state.orders.map((order) =>
          order.id === id ? response.data : order,
        ),
      }))
      return response
    } finally {
      setMutation(set, 'order', false)
    }
  },
}))
