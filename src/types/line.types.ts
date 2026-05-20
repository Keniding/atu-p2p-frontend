export type { BusLine, GPSCoords } from "./bus.types";

export interface Stop {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  order: number;
}
