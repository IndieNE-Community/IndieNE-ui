export interface ApiPage<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}

export interface PageQuery {
  [key: string]: string | number | boolean | undefined
  page?: number
  size?: number
  sort?: string
}
