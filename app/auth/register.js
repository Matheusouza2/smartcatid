import { useAuth } from "@Contexts/AuthContext";
import { useRouter } from "expo-router";
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

export default function Register() {
  const router = useRouter();
  const { register, isLoading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !phone.trim() || !address.trim() || !password.trim()) {
      setError("Preencha todos os campos");
      return;
    }
    try {
      setError("");
      await register(name, email, password, phone, address);
      router.push("/")
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
          Cadastre-se como tutor
        </Text>

        {error ? (
          <View className="p-3 mb-4 border border-red-500 rounded-lg bg-red-500/20">
            <Text className="text-sm text-center text-red-400">{error}</Text>
          </View>
        ) : null}

        <TextInput
          className="px-4 py-3 mb-4 text-white border bg-shark-800 rounded-xl border-shark-600"
          placeholder="Nome completo"
          placeholderTextColor="#888"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />

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
          className="px-4 py-3 mb-4 text-white border bg-shark-800 rounded-xl border-shark-600"
          placeholder="Telefone"
          placeholderTextColor="#888"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        <TextInput
          className="px-4 py-3 mb-6 text-white border bg-shark-800 rounded-xl border-shark-600"
          placeholder="Endereço"
          placeholderTextColor="#888"
          value={address}
          onChangeText={setAddress}
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
          onPress={handleRegister}
          disabled={isLoading}
          className="items-center py-4 mb-4 bg-primary-400 rounded-xl"
        >
          {isLoading ? (
            <ActivityIndicator color="#212121" />
          ) : (
            <Text className="text-lg font-bold text-shark-950">Cadastrar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/auth/login")}
          className="items-center"
        >
          <Text className="text-shark-400">
            Já tem conta?{" "}
            <Text className="font-semibold text-primary-400">Faça login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
