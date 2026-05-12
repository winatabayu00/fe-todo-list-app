export interface ILoginCredentials {
  email: string
  password: string
  remember_me?: boolean
}

export interface IRegisterCredentials {
  name: string
  email: string
  password: string
  password_confirmation: string
}