import { Slot } from "expo-router";
import { AuthProvider } from "@/Contexts/AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Slot /> 
    </AuthProvider>
  );
}
