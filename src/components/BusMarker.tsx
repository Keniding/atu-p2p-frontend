import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Marker } from "react-native-maps";
import type { NearbyBus } from "../types/bus.types";
import { LIMA_BUS_LINES } from "../constants/lines";

interface BusMarkerProps {
  bus: NearbyBus;
  onPress?: () => void;
}

export default function BusMarker({ bus, onPress }: BusMarkerProps) {
  const lineInfo = LIMA_BUS_LINES.find((l) => l.id === bus.busLineId);
  const color = lineInfo?.color ?? "#2563EB";

  return (
    <Marker
      coordinate={{ latitude: bus.latitude, longitude: bus.longitude }}
      onPress={onPress}
      anchor={{ x: 0.5, y: 1 }}
    >
      <View style={[styles.markerContainer, { borderColor: color }]}>
        <View style={[styles.markerInner, { backgroundColor: color }]}>
          <Text style={styles.busIcon}>🚌</Text>
        </View>
        <View style={[styles.markerTail, { borderTopColor: color }]} />
      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  markerContainer: {
    alignItems: "center",
  },
  markerInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  busIcon: {
    fontSize: 20,
  },
  markerTail: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
  },
});
