import { Stack, useRouter, useRootNavigationState } from "expo-router";
import { useEffect } from "react";
import { useAuth } from "@/Contexts/AuthContext";

export default function AuthLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    if (!navigationState?.key || isLoading) return;
    if (isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, navigationState?.key, isLoading]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}
