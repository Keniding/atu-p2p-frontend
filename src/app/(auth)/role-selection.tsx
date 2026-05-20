import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { router } from "expo-router";
import type { UserRole } from "../../types/bus.types";

export default function RoleSelectionScreen() {
  const [selected, setSelected] = useState<UserRole | null>(null);

  const handleContinue = () => {
    if (!selected) {
      Alert.alert("Selecciona un rol", "Por favor selecciona si eres chofer o pasajero.");
      return;
    }
    if (selected === "DRIVER") {
      router.replace("/(driver)/dashboard");
    } else {
      router.replace("/(passenger)/map");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¿Quien eres?</Text>
      <Text style={styles.subtitle}>
        Selecciona tu rol para personalizar la experiencia
      </Text>

      <View style={styles.rolesContainer}>
        <RoleCard
          icon="🚌"
          title="Soy chofer"
          description="Transmite tu posicion GPS a los pasajeros cercanos en tiempo real"
          role="DRIVER"
          selected={selected === "DRIVER"}
          onPress={() => setSelected("DRIVER")}
          color="#2563EB"
        />
        <RoleCard
          icon="🧍"
          title="Soy pasajero"
          description="Detecta buses cercanos en tu linea y ve cuanto falta para que lleguen"
          role="PASSENGER"
          selected={selected === "PASSENGER"}
          onPress={() => setSelected("PASSENGER")}
          color="#16A34A"
        />
      </View>

      <TouchableOpacity
        style={[styles.button, !selected && styles.buttonDisabled]}
        onPress={handleContinue}
        disabled={!selected}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Continuar</Text>
      </TouchableOpacity>
    </View>
  );
}

interface RoleCardProps {
  icon: string;
  title: string;
  description: string;
  role: UserRole;
  selected: boolean;
  onPress: () => void;
  color: string;
}

function RoleCard({
  icon,
  title,
  description,
  selected,
  onPress,
  color,
}: RoleCardProps) {
  return (
    <TouchableOpacity
      style={[
        styles.roleCard,
        selected && { borderColor: color, borderWidth: 3 },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.roleIcon}>{icon}</Text>
      <Text style={[styles.roleTitle, selected && { color }]}>{title}</Text>
      <Text style={styles.roleDescription}>{description}</Text>
      {selected && (
        <View style={[styles.selectedBadge, { backgroundColor: color }]}>
          <Text style={styles.selectedBadgeText}>Seleccionado ✓</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#F9FAFB",
    justifyContent: "center",
    gap: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
  },
  rolesContainer: {
    gap: 16,
    marginVertical: 8,
  },
  roleCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    gap: 8,
  },
  roleIcon: {
    fontSize: 48,
  },
  roleTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },
  roleDescription: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
  },
  selectedBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
  },
  selectedBadgeText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
  button: {
    backgroundColor: "#2563EB",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
