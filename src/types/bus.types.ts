export type BusStatus = "ARRIVING" | "ENROUTE" | "FAR" | "NO_DATA";
export type UserRole = "DRIVER" | "PASSENGER";
export type Platform = "android" | "ios";

export interface GPSCoords {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number;
}

export interface BusPayload {
  deviceId: string;
  busLine: string;
  busLineId: string;
  latitude: number;
  longitude: number;
  speed: number;
  direction: number;
  timestamp: number;
  isBusDriver: boolean;
  passengerCount?: number;
  platform: Platform;
}

export interface NearbyBus extends BusPayload {
  distanceMeters: number;
  estimatedArrivalSeconds: number;
  status: BusStatus;
  lastUpdated: number;
}

export interface UserSession {
  userId: string;
  role: UserRole;
  selectedLineId: string;
  isDriver: boolean;
  currentCoords: GPSCoords | null;
}

export interface BusLine {
  id: string;
  name: string;
  color: string;
  stops?: GPSCoords[];
  polyline?: GPSCoords[];
  active: boolean;
}

export interface P2PState {
  isAdvertising: boolean;
  isDiscovering: boolean;
  connectedPeers: string[];
  error: string | null;
}
