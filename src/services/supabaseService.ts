import { createClient, type RealtimeChannel } from "@supabase/supabase-js";
import type { BusPayload } from "../types/bus.types";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function upsertBusLocation(payload: BusPayload): Promise<void> {
  const { error } = await supabase.from("bus_locations").upsert({
    device_id: payload.deviceId,
    bus_line_id: payload.busLineId,
    latitude: payload.latitude,
    longitude: payload.longitude,
    speed_kmh: payload.speed,
    direction_degrees: payload.direction,
    is_driver: payload.isBusDriver,
    platform: payload.platform,
    updated_at: new Date().toISOString(),
  });
  if (error) throw new Error(error.message);
}

export function subscribeToBusLine(
  lineId: string,
  cb: (payload: BusPayload) => void
): RealtimeChannel {
  return supabase
    .channel(`bus-line-${lineId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "bus_locations",
        filter: `bus_line_id=eq.${lineId}`,
      },
      (change) => {
        const row = change.new as Record<string, unknown>;
        const busPayload: BusPayload = {
          deviceId:    String(row.device_id),
          busLine:     String(row.bus_line_id),
          busLineId:   String(row.bus_line_id),
          latitude:    Number(row.latitude),
          longitude:   Number(row.longitude),
          speed:       Number(row.speed_kmh),
          direction:   Number(row.direction_degrees),
          timestamp:   Date.now(),
          isBusDriver: Boolean(row.is_driver),
          platform:    (row.platform as "android" | "ios") ?? "android",
        };
        cb(busPayload);
      }
    )
    .subscribe();
}

export function unsubscribe(channel: RealtimeChannel): void {
  supabase.removeChannel(channel);
}
