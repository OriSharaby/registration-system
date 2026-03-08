const API_BASE_URL =
  "https://registration-api-cshcbxfrfjfhdaha.westeurope-01.azurewebsites.net";

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


async function parseResponse(response: Response): Promise<AuthResponse> {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      (data as any).detail || (data as any).message || "Request failed"
    );
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