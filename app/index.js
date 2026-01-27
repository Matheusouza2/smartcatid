import { FontAwesome6 } from "@react-native-vector-icons/fontawesome6";
import { Lucide } from "@react-native-vector-icons/lucide";
import { Text, TouchableOpacity, View } from "react-native";

import { useRouter } from "expo-router";
import "../global.css";

export default function Index() {
  const router = useRouter();

  return (
    <View className="flex-1 items-center bg-shark-900 pt-14">
      <Text className="text-xl font-bold text-primary-400">SmartCatID</Text>

      <View className="flex-1 justify-center mt-8 gap-10 w-screen px-10">
        <TouchableOpacity className="flex-row bg-shark-100 items-center rounded-lg p-3 gap-10">
          <View className="items-center bg-shark-400 p-3 rounded-lg">
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
          className="flex-row bg-shark-100 items-center rounded-lg p-3 gap-10"
          onPress={() => router.push("searchCat")}
        >
          <View className="items-center bg-shark-400 p-3 rounded-lg">
            <Lucide name="scan-line" size={32} color="#f9c033" />
          </View>
          <Text className="text-shark-950">Buscar gato</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
