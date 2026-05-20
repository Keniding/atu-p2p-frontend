import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useBusDetection } from "../../hooks/useBusDetection";
import { useBackgroundLocation } from "../../hooks/useBackgroundLocation";
import P2PStatusBar from "../../components/P2PStatusBar";
import { LIMA_BUS_LINES_FULL } from "../../constants/lines";

export default function DriverDashboard() {
  const [selectedLine, setSelectedLine] = useState(LIMA_BUS_LINES_FULL[0].id);
  const { myLocation, p2pState } = useBusDetection(selectedLine, true);
  const { isTracking, startTracking, stopTracking } = useBackgroundLocation();

  const lineInfo = LIMA_BUS_LINES_FULL.find((l) => l.id === selectedLine);
  const speed = myLocation ? (myLocation.coords.speed ?? 0) * 3.6 : 0;
  const lat = myLocation?.coords.latitude ?? 0;
  const lon = myLocation?.coords.longitude ?? 0;

  return (
    <View style={styles.container}>
      <P2PStatusBar p2pState={p2pState} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.statusCard, { borderLeftColor: lineInfo?.color ?? "#2563EB" }]}>
          <Text style={styles.lineLabel}>Linea activa</Text>
          <Text style={[styles.lineName, { color: lineInfo?.color ?? "#2563EB" }]}>
            {lineInfo?.name ?? selectedLine}
          </Text>
        </View>

        <View style={styles.statsRow}>
          <StatBox
            icon="⚡"
            value={`${Math.round(speed)} km/h`}
            label="Velocidad"
            color="#D97706"
          />
          <StatBox
            icon="📡"
            value={String(p2pState.connectedPeers.length)}
            label="Pasajeros conectados"
            color="#2563EB"
          />
        </View>

        <View style={styles.statsRow}>
          <StatBox
            icon="📍"
            value={`${lat.toFixed(4)}°`}
            label="Latitud"
            color="#6B7280"
          />
          <StatBox
            icon="📍"
            value={`${lon.toFixed(4)}°`}
            label="Longitud"
            color="#6B7280"
          />
        </View>

        <View style={styles.broadcastSection}>
          <Text style={styles.sectionTitle}>Transmision GPS</Text>
          <Text style={styles.sectionSubtitle}>
            {isTracking
              ? "Transmitiendo tu posicion en segundo plano cada 2 segundos"
              : "Inicia la transmision para que los pasajeros puedan verte"}
          </Text>
          <TouchableOpacity
            style={[styles.broadcastButton, isTracking && styles.broadcastButtonActive]}
            onPress={isTracking ? stopTracking : startTracking}
            activeOpacity={0.8}
          >
            <Text style={styles.broadcastButtonText}>
              {isTracking ? "⏹ Detener transmision" : "▶ Iniciar transmision"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.p2pSection}>
          <Text style={styles.sectionTitle}>Estado P2P</Text>
          <StatusRow label="Advertising" active={p2pState.isAdvertising} />
          <StatusRow label="Discovery" active={p2pState.isDiscovering} />
          <StatusRow label="GPS activo" active={!!myLocation} />
          <StatusRow label="Background GPS" active={isTracking} />
        </View>
      </ScrollView>
    </View>
  );
}

interface StatBoxProps {
  icon: string;
  value: string;
  label: string;
  color: string;
}

function StatBox({ icon, value, label, color }: StatBoxProps) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

interface StatusRowProps {
  label: string;
  active: boolean;
}

function StatusRow({ label, active }: StatusRowProps) {
  return (
    <View style={styles.statusRow}>
      <Text style={styles.statusLabel}>{label}</Text>
      <View style={[styles.statusIndicator, active ? styles.statusOn : styles.statusOff]}>
        <Text style={styles.statusIndicatorText}>{active ? "ON" : "OFF"}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  content: {
    padding: 16,
    gap: 16,
  },
  statusCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  lineLabel: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  lineName: {
    fontSize: 22,
    fontWeight: "800",
    marginTop: 4,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    gap: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statIcon: {
    fontSize: 24,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
  },
  statLabel: {
    fontSize: 11,
    color: "#6B7280",
    textAlign: "center",
  },
  broadcastSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
  },
  sectionSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 18,
  },
  broadcastButton: {
    backgroundColor: "#16A34A",
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
    marginTop: 4,
  },
  broadcastButtonActive: {
    backgroundColor: "#DC2626",
  },
  broadcastButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  p2pSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusLabel: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
  },
  statusIndicator: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusOn: {
    backgroundColor: "#DCFCE7",
  },
  statusOff: {
    backgroundColor: "#F3F4F6",
  },
  statusIndicatorText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#374151",
  },
});
