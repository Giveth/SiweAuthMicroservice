export const getPassportRequestHeaders = (): {
  [key: string]: string | undefined;
} => {
  return {
    accept: 'application/json',
    'X-Api-Key': process.env.GITCOIN_API_KEY,
  };
};
