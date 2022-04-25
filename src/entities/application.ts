export type Application = {
  label:string;
  name:string;
  secret: string
  scopes: string[]
  validIps: string[]
  logo ?: string
  allowedRequestsPerHour :number
  isActive: boolean

}
