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
};
