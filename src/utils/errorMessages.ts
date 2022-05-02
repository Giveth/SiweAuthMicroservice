export const errorMessagesEnum: {
  [key: string]: {
    code: number;
    message: string;
    httpStatusCode: number;
  };
} = {
  UNAUTHORIZED: {
    message: 'unAuthorized',
    httpStatusCode: 401,
    code: 1000,
  },

  YOU_DONT_HAVE_ACCESS_TO_THIS_SCOPE: {
    message: 'You dont have access to this scope',
    httpStatusCode: 403,
    code: 1001,
  },
  SCOPE_NOT_FOUND: {
    message: 'Invalid scope',
    httpStatusCode: 403,
    code: 1002,
  },
  INVALID_FROM_WALLET_ADDRESS: {
    message: 'Invalid fromWalletAddress',
    httpStatusCode: 400,
    code: 2001,
  },
  INVALID_TO_WALLET_ADDRESS: {
    message: 'Invalid toWalletAddress',
    httpStatusCode: 400,
    code: 2002,
  },
};
