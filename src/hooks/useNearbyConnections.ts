import { useState, useEffect, useRef, useCallback } from "react";
import {
  onPeerFound,
  onPeerLost,
  onInvitationReceived,
  onConnected,
  onDisconnected,
  onTextReceived,
  requestConnection,
  acceptConnection,
  type Unsubscribe,
} from "expo-nearby-connections";
import type { BusPayload, P2PState } from "../types/bus.types";
import { SERVICE_ID } from "../constants/config";
import { startP2P, stopP2P, sendToAllPeers } from "../services/p2pService";

interface UseNearbyConnectionsOptions {
  onPayloadReceived: (payload: BusPayload) => void;
}

export function useNearbyConnections({ onPayloadReceived }: UseNearbyConnectionsOptions) {
  const [p2pState, setP2PState] = useState<P2PState>({
    isAdvertising: false,
    isDiscovering: false,
    connectedPeers: [],
    error: null,
  });

  const peersRef = useRef<string[]>([]);

  useEffect(() => {
    (async () => {
      try {
        await startP2P(SERVICE_ID);
        setP2PState((s) => ({ ...s, isAdvertising: true, isDiscovering: true }));
      } catch (err) {
        setP2PState((s) => ({
          ...s,
          error: err instanceof Error ? err.message : "Error iniciando P2P",
        }));
      }
    })();

    return () => {
      stopP2P().catch(() => undefined);
    };
  }, []);

  useEffect(() => {
    const subs: Unsubscribe[] = [];

    subs.push(
      onPeerFound(async ({ peerId }) => {
        try {
          await requestConnection(peerId);
        } catch {
          // peer may have moved
        }
      })
    );

    subs.push(
      onInvitationReceived(async ({ peerId }) => {
        try {
          await acceptConnection(peerId);
        } catch {
          // connection may have been rejected
        }
      })
    );

    subs.push(
      onConnected(({ peerId }) => {
        peersRef.current = [...peersRef.current, peerId];
        setP2PState((s) => ({ ...s, connectedPeers: [...peersRef.current] }));
      })
    );

    subs.push(
      onDisconnected(({ peerId }) => {
        peersRef.current = peersRef.current.filter((id) => id !== peerId);
        setP2PState((s) => ({ ...s, connectedPeers: [...peersRef.current] }));
      })
    );

    subs.push(
      onPeerLost(({ peerId }) => {
        peersRef.current = peersRef.current.filter((id) => id !== peerId);
        setP2PState((s) => ({ ...s, connectedPeers: [...peersRef.current] }));
      })
    );

    subs.push(
      onTextReceived(({ text }) => {
        try {
          const payload: BusPayload = JSON.parse(text);
          onPayloadReceived(payload);
        } catch {
          // malformed payload
        }
      })
    );

    return () => {
      subs.forEach((unsub) => unsub());
    };
  }, [onPayloadReceived]);

  const sendToAll = useCallback(async (payload: BusPayload) => {
    if (peersRef.current.length === 0) return;
    await sendToAllPeers(peersRef.current, payload);
  }, []);

  return { p2pState, sendToAll, connectedPeers: peersRef.current };
}
