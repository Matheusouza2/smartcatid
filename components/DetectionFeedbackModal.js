import { useEffect, useRef } from "react";
import { Animated, Modal, Text, TouchableOpacity, View } from "react-native";

/**
 * Modal animado para feedback de detecção do gato.
 *
 * Props:
 *  visible    — booleano
 *  type       — "success" | "error"
 *  title      — título do modal
 *  message    — mensagem de detalhe
 *  onDismiss  — callback ao fechar
 *  onConfirm  — (opcional) callback do botão de confirmação
 *  confirmLabel — label do botão de confirmação (default "OK")
 */
export function DetectionFeedbackModal({
  visible,
  type = "error",
  title,
  message,
  onDismiss,
  onConfirm,
  confirmLabel = "OK",
}) {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0.8);
      opacityAnim.setValue(0);
    }
  }, [visible]);

  const isSuccess = type === "success";

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      statusBarTranslucent
      onRequestClose={onDismiss}
    >
      {/* Backdrop */}
      <View className="flex-1 justify-center items-center bg-black/60 px-8">
        <Animated.View
          style={{ transform: [{ scale: scaleAnim }], opacity: opacityAnim }}
          className="w-full bg-shark-800 rounded-2xl overflow-hidden"
        >
          {/* Faixa colorida no topo */}
          <View
            className={`h-1.5 w-full ${isSuccess ? "bg-primary-400" : "bg-red-500"}`}
          />

          <View className="p-6 items-center">
            {/* Ícone */}
            <View
              className={`w-16 h-16 rounded-full items-center justify-center mb-4 ${
                isSuccess ? "bg-primary-400/20" : "bg-red-500/20"
              }`}
            >
              <Text className="text-3xl">{isSuccess ? "🐱" : "🔍"}</Text>
            </View>

            {/* Título */}
            <Text
              className={`text-lg font-bold mb-2 text-center ${
                isSuccess ? "text-primary-400" : "text-red-400"
              }`}
            >
              {title}
            </Text>

            {/* Mensagem */}
            <Text className="text-shark-300 text-sm text-center leading-5 mb-6">
              {message}
            </Text>

            {/* Botões */}
            <View className="flex-row gap-3 w-full">
              {onConfirm && (
                <TouchableOpacity
                  onPress={onDismiss}
                  className="flex-1 bg-shark-600 py-3 rounded-xl items-center"
                >
                  <Text className="text-white font-semibold">Cancelar</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={onConfirm ?? onDismiss}
                className={`flex-1 py-3 rounded-xl items-center ${
                  isSuccess ? "bg-primary-400" : "bg-red-500"
                }`}
              >
                <Text
                  className={`font-bold ${
                    isSuccess ? "text-shark-950" : "text-white"
                  }`}
                >
                  {confirmLabel}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
