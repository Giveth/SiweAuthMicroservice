export type AccessToken = {
  applicationId: number
  expirationDate: number
  value: string;
  scopes:string[]
  isActive : boolean
}
