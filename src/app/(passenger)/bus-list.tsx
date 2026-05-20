import { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { useBusDetection } from "@/hooks/useBusDetection";
import { useSupabaseFallback } from "@/hooks/useSupabaseFallback";
import BusCard from "@/components/BusCard";
import P2PStatusBar from "@/components/P2PStatusBar";
import LineSelector from "@/components/LineSelector";
import { LIMA_BUS_LINES_FULL } from "@/constants/lines";
import type { NearbyBus } from "@/types/bus.types";

export default function BusListScreen() {
  const [selectedLine, setSelectedLine] = useState(LIMA_BUS_LINES_FULL[0].id);
  const [refreshing, setRefreshing] = useState(false);

  const { nearbyBuses, p2pState } = useBusDetection(selectedLine, false);
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

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const renderEmpty = () => (
    <View style={styles.empty}>
      <Text style={styles.emptyIcon}>🔍</Text>
      <Text style={styles.emptyTitle}>Buscando buses...</Text>
      <Text style={styles.emptySubtitle}>
        Los buses de la linea {selectedLine} apareceran aqui cuando esten cerca
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <P2PStatusBar p2pState={p2pState} />
      <FlatList
        data={allBuses}
        keyExtractor={(item) => item.deviceId}
        renderItem={({ item }) => <BusCard bus={item} />}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={allBuses.length === 0 ? styles.emptyList : styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#2563EB"
          />
        }
        ListHeaderComponent={
          <Text style={styles.header}>
            {allBuses.length} bus{allBuses.length === 1 ? "" : "es"} detectado{allBuses.length === 1 ? "" : "s"}
          </Text>
        }
      />
      <LineSelector
        lines={LIMA_BUS_LINES_FULL}
        selected={selectedLine}
        onSelect={setSelectedLine}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  list: {
    paddingBottom: 16,
  },
  emptyList: {
    flex: 1,
  },
  header: {
    fontSize: 13,
    color: "#6B7280",
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontWeight: "500",
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    gap: 12,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#374151",
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
  },
});
