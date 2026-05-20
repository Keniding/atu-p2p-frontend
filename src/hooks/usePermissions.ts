import { useState, useCallback } from "react";
import { requestLocationPermissions } from "../services/locationService";
import { requestNotificationPermissions } from "../services/notificationService";

interface PermissionsState {
  locationGranted: boolean;
  notifGranted: boolean;
  isLoading: boolean;
  error: string | null;
}

export function usePermissions(isDriver: boolean) {
  const [state, setState] = useState<PermissionsState>({
    locationGranted: false,
    notifGranted: false,
    isLoading: false,
    error: null,
  });

  const requestAll = useCallback(async () => {
    setState((s) => ({ ...s, isLoading: true, error: null }));
    try {
      const [locationGranted, notifGranted] = await Promise.all([
        requestLocationPermissions(isDriver),
        requestNotificationPermissions(),
      ]);
      setState({ locationGranted, notifGranted, isLoading: false, error: null });
    } catch (err) {
      setState((s) => ({
        ...s,
        isLoading: false,
        error: err instanceof Error ? err.message : "Error solicitando permisos",
      }));
    }
  }, [isDriver]);

  return { ...state, requestAll };
}
