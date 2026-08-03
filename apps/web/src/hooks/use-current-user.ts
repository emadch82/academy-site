'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export interface CurrentUser {
  id: string;
  name: string;
  role: string;
  identifier?: string;
}

export function useCurrentUser(): CurrentUser | null {
  const [user, setUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    const raw = Cookies.get('amz_user');
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch {}
    }
  }, []);

  return user;
}
