import compressImage from "./compressImage";
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default async function searchCat(photoPath) {
  const compressed = await compressImage(photoPath);

  const formData = new FormData();

  formData.append("file", {
    uri: compressed.startsWith("file://") ? compressed : `file://${compressed}`,
    type: "image/jpeg",
    name: "upload.jpg",
  });

  try {
    const response = await fetch(`${API_URL}/process_image`, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    });

    const responseJson = await response.json();

    return responseJson;
  } catch (err) {
    console.error("Erro na conexão com FastAPI:", err);
    throw err;
  }
}
