import { Text } from "react-native";
import { Tabs } from "expo-router";

const ACTIVE_COLOR = "#2563EB";

function makeTabIcon(emoji: string) {
  return function TabIconComponent({ color }: Readonly<{ color: string }>) {
    return (
      <Text style={{ fontSize: 20, opacity: color === ACTIVE_COLOR ? 1 : 0.5 }}>
        {emoji}
      </Text>
    );
  };
}

const MapTabIcon = makeTabIcon("🗺️");
const BusTabIcon = makeTabIcon("🚌");
const LineTabIcon = makeTabIcon("🛣️");

export default function PassengerLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { backgroundColor: "#1F2937", borderTopColor: "#374151" },
        tabBarActiveTintColor: ACTIVE_COLOR,
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
          tabBarIcon: MapTabIcon,
        }}
      />
      <Tabs.Screen
        name="bus-list"
        options={{
          title: "Buses cercanos",
          tabBarLabel: "Buses",
          tabBarIcon: BusTabIcon,
        }}
      />
      <Tabs.Screen
        name="line-select"
        options={{
          title: "Seleccionar linea",
          tabBarLabel: "Linea",
          tabBarIcon: LineTabIcon,
        }}
      />
    </Tabs>
  );
}
