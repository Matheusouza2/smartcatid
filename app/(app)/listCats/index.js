import { useAuth } from "@Contexts/AuthContext";
import { Lucide } from "@react-native-vector-icons/lucide";
import listCats from "@services/listCats";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import "../../../global.css";

export default function ListCats() {
  const router = useRouter();
  const { user } = useAuth();
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        setLoading(true);
        const data = await listCats(user.id);
        console.log(data.data);
        setCats(data.data);
      } catch (e) {
        console.error("Erro ao buscar gatos:", e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchCats();
    }
  }, [user?.id]);

  if (loading) {
    return (
      <View className="items-center justify-center flex-1 bg-shark-900">
        <ActivityIndicator size="large" color="#f9c033" />
        <Text className="mt-4 text-lg text-white">
          Carregando seus gatos...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="items-center justify-center flex-1 px-6 bg-shark-900">
        <Text className="mb-6 text-lg text-center text-red-500">{error}</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="px-6 py-3 bg-primary-400 rounded-xl"
        >
          <Text className="font-bold text-shark-950">Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-shark-900">
      {/* Header */}
      <View className="flex-row items-center justify-between w-full px-6 pb-4 border-b pt-14 border-shark-800">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Lucide name="arrow-left" size={28} color="#f9c033" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-primary-400">Meus Gatos</Text>
        <View className="w-10" />
      </View>

      {cats.length === 0 ? (
        <View className="items-center justify-center flex-1 px-10">
          <Lucide name="cat" size={64} color="#4a4a4a" />
          <Text className="mt-4 text-lg text-center text-shark-400">
            Você ainda não cadastrou nenhum gatinho.
          </Text>
          <TouchableOpacity
            onPress={() => router.push("storeCat")}
            className="px-8 py-3 mt-8 bg-primary-400 rounded-xl"
          >
            <Text className="font-bold text-shark-950">Cadastrar Agora</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={cats}
          keyExtractor={(item) => item.cat_id || item.id.toString()}
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
          renderItem={({ item }) => (
            <View className="p-4 mb-6 shadow-lg bg-shark-800 rounded-2xl">
              <Text className="mb-3 text-lg font-bold text-primary-400">
                Gato #{item.cat_id?.slice(-6) || item.id}
              </Text>
              <View className="flex-row justify-between">
                {item.photos?.map((photoUri, index) => (
                  <View key={index} className="items-center">
                    <Image
                      source={{ uri: photoUri }}
                      className="w-24 h-24 border-2 rounded-lg border-primary-400/50"
                    />
                  </View>
                )) || (
                  <Text className="italic text-shark-400">
                    Sem fotos disponíveis
                  </Text>
                )}
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}
