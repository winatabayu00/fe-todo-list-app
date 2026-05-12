export interface IPayloadResponse<T> {
  rc: string
  message: string
  timestamp: string
  payload: IDataResponse<T>
}

export interface IResponseParams {
  paginated?: boolean | number
  perpage?: number
  page?: number
  search?: string
  order?: any
  filter?: any
  lang?: string
}

export interface IDataResponse<T> {
  data: T
  current_page: number
  first_page_url: string
  from: number | undefined
  last_page: number
  last_page_url: string
  next_page_url: string | undefined
  path: string
  per_page: number
  prev_page_url: string | undefined
  to: number | undefined
  total: number
}
