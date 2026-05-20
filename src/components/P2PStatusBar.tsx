import { View, Text, StyleSheet } from "react-native";
import type { P2PState } from "@/types/bus.types";

interface P2PStatusBarProps {
  p2pState: P2PState;
}

export default function P2PStatusBar({ p2pState }: P2PStatusBarProps) {
  const { isDiscovering, connectedPeers, error } = p2pState;

  if (error) {
    return (
      <View style={[styles.bar, styles.errorBar]}>
        <Text style={styles.errorText}>Error P2P: {error}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.bar, styles.activeBar]}>
      <View style={styles.indicator}>
        <View style={[styles.dot, isDiscovering ? styles.dotActive : styles.dotInactive]} />
        <Text style={styles.indicatorText}>
          {isDiscovering ? "Buscando buses..." : "P2P inactivo"}
        </Text>
      </View>
      <Text style={styles.peersText}>
        {connectedPeers.length} peer{connectedPeers.length !== 1 ? "s" : ""} conectado{connectedPeers.length !== 1 ? "s" : ""}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  activeBar: {
    backgroundColor: "#1F2937",
  },
  errorBar: {
    backgroundColor: "#DC2626",
  },
  indicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    backgroundColor: "#4ADE80",
  },
  dotInactive: {
    backgroundColor: "#6B7280",
  },
  indicatorText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "500",
  },
  peersText: {
    color: "#9CA3AF",
    fontSize: 12,
  },
  errorText: {
    color: "#FFFFFF",
    fontSize: 13,
  },
});
