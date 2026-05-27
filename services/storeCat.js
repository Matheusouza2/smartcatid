import compressImage from "./compressImage";
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default async function storeCat(photoPaths, tutorId) {
  const compressed = await Promise.all(photoPaths.map(compressImage));
  // 1. Pede as URLs pré-assinadas ao Lambda
  console.log(`${API_URL}/auth/login`);
  const urlResponse = await fetch(`${API_URL}/get_upload_urls`, {
    method: "POST",
    headers: { Accept: "application/json" },
  });

  if (!urlResponse.ok) {
    throw new Error("Falha ao obter URLs de upload.");
  }

  const { cat_id, upload_urls, s3_keys } = await urlResponse.json();

  // 2. Faz upload direto para o S3 — sem passar pelo API Gateway
  await Promise.all(
    upload_urls.map((url, i) =>
      fetch(url, {
        method: "PUT",
        body: {
          uri: compressed[i].startsWith("file://")
            ? compressed[i]
            : `file://${compressed[i]}`,
        },
        headers: { "Content-Type": "image/jpeg" },
      }),
    ),
  );

  // 3. Avisa o Lambda para baixar do S3 e processar os embeddings
  const storeResponse = await fetch(`${API_URL}/store_cat`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ cat_id, s3_keys, tutor_id: tutorId }),
  });

  console.log(JSON.stringify({ cat_id, s3_keys, tutor_id: tutorId }));

  if (!storeResponse.ok) {
    throw new Error("Falha ao cadastrar o gato no servidor.");
  }

  return await storeResponse.json();
}
