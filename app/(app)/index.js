import { FontAwesome6 } from "@react-native-vector-icons/fontawesome6";
import { Lucide } from "@react-native-vector-icons/lucide";
import { Text, TouchableOpacity, View } from "react-native";
import { useEffect } from "react";

import { useRouter } from "expo-router";
import { useCameraPermissions } from "expo-camera";

import { useAuth } from "@Contexts/AuthContext";
import "../../global.css";

export default function Index() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [, requestPermission] = useCameraPermissions();

  useEffect(() => {
    requestPermission();
  }, []); 

  return (
    <View className="items-center flex-1 bg-shark-900 pt-14">
      <View className="flex-row items-center justify-between w-full px-6">
        <Text className="text-xl font-bold text-primary-400">SmartCatID</Text>
        <TouchableOpacity onPress={logout} className="px-4 py-2 rounded-lg bg-shark-800">
          <Text className="text-sm font-semibold text-shark-400">Sair</Text>
        </TouchableOpacity>
      </View>

      <View className="justify-center flex-1 w-screen gap-10 px-10 mt-8">
        <TouchableOpacity
          className="flex-row items-center gap-10 p-3 rounded-lg bg-shark-100"
          onPress={() => router.push("storeCat")}
        >
          <View className="items-center p-3 rounded-lg bg-shark-400">
            <FontAwesome6
              name="cat"
              size={32}
              color="#f9c033"
              iconStyle="solid"
            />
          </View>
          <Text className="text-shark-950">Cadastrar novo gato</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center gap-10 p-3 rounded-lg bg-shark-100"
          onPress={() => router.push("searchCat")}
        >
          <View className="items-center p-3 rounded-lg bg-shark-400">
            <Lucide name="scan-line" size={32} color="#f9c033" />
          </View>
          <Text className="text-shark-950">Buscar gato</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center gap-10 p-3 rounded-lg bg-shark-100"
          onPress={() => router.push("listCats")}
        >
          <View className="items-center p-3 rounded-lg bg-shark-400">
            <Lucide name="list" size={32} color="#f9c033" />
          </View>
          <Text className="text-shark-950">Meus Gatos</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
