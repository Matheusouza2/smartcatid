import { DetectionFeedbackModal } from "@components/DetectionFeedbackModal";
import { useAuth } from "@Contexts/AuthContext";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import storeCat from "@services/storeCat";
import validateCat from "@services/validateCat";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const PHASE = {
  CAMERA: "camera",
  DETECTING: "detecting",
  SENDING: "sending",
};

const REQUIRED_PHOTOS = 3;

export default function StoreCat() {
  const { user } = useAuth();
  const [expoCameraPermission, requestExpoCameraPermission] =
    useCameraPermissions();
  const cameraRef = useRef(null);

  const [phase, setPhase] = useState(PHASE.CAMERA);
  const [validPhotos, setValidPhotos] = useState([]);

  const photosLeft = REQUIRED_PHOTOS - validPhotos.length;
  const allCaptured = validPhotos.length >= REQUIRED_PHOTOS;

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

  const onDetectionResult = useCallback(
    ({ isCat, confidence }, uri) => {
      if (isCat) {
        setValidPhotos((prev) => [...prev, uri]);
        setPhase(PHASE.CAMERA);

        if (validPhotos.length + 1 < REQUIRED_PHOTOS) {
          showModal({
            type: "success",
            title: `Foto ${validPhotos.length + 1} adicionada!`,
            message: `Gato detectado com ${confidence.toFixed(1)}% de confiança.\n\nAinda faltam ${REQUIRED_PHOTOS - validPhotos.length - 1} foto(s).`,
            confirmLabel: "Continuar",
          });
        }
      } else {
        setPhase(PHASE.CAMERA);
        showModal({
          type: "error",
          title: "Foto inválida",
          message: `Nenhum rosto de gato detectado.\n\nConfiança: ${confidence.toFixed(1)}%\n\nPosicione o rosto do gato no centro e tente novamente.`,
          confirmLabel: "Tentar novamente",
        });
      }
    },
    [validPhotos.length, showModal],
  );

  const processImage = async (uri) => {
    try {
      setPhase(PHASE.DETECTING);
      const result = await validateCat(uri);
      onDetectionResult(result, uri);
    } catch (e) {
      console.error("Erro na validação:", e);
      setPhase(PHASE.CAMERA);
      showModal({
        type: "error",
        title: "Erro de conexão",
        message: "Não foi possível validar a imagem com o servidor.",
        confirmLabel: "OK",
      });
    }
  };

  const handleCapture = useCallback(async () => {
    if (!cameraRef.current || phase !== PHASE.CAMERA || allCaptured) return;
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7,
        skipProcessing: true,
      });
      await processImage(photo.uri);
    } catch (e) {
      setPhase(PHASE.CAMERA);
    }
  }, [phase, allCaptured]);

  const handlePickImage = useCallback(async () => {
    if (phase !== PHASE.CAMERA || allCaptured) return;
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) {
      showModal({
        type: "error",
        title: "Permissão negada",
        message: "Permissão necessária.",
        confirmLabel: "OK",
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) await processImage(result.assets[0].uri);
  }, [phase, allCaptured]);

  const handleSend = useCallback(async () => {
    hideModal();
    setPhase(PHASE.SENDING);
    try {
      await storeCat(validPhotos, user.id);

      showModal({
        type: "success",
        title: "Gato cadastrado!",
        message:
          "As 3 fotos foram enviadas com sucesso. O gato foi registrado no sistema.",
        confirmLabel: "Ótimo!",
        onConfirm: reset,
      });
    } catch (e) {
      console.error("Erro ao enviar:", e);
      setPhase(PHASE.CAMERA);
      showModal({
        type: "error",
        title: "Erro",
        message: "Erro ao cadastrar, verifique as imagens e tente novamente.",
        confirmLabel: "Tentar novamente",
        onConfirm: handleSend,
      });
    }
  }, [validPhotos, showModal, hideModal]);

  const removePhoto = useCallback(
    (index) => setValidPhotos((prev) => prev.filter((_, i) => i !== index)),
    [],
  );
  const reset = useCallback(() => {
    hideModal();
    setValidPhotos([]);
    setPhase(PHASE.CAMERA);
  }, [hideModal]);

  if (!expoCameraPermission?.granted)
    return (
      <View className="justify-center flex-1 bg-shark-900">
        <ActivityIndicator color="#f9c033" />
      </View>
    );

  return (
    <View className="flex-1 bg-shark-900">
      <CameraView
        ref={cameraRef}
        style={{ flex: 1, width: "100%" }}
        facing="back"
        active={phase === PHASE.CAMERA}
      />

      {phase === PHASE.DETECTING && (
        <View className="absolute inset-0 z-20 items-center justify-center bg-black/75">
          <ActivityIndicator size="large" color="#f9c033" />
          <Text className="mt-4 text-lg font-semibold text-white">
            Verificando imagem...
          </Text>
        </View>
      )}

      {phase === PHASE.SENDING && (
        <View className="absolute inset-0 z-20 items-center justify-center bg-black/75">
          <ActivityIndicator size="large" color="#f9c033" />
          <Text className="mt-4 text-lg font-semibold text-white">
            Cadastrando gato...
          </Text>
        </View>
      )}

      {phase === PHASE.CAMERA && (
        <View className="absolute left-0 right-0 z-10 items-center px-6 top-14">
          <View className="px-5 py-2 rounded-full bg-black/60">
            <Text className="text-sm font-bold text-white">
              {allCaptured
                ? "✅ 3 fotos prontas!"
                : `📸 Foto ${validPhotos.length + 1} de ${REQUIRED_PHOTOS}`}
            </Text>
          </View>
        </View>
      )}

      {validPhotos.length > 0 && phase === PHASE.CAMERA && (
        <View className="absolute left-0 right-0 z-10 px-4 bottom-44">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {validPhotos.map((uri, index) => (
              <View key={index} className="relative mr-3">
                <Image
                  source={{ uri }}
                  className="w-16 h-16 border-2 rounded-lg border-primary-400"
                />
                <TouchableOpacity
                  onPress={() => removePhoto(index)}
                  className="absolute items-center justify-center w-5 h-5 bg-red-500 rounded-full -top-2 -right-2"
                >
                  <Text className="text-xs font-bold text-white">✕</Text>
                </TouchableOpacity>
              </View>
            ))}
            {Array.from({ length: photosLeft }).map((_, i) => (
              <View
                key={`empty-${i}`}
                className="items-center justify-center w-16 h-16 mr-3 border-2 border-dashed rounded-lg border-shark-600"
              >
                <Text className="text-2xl text-shark-500">+</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {phase === PHASE.CAMERA && !allCaptured && (
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

      {phase === PHASE.CAMERA && allCaptured && (
        <View className="absolute z-10 flex-row gap-4 bottom-16 left-6 right-6">
          <TouchableOpacity
            onPress={reset}
            className="items-center flex-1 py-4 bg-shark-600 rounded-xl"
          >
            <Text className="font-bold text-white">Recomeçar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSend}
            className="items-center flex-1 py-4 bg-primary-400 rounded-xl"
          >
            <Text className="font-bold text-shark-950">Cadastrar gato</Text>
          </TouchableOpacity>
        </View>
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
