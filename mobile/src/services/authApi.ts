const API_BASE_URL = process.env.API_BASE_URL;

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

type AuthErrorResponse = {
  detail?: string | FastAPIValidationError[];
  message?: string;
};

async function parseResponse(response: Response): Promise<AuthResponse> {
  const data: AuthResponse | AuthErrorResponse = await response
    .json()
    .catch(() => ({}));

  if (!response.ok) {
    if ("detail" in data && Array.isArray(data.detail)) {
      const message = data.detail
        .map((err) => {
          const field = err.loc[err.loc.length - 1];
          return `${String(field)}: ${err.msg}`;
        })
        .join(", ");

      throw new Error(message || "Request failed");
    }

    if ("detail" in data && typeof data.detail === "string") {
      throw new Error(data.detail);
    }

    if ("message" in data && typeof data.message === "string") {
      throw new Error(data.message);
    }

    throw new Error("Request failed");
  }

  return data as AuthResponse;
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