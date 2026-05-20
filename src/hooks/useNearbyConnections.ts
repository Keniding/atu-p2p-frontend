import { useReducer, useEffect, useRef, useCallback } from "react";
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
import type { BusPayload, P2PState } from "@/types/bus.types";
import { SERVICE_ID } from "@/constants/config";
import { startP2P, stopP2P, sendToAllPeers } from "@/services/p2pService";

type P2PAction =
  | { type: "start" }
  | { type: "peer_added"; peerId: string }
  | { type: "peer_removed"; peerId: string }
  | { type: "error"; error: string };

const INITIAL_P2P: P2PState = {
  isAdvertising: false,
  isDiscovering: false,
  connectedPeers: [],
  error: null,
};

function p2pReducer(state: P2PState, action: P2PAction): P2PState {
  switch (action.type) {
    case "start":
      return { ...state, isAdvertising: true, isDiscovering: true };
    case "peer_added":
      return { ...state, connectedPeers: [...state.connectedPeers, action.peerId] };
    case "peer_removed":
      return { ...state, connectedPeers: state.connectedPeers.filter((id) => id !== action.peerId) };
    case "error":
      return { ...state, error: action.error };
  }
}

interface UseNearbyConnectionsOptions {
  onPayloadReceived: (payload: BusPayload) => void;
}

export function useNearbyConnections({ onPayloadReceived }: UseNearbyConnectionsOptions) {
  const [p2pState, dispatch] = useReducer(p2pReducer, INITIAL_P2P);
  const peersRef = useRef<string[]>([]);

  useEffect(() => {
    (async () => {
      try {
        await startP2P(SERVICE_ID);
        dispatch({ type: "start" });
      } catch (err) {
        dispatch({
          type: "error",
          error: err instanceof Error ? err.message : "Error iniciando P2P",
        });
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
      }),
      onInvitationReceived(async ({ peerId }) => {
        try {
          await acceptConnection(peerId);
        } catch {
          // connection may have been rejected
        }
      }),
      onConnected(({ peerId }) => {
        peersRef.current = [...peersRef.current, peerId];
        dispatch({ type: "peer_added", peerId });
      }),
      onDisconnected(({ peerId }) => {
        peersRef.current = peersRef.current.filter((id) => id !== peerId);
        dispatch({ type: "peer_removed", peerId });
      }),
      onPeerLost(({ peerId }) => {
        peersRef.current = peersRef.current.filter((id) => id !== peerId);
        dispatch({ type: "peer_removed", peerId });
      }),
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
