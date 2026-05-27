const API_URL = process.env.EXPO_PUBLIC_API_URL;
import compressImage from "./compressImage";

export default async function validateCat(photoPath) {
  const compressed = await compressImage(photoPath);

  const formData = new FormData();

  formData.append("file", {
    uri: compressed.startsWith("file://") ? compressed : `file://${compressed}`,
    type: "image/jpeg",
    name: "upload.jpg",
  });

  try {
    console.log(`${API_URL}/auth/login`);
    const response = await fetch(`${API_URL}/validate_image`, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    });

    console.log(API_URL);

    if (!response.ok) {
      console.error("Resposta do servidor ao validar:", await response.text());
      throw new Error("Falha ao validar a imagem no servidor.");
    }

    return await response.json();
  } catch (err) {
    console.error("Erro na conexão com FastAPI ao validar:", err);
    throw err;
  }
}
