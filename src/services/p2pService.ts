import {
  startAdvertise,
  stopAdvertise,
  startDiscovery,
  stopDiscovery,
  sendText,
  Strategy,
} from "expo-nearby-connections";
import type { BusPayload } from "../types/bus.types";

export async function startP2P(serviceId: string): Promise<void> {
  await startAdvertise(serviceId, Strategy.P2P_CLUSTER);
  await startDiscovery(serviceId, Strategy.P2P_CLUSTER);
}

export async function stopP2P(): Promise<void> {
  await stopAdvertise();
  await stopDiscovery();
}

export async function sendToAllPeers(
  peers: string[],
  payload: BusPayload
): Promise<void> {
  const text = JSON.stringify(payload);
  await Promise.allSettled(
    peers.map((peerId) => sendText(peerId, text))
  );
}
