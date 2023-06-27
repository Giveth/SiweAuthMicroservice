export const getPassportRequestHeaders = (): {
  [key: string]: string | undefined;
} => {
  return {
    accept: 'application/json',
    'X-API-KEY': process.env.GITCOIN_API_KEY,
  };
};
