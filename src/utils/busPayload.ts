import type { BusPayload } from "../types/bus.types";

export function serializePayload(payload: BusPayload): string {
  return JSON.stringify(payload);
}

export function deserializePayload(text: string): BusPayload {
  const parsed: unknown = JSON.parse(text);
  if (
    typeof parsed !== "object" ||
    parsed === null ||
    !("deviceId" in parsed) ||
    !("busLineId" in parsed) ||
    !("latitude" in parsed) ||
    !("longitude" in parsed)
  ) {
    throw new Error("Invalid BusPayload structure");
  }
  return parsed as BusPayload;
}
