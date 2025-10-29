export type Product = {
  id: string
  name: string
  price: number
  stock: number
  createdAt: string
  updatedAt: string
}

export type SaveProductDto = {
  name: string
  price: number
  stock: number
}
