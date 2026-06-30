declare namespace Express {
  interface Request {
    user?: {
      id: string;
      email: string;
      mobile: string;
      role: string;
      isActive: boolean;
      fullName: string;
      avatarUrl?: string;
    };
  }

  interface Response {
    ok<T>(data: T, message?: string): this;
    okPaginated<T>(result: { items: T[]; meta: { page: number; limit: number; total: number; totalPages: number } }, message?: string): this;
    created<T>(data: T, message?: string): this;
    noContent(): this;
  }
}
