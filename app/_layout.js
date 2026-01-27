import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="storeCat" options={{ headerShown: false }} />
      <Stack.Screen name="searchCat" options={{ headerShown: false }} />
    </Stack>
  );
}
