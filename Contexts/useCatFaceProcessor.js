import { useTensorflowModel } from "react-native-fast-tflite";
import { useSharedValue } from "react-native-reanimated";
import { useFrameProcessor } from "react-native-vision-camera";
import { useResizePlugin } from "vision-camera-resize-plugin";

export function useCatFaceProcessor() {
  const { resize } = useResizePlugin();
  const objectDetection = useTensorflowModel(
    require("./catFaceDetector_int8.tflite"),
  );
  const model =
    objectDetection.state === "loaded" ? objectDetection.model : undefined;

  const frameCounter = useSharedValue(0);

  return useFrameProcessor(
    (frame) => {
      "worklet";

      // 1. Verificação rápida: se não tem modelo, não faz nada
      if (model == null) return;

      frameCounter.value += 1;
      if (frameCounter.value % 3 !== 0) return;

      // 2. Redimensionamento direto para Float32 (evita cast manual lento)
      const data = resize(frame, {
        scale: { width: 320, height: 320 },
        pixelFormat: "rgb",
        dataType: "float32",
      });

      // 3. Execução
      try {
        const output = model.runSync([data]);
        // Apenas logue se necessário, console.log em excesso no Worklet trava o Android
        if (output && output.length > 0) {
          const numDetections = output[0];
          console.log(`Gatos: ${numDetections}`);
        }
      } catch (e) {
        console.log("Erro na inferência:", e);
      }
    },
    [model],
  ); // Remova o resize das dependências se ele for estável
}
