export interface IUser {
  id: string
  name: string
  email: string
}

export interface ILoginApiResponse {
  user: IUser
  token: string
}

export interface IRegisterApiResponse {
  user: IUser
  token: string
}

export interface ILogoutApiResponse {
  message: string
}