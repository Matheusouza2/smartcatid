import { FontAwesome } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { Camera, useCameraDevices } from "react-native-vision-camera";
import { useCameraPermission } from "../../Contexts/useCameraPermission";
import { useCatFaceProcessor } from "../../Contexts/useCatFaceProcessor";

export default function CatCamera() {
  const cameraPermission = useCameraPermission();
  console.log("Camera permission status:", cameraPermission);
  const devices = useCameraDevices();
  const device = devices.find((d) => d.position === "back");

  const frameProcessor = useCatFaceProcessor((output) => {
    
  });

  if (cameraPermission === "pending") {
    return (
      <View>
        <Text>Aguardando resposta da camera</Text>
      </View>
    );
  }
  console.log("Camera permission:", cameraPermission);
  if (cameraPermission !== "granted") {
    return <Text>Permissão de câmera negada</Text>;
  }

  if (!device) {
    return (
      <View>
        <Text>Nenhum dispositivo encontrado, ou permissão não concedida</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center items-center">
      <Camera
        style={{ flex: 1, width: "100%" }}
        device={device}
        isActive={cameraPermission === "granted"}
        pixelFormat="yuv"
        frameProcessor={frameProcessor}
        frameProcessorFps={3}
      />

      <View className="absolute top-10 left-5">
        <TouchableOpacity>
          <FontAwesome
            name="times"
            size={32}
            iconStyle="light"
            color="#f9c033"
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  /* const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotate, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      { resetBeforeIteration: false }
    ).start();
  }, []);

  const spinCounterClockWise = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const spinClockWise = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["360deg", "0deg"],
  });

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-center mb-4">
          Para que o escaneamento funcione, precisamos da sua permissão para
          acessar a câmera.
        </Text>
        <TouchableOpacity
          onPress={setPermission}
          className="bg-primary-400 px-6 py-3 rounded-lg"
        >
          <Text className="text-white font-bold">Permitir Camera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center">
      <CameraView style={{ flex: 1 }} facing="back" />

      <View className="absolute top-10 left-5">
        <TouchableOpacity>
          <FontAwesome
            name="times"
            size={32}
            iconStyle="light"
            color="#f9c033"
          />
        </TouchableOpacity>
      </View>

      <View className="absolute top-0 left-0 right-0 bottom-0 justify-center items-center">
        <View className="h-72 w-72 bg-shark-100/50 rounded-full" />
        <Animated.View
          style={{ transform: [{ rotate: spinCounterClockWise }] }}
          className="absolute w-96 h-96 border-4 border-primary-400 border-t-transparent rounded-full"
        />

        <Animated.View
          style={{ transform: [{ rotate: spinClockWise }] }}
          className="absolute w-80 h-80 border-4 border-primary-400 border-t-transparent rounded-full"
        />
      </View>
    </View>
  ); */
}
