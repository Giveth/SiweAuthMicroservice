export type AccessToken = {
  applicationId: string
  expirationDate: number
  value: string;
  scopes:string[]
  isActive : boolean
}
