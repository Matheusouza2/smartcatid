const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default async function listCats(tutorId) {
  const response = await fetch(`${API_URL}/get_tutor_cats`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ tutor_id: tutorId }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "Falha ao buscar gatos.");
  }

  return await response.json();
}
