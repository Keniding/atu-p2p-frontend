import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Switch } from "react-native";
import { useBackgroundLocation } from "../../hooks/useBackgroundLocation";
import { LIMA_BUS_LINES_FULL } from "../../constants/lines";
import LineSelector from "../../components/LineSelector";

export default function BroadcastScreen() {
  const [selectedLine, setSelectedLine] = useState(LIMA_BUS_LINES_FULL[0].id);
  const { isTracking, lastLocation, startTracking, stopTracking, error } =
    useBackgroundLocation();

  const speed = lastLocation
    ? Math.round((lastLocation.coords.speed ?? 0) * 3.6)
    : 0;

  return (
    <View style={styles.container}>
      <View style={styles.statusSection}>
        <View style={[styles.statusDot, isTracking ? styles.dotActive : styles.dotInactive]} />
        <Text style={styles.statusText}>
          {isTracking ? "Transmitiendo GPS" : "Transmision detenida"}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Linea que transitas</Text>
        <LineSelector
          lines={LIMA_BUS_LINES_FULL}
          selected={selectedLine}
          onSelect={setSelectedLine}
        />
      </View>

      {lastLocation && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Ultima ubicacion</Text>
          <Text style={styles.coordText}>
            {lastLocation.coords.latitude.toFixed(6)}, {lastLocation.coords.longitude.toFixed(6)}
          </Text>
          <Text style={styles.speedText}>{speed} km/h</Text>
        </View>
      )}

      {error && (
        <View style={styles.errorCard}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <View style={styles.controlCard}>
        <Text style={styles.controlLabel}>Transmision de background</Text>
        <Switch
          value={isTracking}
          onValueChange={(val) => (val ? startTracking() : stopTracking())}
          trackColor={{ false: "#D1D5DB", true: "#86EFAC" }}
          thumbColor={isTracking ? "#16A34A" : "#9CA3AF"}
        />
      </View>

      <TouchableOpacity
        style={[styles.mainButton, isTracking && styles.mainButtonStop]}
        onPress={isTracking ? stopTracking : startTracking}
        activeOpacity={0.8}
      >
        <Text style={styles.mainButtonText}>
          {isTracking ? "⏹ Detener transmision" : "▶ Iniciar transmision"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 16,
    gap: 16,
  },
  statusSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statusDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  dotActive: {
    backgroundColor: "#16A34A",
  },
  dotInactive: {
    backgroundColor: "#9CA3AF",
  },
  statusText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#374151",
  },
  coordText: {
    fontSize: 14,
    color: "#6B7280",
    fontFamily: "monospace",
  },
  speedText: {
    fontSize: 28,
    fontWeight: "800",
    color: "#D97706",
  },
  errorCard: {
    backgroundColor: "#FEE2E2",
    borderRadius: 12,
    padding: 14,
  },
  errorText: {
    color: "#DC2626",
    fontSize: 14,
  },
  controlCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  controlLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  mainButton: {
    backgroundColor: "#16A34A",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 4,
  },
  mainButtonStop: {
    backgroundColor: "#DC2626",
  },
  mainButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
