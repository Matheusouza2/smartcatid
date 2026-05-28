import { useAuth } from "@Contexts/AuthContext";
import { useRouter } from "expo-router";
import Constants from "expo-constants";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Login() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      setError("");
      await login(email, password);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <View className="justify-center flex-1 px-8 bg-shark-900">
        <Text className="mb-2 text-3xl font-bold text-center text-primary-400">
          SmartCatID
        </Text>
        <Text className="mb-10 text-center text-shark-300">
          Faça login para continuar
        </Text>

        {error ? (
          <View className="p-3 mb-4 border border-red-500 rounded-lg bg-red-500/20">
            <Text className="text-sm text-center text-red-400">{error}</Text>
          </View>
        ) : null}

        <TextInput
          className="px-4 py-3 mb-4 text-white border bg-shark-800 rounded-xl border-shark-600"
          placeholder="Email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          className="px-4 py-3 mb-6 text-white border bg-shark-800 rounded-xl border-shark-600"
          placeholder="Senha"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          onPress={handleLogin}
          disabled={isLoading}
          className="items-center py-4 mb-4 bg-primary-400 rounded-xl"
        >
          {isLoading ? (
            <ActivityIndicator color="#212121" />
          ) : (
            <Text className="text-lg font-bold text-shark-950">Entrar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/auth/register")}
          className="items-center"
        >
          <Text className="text-shark-400">
            Não tem conta?{" "}
            <Text className="font-semibold text-primary-400">Cadastre-se</Text>
          </Text>
        </TouchableOpacity>

        <Text className="absolute text-xs text-center text-shark-600 bottom-6 left-0 right-0">
          v{Constants.expoConfig?.version || "1.0.0"}
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}
