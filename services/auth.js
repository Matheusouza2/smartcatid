const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function loginTutor(email, password) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "Erro ao fazer login");
  }

  return response.json();
}

export async function registerTutor(name, email, password, phone, address) {
  console.log(`${API_URL}/auth/login`);
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, phone, address }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    console.log(error);
    throw new Error(error.detail || "Erro ao cadastrar");
  }

  return response.json();
}
