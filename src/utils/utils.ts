export const generateRandomString = (len: number):string=>{
  return require('crypto').randomBytes(len).toString('hex')
}
