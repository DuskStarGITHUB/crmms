// token.ts
export type AuthData = {
  account: {
    id: number;
    email: string;
    role: string;
  };
  user: {
    id: number;
    first_name: string;
    last_name: string;
    phone?: string | null;
    address?: string | null;
  };
  payload: {
    sub: number;
    role: string;
    iat: number;
    exp: number;
  };
};

export async function fetchAuthData(token: string): Promise<AuthData | null> {
  try {
    const res = await fetch("http://localhost:3000/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.success) return null;
    const { account, user, payload } = data;
    return {
      account,
      user,
      payload,
    };
  } catch (err) {
    console.error("Error fetching auth data:", err);
    return null;
  }
}
