import { DetectionFeedbackModal } from "@components/DetectionFeedbackModal";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import searchCat from "@services/searchCat";
import { CameraView } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const PHASE = {
  CAMERA: "camera",
  SEARCHING: "searching",
};

export default function SearchCat() {
  const cameraRef = useRef(null);

  const [phase, setPhase] = useState(PHASE.CAMERA);

  const [modal, setModal] = useState({
    visible: false,
    type: "error",
    title: "",
    message: "",
    onConfirm: null,
    confirmLabel: "OK",
  });

  const showModal = useCallback(
    (opts) => setModal({ visible: true, ...opts }),
    [],
  );
  const hideModal = useCallback(
    () => setModal((prev) => ({ ...prev, visible: false })),
    [],
  );

  const processSearch = async (uri) => {
    try {
      setPhase(PHASE.SEARCHING);
      console.log(uri)
      const result = await searchCat(uri);

      // Adaptar conforme o retorno real da sua API
      if (result && result.data?.cat_id) {
        showModal({
          type: "success",
          title: "Gato Encontrado!",
          message: `Encontramos o gato no banco de dados.\nID: ${result.data.cat_id}`,
          confirmLabel: "OK",
          onConfirm: () => {
            hideModal();
            setPhase(PHASE.CAMERA);
          },
        });
      } else {
        console.log("Resposta do servidor:", result.detail);
        showModal({
          type: "error",
          title: "Não encontrado",
          message: result.detail,
          confirmLabel: "Tentar novamente",
          onConfirm: () => {
            hideModal();
            setPhase(PHASE.CAMERA);
          },
        });
      }
    } catch (e) {
      console.error("Erro na busca:", e);
      setPhase(PHASE.CAMERA);
      showModal({
        type: "error",
        title: "Erro de conexão",
        message: "Não foi possível realizar a busca.",
        confirmLabel: "OK",
      });
    }
  };

  const handleCapture = useCallback(async () => {
    if (!cameraRef.current || phase !== PHASE.CAMERA) return;
    try {
      const photo = await cameraRef.current?.takePictureAsync();

      const uri = photo.uri.startsWith("file://")
        ? photo.uri
        : `file://${photo.uri}`;
      await processSearch(uri);
    } catch (e) {
      setPhase(PHASE.CAMERA);
    }
  }, [phase]);

  const handlePickImage = useCallback(async () => {
    if (phase !== PHASE.CAMERA) return;
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) await processSearch(result.assets[0].uri);
  }, [phase]);

  const reset = () => {
    hideModal();
    setPhase(PHASE.CAMERA);
  };

  return (
    <View className="flex-1 bg-shark-900">
      <CameraView
        ref={cameraRef}
        style={{ flex: 1, width: "100%" }}
        facing="back"
        active={phase === PHASE.CAMERA}
      />

      {phase === PHASE.SEARCHING && (
        <View className="absolute inset-0 z-20 items-center justify-center bg-black/75">
          <ActivityIndicator size="large" color="#f9c033" />
          <Text className="mt-4 text-lg font-semibold text-white">
            Buscando no banco de dados...
          </Text>
        </View>
      )}

      {phase === PHASE.CAMERA && (
        <>
          <View className="absolute z-10 top-14 left-5">
            <TouchableOpacity onPress={reset}>
              <FontAwesome name="times" size={32} color="#f9c033" />
            </TouchableOpacity>
          </View>
          <View className="absolute z-10 items-center w-full bottom-16">
            <TouchableOpacity
              onPress={handleCapture}
              className="items-center justify-center w-20 h-20 border-4 border-white rounded-full bg-white/30"
            >
              <View className="bg-white rounded-full h-14 w-14" />
            </TouchableOpacity>
          </View>
          <View className="absolute z-10 bottom-16 right-5">
            <TouchableOpacity
              onPress={handlePickImage}
              className="items-center justify-center w-16 h-16 border-4 border-white rounded-xl bg-white/30"
            >
              <FontAwesome6
                name="image"
                size={28}
                color="#fff"
                iconStyle="solid"
              />
            </TouchableOpacity>
          </View>
        </>
      )}

      <DetectionFeedbackModal
        visible={modal.visible}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onDismiss={hideModal}
        onConfirm={modal.onConfirm}
        confirmLabel={modal.confirmLabel}
      />
    </View>
  );
}
