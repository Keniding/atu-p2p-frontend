import type { BusStatus } from "@/types/bus.types";
import { ARRIVING_THRESHOLD_S, ENROUTE_THRESHOLD_S } from "@/constants/config";

export function estimateArrival(distanceM: number, speedKmh: number): number {
  if (speedKmh < 1) return 999;
  return Math.round(distanceM / (speedKmh / 3.6));
}

export function getBusStatus(etaSeconds: number): BusStatus {
  if (etaSeconds >= 999) return "NO_DATA";
  if (etaSeconds < ARRIVING_THRESHOLD_S) return "ARRIVING";
  if (etaSeconds < ENROUTE_THRESHOLD_S) return "ENROUTE";
  return "FAR";
}
