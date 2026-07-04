declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userRole?: string;
      validatedQuery?: Record<string, unknown>;
      validatedBody?: Record<string, unknown>;
    }
  }
}

export {};