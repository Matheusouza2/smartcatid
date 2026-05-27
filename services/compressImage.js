import { ImageManipulator, SaveFormat } from "expo-image-manipulator";

export default async function compressImage(uri) {
  const context = ImageManipulator.manipulate(uri);
  context.resize({ width: 1024 }); // mantém proporção automaticamente
  const imageRef = await context.renderAsync();
  const result = await imageRef.saveAsync({
    format: SaveFormat.JPEG,
    compress: 0.85,
  });
  return result.uri;
}
