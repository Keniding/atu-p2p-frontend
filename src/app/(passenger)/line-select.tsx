import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import LineSelector from "../../components/LineSelector";
import { LIMA_BUS_LINES_FULL } from "../../constants/lines";

export default function LineSelectScreen() {
  const [selectedLine, setSelectedLine] = useState(LIMA_BUS_LINES_FULL[0].id);

  const handleConfirm = () => {
    router.push({
      pathname: "/(passenger)/map",
      params: { lineId: selectedLine },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selecciona tu linea</Text>
      <Text style={styles.subtitle}>
        Elige la linea de bus que quieres monitorear
      </Text>
      <LineSelector
        lines={LIMA_BUS_LINES_FULL}
        selected={selectedLine}
        onSelect={setSelectedLine}
      />
      <TouchableOpacity style={styles.button} onPress={handleConfirm} activeOpacity={0.8}>
        <Text style={styles.buttonText}>Ver buses de esta linea</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 24,
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
  },
  subtitle: {
    fontSize: 15,
    color: "#6B7280",
  },
  button: {
    backgroundColor: "#2563EB",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 16,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
