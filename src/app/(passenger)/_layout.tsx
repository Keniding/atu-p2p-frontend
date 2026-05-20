import { Text } from "react-native";
import { Tabs } from "expo-router";
import type { TextStyle, ViewStyle } from "react-native";

interface TabIconProps {
  readonly emoji: string;
  readonly color: string;
}

interface IconColorProps {
  readonly color: string;
}

const ACTIVE_COLOR = "#2563EB";

const TAB_BAR_STYLE: ViewStyle = {
  backgroundColor: "#1F2937",
  borderTopColor: "#374151",
};

const HEADER_STYLE: ViewStyle = {
  backgroundColor: "#1F2937",
};

const HEADER_TITLE_STYLE: TextStyle = {
  fontWeight: "700",
};

const SCREEN_OPTIONS = {
  tabBarStyle: TAB_BAR_STYLE,
  tabBarActiveTintColor: ACTIVE_COLOR,
  tabBarInactiveTintColor: "#6B7280",
  headerStyle: HEADER_STYLE,
  headerTintColor: "#FFFFFF",
  headerTitleStyle: HEADER_TITLE_STYLE,
};

const MAP_EMOJI = "🗺️";
const BUS_EMOJI = "🚌";
const LINE_EMOJI = "🛣️";

const TAB_ICON_BASE_STYLE: TextStyle = {
  fontSize: 20,
};

function getTabIconStyle(color: string): TextStyle {
  return {
    ...TAB_ICON_BASE_STYLE,
    opacity: color === ACTIVE_COLOR ? 1 : 0.5,
  };
}

function TabIcon(props: Readonly<TabIconProps>) {
  const iconStyle = getTabIconStyle(props.color);
  return <Text style={iconStyle}>{props.emoji}</Text>;
}

function MapIcon(props: Readonly<IconColorProps>) {
  return <TabIcon emoji={MAP_EMOJI} color={props.color} />;
}

function BusIcon(props: Readonly<IconColorProps>) {
  return <TabIcon emoji={BUS_EMOJI} color={props.color} />;
}

function LineIcon(props: Readonly<IconColorProps>) {
  return <TabIcon emoji={LINE_EMOJI} color={props.color} />;
}

const MAP_OPTIONS = {
  title: "Mapa",
  tabBarLabel: "Mapa",
  tabBarIcon: MapIcon,
};

const BUS_LIST_OPTIONS = {
  title: "Buses cercanos",
  tabBarLabel: "Buses",
  tabBarIcon: BusIcon,
};

const LINE_SELECT_OPTIONS = {
  title: "Seleccionar linea",
  tabBarLabel: "Linea",
  tabBarIcon: LineIcon,
};

export default function PassengerLayout() {
  return (
    <Tabs screenOptions={SCREEN_OPTIONS}>
      <Tabs.Screen name="map" options={MAP_OPTIONS} />
      <Tabs.Screen name="bus-list" options={BUS_LIST_OPTIONS} />
      <Tabs.Screen name="line-select" options={LINE_SELECT_OPTIONS} />
    </Tabs>
  );
}
