import { View, Text, StyleSheet } from "react-native";
import type { BusStatus } from "@/types/bus.types";

const STATUS_CONFIG: Record<BusStatus, { label: string; bg: string; text: string }> = {
  ARRIVING: { label: "Llegando",  bg: "#16A34A", text: "#FFFFFF" },
  ENROUTE:  { label: "En camino", bg: "#D97706", text: "#FFFFFF" },
  FAR:      { label: "Lejos",     bg: "#DC2626", text: "#FFFFFF" },
  NO_DATA:  { label: "Sin datos", bg: "#6B7280", text: "#FFFFFF" },
};

interface StatusBadgeProps {
  status: BusStatus;
}

export default function StatusBadge({ status }: Readonly<StatusBadgeProps>) {
  const config = STATUS_CONFIG[status];
  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      <Text style={[styles.label, { color: config.text }]}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
  },
});
