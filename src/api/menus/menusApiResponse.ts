export interface IMenu {
  id: string
  name: string
  route: string
  slug: string
  description: string
  parent_id: string | null
  level: number
  order: number
  icon: string | null
  type: string
  suggestion_roles: string[]
  suggestion_permissions: string[]
  children: IMenu[] // recursive
}

export interface IMenusApiResponse {
  rc: string
  message: string
  timestamp: string
  payload: IMenu[]
}
