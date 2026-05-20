import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { usePermissions } from "@/hooks/usePermissions";

export default function PermissionsScreen() {
  const { locationGranted, notifGranted, isLoading, error, requestAll } =
    usePermissions(false);

  const allGranted = locationGranted && notifGranted;

  const handleContinue = async () => {
    if (!allGranted) {
      await requestAll();
    }
    if (allGranted) {
      router.replace("/(auth)/role-selection");
    }
  };

  const handleAlreadyGranted = () => {
    if (allGranted) {
      router.replace("/(auth)/role-selection");
    } else {
      Alert.alert(
        "Permisos necesarios",
        "Por favor otorga todos los permisos para continuar."
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>🔐</Text>
      <Text style={styles.title}>Permisos requeridos</Text>
      <Text style={styles.subtitle}>
        BusLima necesita los siguientes permisos para funcionar correctamente:
      </Text>

      <View style={styles.permissionList}>
        <PermissionItem
          icon="📍"
          title="Ubicacion"
          description="Para detectar buses cercanos en tu ruta"
          granted={locationGranted}
        />
        <PermissionItem
          icon="🔔"
          title="Notificaciones"
          description="Para alertarte cuando un bus esta por llegar"
          granted={notifGranted}
        />
      </View>

      {error && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity
        style={[styles.button, allGranted && styles.buttonSuccess]}
        onPress={allGranted ? handleAlreadyGranted : handleContinue}
        disabled={isLoading}
        activeOpacity={0.8}
      >
        {isLoading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>
            {allGranted ? "Continuar ✓" : "Otorgar permisos"}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

interface PermissionItemProps {
  icon: string;
  title: string;
  description: string;
  granted: boolean;
}

function PermissionItem({ icon, title, description, granted }: PermissionItemProps) {
  return (
    <View style={styles.permissionItem}>
      <Text style={styles.permissionIcon}>{icon}</Text>
      <View style={styles.permissionText}>
        <Text style={styles.permissionTitle}>{title}</Text>
        <Text style={styles.permissionDescription}>{description}</Text>
      </View>
      <Text style={styles.permissionStatus}>{granted ? "✅" : "⏳"}</Text>
    </View>
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
  logo: {
    fontSize: 56,
    textAlign: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 22,
  },
  permissionList: {
    gap: 12,
    marginVertical: 8,
  },
  permissionItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  permissionIcon: {
    fontSize: 28,
  },
  permissionText: {
    flex: 1,
  },
  permissionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  permissionDescription: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },
  permissionStatus: {
    fontSize: 20,
  },
  error: {
    color: "#DC2626",
    textAlign: "center",
    fontSize: 14,
  },
  button: {
    backgroundColor: "#2563EB",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  buttonSuccess: {
    backgroundColor: "#16A34A",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
