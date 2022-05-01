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
    message: 'You dont have sccess to this scope',
    httpStatusCode: 403,
    code: 1001,
  },
  SCOPE_NOT_FOUND: {
    message: 'Invalid scope',
    httpStatusCode: 403,
    code: 1001,
  },

};
