import { Redirect, Stack } from "expo-router";
import { useAuth } from "@/Contexts/AuthContext";
import { Text } from "react-native";

export default function AppLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  // Se o context estiver lendo o AsyncStorage/Token, mostra uma tela de carregamento rápida
  if (isLoading) {
    return <Text>Carregando...</Text>; 
  }

  // Se NÃO está autenticado, manda de volta para o login de forma segura e declarativa
  if (!isAuthenticated) {
    return <Redirect href="/auth/login" />;
  }

  // Se está autenticado, renderiza a Stack das telas privadas normalmente
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="storeCat" />
       <Stack.Screen name="searchCat" />
       <Stack.Screen name="listCats" />
     </Stack>

  );
}
