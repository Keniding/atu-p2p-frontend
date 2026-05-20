import { Text } from "react-native";
import { Tabs } from "expo-router";

export default function PassengerLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { backgroundColor: "#1F2937", borderTopColor: "#374151" },
        tabBarActiveTintColor: "#2563EB",
        tabBarInactiveTintColor: "#6B7280",
        headerStyle: { backgroundColor: "#1F2937" },
        headerTintColor: "#FFFFFF",
        headerTitleStyle: { fontWeight: "700" },
      }}
    >
      <Tabs.Screen
        name="map"
        options={{
          title: "Mapa",
          tabBarLabel: "Mapa",
          tabBarIcon: ({ color }) => <TabIcon emoji="🗺️" color={color} />,
        }}
      />
      <Tabs.Screen
        name="bus-list"
        options={{
          title: "Buses cercanos",
          tabBarLabel: "Buses",
          tabBarIcon: ({ color }) => <TabIcon emoji="🚌" color={color} />,
        }}
      />
      <Tabs.Screen
        name="line-select"
        options={{
          title: "Seleccionar linea",
          tabBarLabel: "Linea",
          tabBarIcon: ({ color }) => <TabIcon emoji="🛣️" color={color} />,
        }}
      />
    </Tabs>
  );
}

function TabIcon({ emoji, color }: Readonly<{ emoji: string; color: string }>) {
  return (
    <Text style={{ fontSize: 20, opacity: color === "#2563EB" ? 1 : 0.5 }}>
      {emoji}
    </Text>
  );
}
