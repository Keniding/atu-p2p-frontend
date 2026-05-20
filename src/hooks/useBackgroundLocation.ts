import { useState, useCallback } from "react";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";

const BACKGROUND_LOCATION_TASK = "buslima-background-location";

TaskManager.defineTask(BACKGROUND_LOCATION_TASK, async ({ error }) => {
  if (error) return;
  // Background location is handled natively — updates flow through the task registry
});

interface BackgroundLocationState {
  isTracking: boolean;
  lastLocation: Location.LocationObject | null;
  error: string | null;
}

export function useBackgroundLocation() {
  const [state, setState] = useState<BackgroundLocationState>({
    isTracking: false,
    lastLocation: null,
    error: null,
  });

  const startTracking = useCallback(async () => {
    try {
      const { status } = await Location.requestBackgroundPermissionsAsync();
      if (status !== "granted") {
        setState((s) => ({ ...s, error: "Permiso de ubicacion en segundo plano denegado" }));
        return;
      }
      await Location.startLocationUpdatesAsync(BACKGROUND_LOCATION_TASK, {
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 2000,
        distanceInterval: 5,
        foregroundService: {
          notificationTitle: "BusLima - Transmitiendo ruta",
          notificationBody: "Tu posicion GPS se esta transmitiendo a pasajeros cercanos",
        },
      });
      setState((s) => ({ ...s, isTracking: true, error: null }));
    } catch (err) {
      setState((s) => ({
        ...s,
        error: err instanceof Error ? err.message : "Error iniciando tracking",
      }));
    }
  }, []);

  const stopTracking = useCallback(async () => {
    try {
      const hasStarted = await Location.hasStartedLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);
      if (hasStarted) {
        await Location.stopLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);
      }
      setState((s) => ({ ...s, isTracking: false }));
    } catch (err) {
      setState((s) => ({
        ...s,
        error: err instanceof Error ? err.message : "Error deteniendo tracking",
      }));
    }
  }, []);

  return { ...state, startTracking, stopTracking };
}
