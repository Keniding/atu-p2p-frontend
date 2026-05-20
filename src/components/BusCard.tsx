import { View, Text, StyleSheet } from "react-native";
import type { NearbyBus } from "../types/bus.types";
import StatusBadge from "./StatusBadge";

interface BusCardProps {
  bus: NearbyBus;
}

export default function BusCard({ bus }: BusCardProps) {
  const etaMinutes = Math.floor(bus.estimatedArrivalSeconds / 60);
  const etaSeconds = bus.estimatedArrivalSeconds % 60;
  const etaLabel =
    bus.estimatedArrivalSeconds >= 999
      ? "Sin datos"
      : etaMinutes > 0
      ? `${etaMinutes}min ${etaSeconds}s`
      : `${etaSeconds}s`;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.busLine}>{bus.busLine}</Text>
        <StatusBadge status={bus.status} />
      </View>
      <View style={styles.row}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{bus.distanceMeters}m</Text>
          <Text style={styles.statLabel}>Distancia</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{etaLabel}</Text>
          <Text style={styles.statLabel}>ETA</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{Math.round(bus.speed)} km/h</Text>
          <Text style={styles.statLabel}>Velocidad</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  busLine: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  stat: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  statLabel: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 2,
  },
});
