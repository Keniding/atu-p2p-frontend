import { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Text, ActivityIndicator } from "react-native";
import MapView, { PROVIDER_DEFAULT } from "react-native-maps";
import { useLocalSearchParams } from "expo-router";
import { useBusDetection } from "@/hooks/useBusDetection";
import { useSupabaseFallback } from "@/hooks/useSupabaseFallback";
import { scheduleArrivalNotification } from "@/services/notificationService";
import BusMarker from "@/components/BusMarker";
import P2PStatusBar from "@/components/P2PStatusBar";
import LineSelector from "@/components/LineSelector";
import { LIMA_BUS_LINES_FULL } from "@/constants/lines";
import { ARRIVING_THRESHOLD_S } from "@/constants/config";
import type { NearbyBus } from "@/types/bus.types";

const LIMA_CENTER = {
  latitude: -12.0464,
  longitude: -77.0428,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

export default function MapScreen() {
  const { lineId } = useLocalSearchParams<{ lineId?: string }>();
  const [selectedLine, setSelectedLine] = useState(
    lineId ?? LIMA_BUS_LINES_FULL[0].id
  );
  const mapRef = useRef<MapView>(null);
  const notifiedBuses = useRef<Set<string>>(new Set());

  const { myLocation, nearbyBuses, p2pState } = useBusDetection(selectedLine, false);
  const { nearbyBusesFromServer } = useSupabaseFallback(selectedLine);

  const allBuses: NearbyBus[] = [...nearbyBuses];
  for (const serverBus of nearbyBusesFromServer) {
    if (!allBuses.some((b) => b.deviceId === serverBus.deviceId)) {
      allBuses.push({
        ...serverBus,
        distanceMeters: 0,
        estimatedArrivalSeconds: 999,
        status: "NO_DATA",
        lastUpdated: Date.now(),
      });
    }
  }

  useEffect(() => {
    for (const bus of nearbyBuses) {
      if (
        bus.estimatedArrivalSeconds < ARRIVING_THRESHOLD_S &&
        !notifiedBuses.current.has(bus.deviceId)
      ) {
        notifiedBuses.current.add(bus.deviceId);
        scheduleArrivalNotification(bus).catch(() => undefined);
      }
    }
  }, [nearbyBuses]);

  useEffect(() => {
    if (myLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: myLocation.coords.latitude,
        longitude: myLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 500);
    }
  }, [myLocation]);

  return (
    <View style={styles.container}>
      <P2PStatusBar p2pState={p2pState} />

      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={LIMA_CENTER}
        showsUserLocation
        showsMyLocationButton
      >
        {allBuses.map((bus) => (
          <BusMarker key={bus.deviceId} bus={bus} />
        ))}
      </MapView>

      {allBuses.length === 0 && (
        <View style={styles.emptyOverlay} pointerEvents="none">
          <Text style={styles.emptyText}>Buscando buses de {selectedLine}...</Text>
          <ActivityIndicator color="#2563EB" style={{ marginTop: 8 }} />
        </View>
      )}

      <LineSelector
        lines={LIMA_BUS_LINES_FULL}
        selected={selectedLine}
        onSelect={(id) => {
          setSelectedLine(id);
          notifiedBuses.current.clear();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  map: {
    flex: 1,
  },
  emptyOverlay: {
    position: "absolute",
    top: "45%",
    alignSelf: "center",
    backgroundColor: "rgba(31,41,55,0.85)",
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
    alignItems: "center",
  },
  emptyText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});
