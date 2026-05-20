import React from "react";
import { Stack } from "expo-router";

export default function DriverLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#1F2937" },
        headerTintColor: "#FFFFFF",
        headerTitleStyle: { fontWeight: "700" },
      }}
    >
      <Stack.Screen name="dashboard" options={{ title: "Panel del chofer" }} />
      <Stack.Screen name="broadcast" options={{ title: "Control de transmision" }} />
    </Stack>
  );
}
