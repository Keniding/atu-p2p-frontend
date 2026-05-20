import { useState, useEffect, useCallback, useRef } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import type { BusPayload } from "@/types/bus.types";
import { upsertBusLocation, subscribeToBusLine, unsubscribe } from "@/services/supabaseService";

interface SupabaseFallbackState {
  isConnected: boolean;
  nearbyBusesFromServer: BusPayload[];
  error: string | null;
}

function upsertBus(buses: BusPayload[], incoming: BusPayload): BusPayload[] {
  return buses.filter((b) => b.deviceId !== incoming.deviceId).concat(incoming);
}

export function useSupabaseFallback(busLineId: string) {
  const [state, setState] = useState<SupabaseFallbackState>({
    isConnected: false,
    nearbyBusesFromServer: [],
    error: null,
  });

  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!busLineId) return;

    channelRef.current = subscribeToBusLine(busLineId, (payload) => {
      setState((s) => ({
        ...s,
        isConnected: true,
        nearbyBusesFromServer: upsertBus(s.nearbyBusesFromServer, payload),
      }));
    });

    return () => {
      if (channelRef.current) {
        unsubscribe(channelRef.current);
      }
    };
  }, [busLineId]);

  const publishLocation = useCallback(async (payload: BusPayload) => {
    try {
      await upsertBusLocation(payload);
    } catch (err) {
      setState((s) => ({
        ...s,
        error: err instanceof Error ? err.message : "Error publicando ubicacion",
      }));
    }
  }, []);

  return { ...state, publishLocation };
}
