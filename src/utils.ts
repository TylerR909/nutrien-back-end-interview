export const fail = (err: string): never => {
  throw new Error(err);
};
