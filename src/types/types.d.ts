export {};

declare global {
  namespace Express {
    interface Request {
      user: {
        uid: string,
        email: string,
        emailVerified: boolean,
        displayName: string,
        phoneNumber: string,
      };
    }
  }
}