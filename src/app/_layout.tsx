import React, { useEffect } from "react";
import { Stack } from "expo-router";
import * as Notifications from "expo-notifications";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  useEffect(() => {
    const sub = Notifications.addNotificationResponseReceivedListener(() => {
      // Navigate to bus list when notification tapped
    });
    return () => sub.remove();
  }, []);

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#1F2937" },
          headerTintColor: "#FFFFFF",
          headerTitleStyle: { fontWeight: "700" },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="(auth)/permissions"
          options={{ title: "Permisos requeridos", headerBackVisible: false }}
        />
        <Stack.Screen
          name="(auth)/role-selection"
          options={{ title: "Selecciona tu rol", headerBackVisible: false }}
        />
        <Stack.Screen
          name="(passenger)"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(driver)"
          options={{ headerShown: false }}
        />
      </Stack>
    </>
  );
}
