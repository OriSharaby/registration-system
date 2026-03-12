const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export type RegisterPayload = {
    name: string;
    email: string;
    password: string;
};

export type LoginPayload = {
    email: string;
    password: string;
};

export type AuthResponse = {
    ok?: boolean;
    message?: string;
    token?: string;
    toast?: string;
    user?: {
        id: string;
        name: string;
        email: string;
    };
};

type FastAPIValidationError = {
  type: string;
  loc: (string | number)[];
  msg: string;
  input?: unknown;
  ctx?: Record<string, unknown>;
};

type ErrorResponse = {
  detail?: string | FastAPIValidationError[];
  message?: string;
};

async function parseResponse(response: Response) {
  const data: ErrorResponse = await response.json();

  if (!response.ok) {
    if (Array.isArray(data.detail)) {
      const message = data.detail
        .map((err) => {
          const field = err.loc?.[err.loc.length - 1];
          return field ? `${field}: ${err.msg}` : err.msg;
        })
        .join(", ");

      throw new Error(message);
    }

    throw new Error(data.detail || data.message || "Request failed");
  }

  return data;
}

export async function registerUser(
    payload: RegisterPayload
): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    return parseResponse(response);
}

export async function loginUser(
    payload: LoginPayload
): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    return parseResponse(response);
}