export const errorMessagesEnum = {
  INTERNAL_SERVER_ERROR: {
    message: 'Internal Server Error',
    httpStatusCode: 500,
    code: 3000,
  },
  SERVICE_NOT_IMPLEMENTED: {
    message: 'Giveth Service Not Implemented',
    httpStatusCode: 500,
    code: 3001,
  },

  NOT_IMPLEMENTED: {
    message: 'Not implemented',
    httpStatusCode: 500,
    code: 3001,
  },

  MISSING_LOGIN_DATA: {
    message: 'Missing message, signature or nonce for verification',
    httpStatusCode: 401,
    code: 1000,
  },

  NONCE_INVALID: {
    message: 'Nonce does not match',
    httpStatusCode: 401,
    code: 1000,
  },

  NONCE_EXPIRED: {
    message: 'Nonce is no longer valid',
    httpStatusCode: 401,
    code: 1000,
  },

  INVALID_SOLANA_SIGNATURE_OR_LOGIN_DATA: {
    message: 'Invalid solana signature or login data',
    httpStatusCode: 401,
    code: 1000,
  },

  JWT_EXPIRED: {
    message: 'Access Token is expired',
    httpStatusCode: 401,
    code: 1000,
  },

  JWT_NOT_FOUND: {
    message: 'Access token not found',
    httpStatusCode: 401,
    code: 1000,
  },

  MULTISIG_SESSION_NOT_FOUND: {
    message: 'Access token not found',
    httpStatusCode: 401,
    code: 1000,
  },

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
  TOKEN_DOESNT_HAVE_ACCESS_TO_THIS_SCOPE: {
    message: 'Access token doesnt have access to this scope',
    httpStatusCode: 403,
    code: 1002,
  },
  SCOPE_NOT_FOUND: {
    message: 'Invalid scope',
    httpStatusCode: 403,
    code: 1003,
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
  IMPACT_GRAPH_VALIDATION_ERROR: {
    message: 'Invalid input data',
    httpStatusCode: 400,
    code: 2003,
  },

  PASSPORT_INVALID_SIGNATURE: {
    message: 'Invalid signature for nonce',
    httpStatusCode: 400,
    code: 2004,
  },

  NOT_SAFE_OWNER: {
    message: 'User requesting access, is not part of the multisig safe',
    httpStatusCode: 403,
    code: 1004,
  },

  PASSPORT_ERROR: {
    message: 'Error authenticating passport',
    httpStatusCode: 400,
    code: 2005,
  },
  PASSPORT_BAD_REQUEST: {
    message: 'Passport bad request',
    httpStatusCode: 400,
    code: 2006,
  },
  PASSPORT_UNAUTHORIZED: {
    message: 'Passport unauthorized',
    httpStatusCode: 401,
    code: 2007,
  },
  PASSPORT_NOT_FOUND: {
    message: 'Passport not found',
    httpStatusCode: 404,
    code: 2008,
  },
  MULTISIG_MESSAGE_NOT_FOUND: {
    message: 'Multisig message not found',
    httpStatusCode: 404,
    code: 2008,
  },
  MULTISIG_INVALID_REQUEST: {
    message: 'Multisig invalid request, params not found',
    httpStatusCode: 404,
    code: 2008,
  },
  MULTISIG_SESSION_COUNTS_INVALID_REQUEST: {
    message: 'Multisig session counts invalid request, params not found',
    httpStatusCode: 404,
    code: 2009,
  },
  BLACKLISTED_ADDRESS: {
    message: 'Address is blacklisted',
    httpStatusCode: 403,
    code: 2010,
  },
};
