import { useState, useEffect, useRef } from "react";
import * as Location from "expo-location";
import {
  startAdvertise,
  stopAdvertise,
  startDiscovery,
  stopDiscovery,
  requestConnection,
  acceptConnection,
  onPeerFound,
  onPeerLost,
  onInvitationReceived,
  onConnected,
  onDisconnected,
  onTextReceived,
  sendText,
  Strategy,
  type Unsubscribe,
} from "expo-nearby-connections";
import type { BusPayload, NearbyBus, P2PState } from "../types/bus.types";
import {
  SERVICE_ID,
  BROADCAST_INTERVAL_MS,
  MAX_DETECTION_RADIUS_M,
  BUS_TIMEOUT_MS,
  CLEANUP_INTERVAL_MS,
} from "../constants/config";
import { haversineDistance } from "../utils/haversine";
import { estimateArrival, getBusStatus } from "../utils/etaCalculator";

export function useBusDetection(busLineId: string, isDriver: boolean) {
  const [myLocation, setMyLocation] = useState<Location.LocationObject | null>(null);
  const [nearbyBuses, setNearbyBuses] = useState<NearbyBus[]>([]);
  const [p2pState, setP2PState] = useState<P2PState>({
    isAdvertising: false,
    isDiscovering: false,
    connectedPeers: [],
    error: null,
  });

  const locationRef    = useRef<Location.LocationObject | null>(null);
  const peersRef       = useRef<string[]>([]);
  const broadcastTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const cleanupTimer   = useRef<ReturnType<typeof setInterval> | null>(null);
  const myPeerIdRef    = useRef<string>("");

  // GPS Setup
  useEffect(() => {
    let locationSub: Location.LocationSubscription | null = null;
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setP2PState((s) => ({ ...s, error: "Permiso de ubicacion denegado" }));
        return;
      }
      if (isDriver) {
        await Location.requestBackgroundPermissionsAsync();
      }
      locationSub = await Location.watchPositionAsync(
        {
          accuracy: isDriver
            ? Location.Accuracy.BestForNavigation
            : Location.Accuracy.Balanced,
          timeInterval:     isDriver ? 2000 : 5000,
          distanceInterval: isDriver ? 5    : 10,
        },
        (loc) => {
          setMyLocation(loc);
          locationRef.current = loc;
        }
      );
    })();
    return () => { locationSub?.remove(); };
  }, [isDriver]);

  // P2P Setup
  useEffect(() => {
    (async () => {
      try {
        const peerId = await startAdvertise(SERVICE_ID, Strategy.P2P_CLUSTER);
        myPeerIdRef.current = peerId;
        setP2PState((s) => ({ ...s, isAdvertising: true }));
        await startDiscovery(SERVICE_ID, Strategy.P2P_CLUSTER);
        setP2PState((s) => ({ ...s, isDiscovering: true }));
      } catch (err) {
        setP2PState((s) => ({ ...s, error: String(err) }));
      }
    })();
    return () => {
      stopAdvertise().catch(() => undefined);
      stopDiscovery().catch(() => undefined);
      if (broadcastTimer.current) clearInterval(broadcastTimer.current);
      if (cleanupTimer.current)   clearInterval(cleanupTimer.current);
    };
  }, []);

  // P2P Listeners
  useEffect(() => {
    const subs: Unsubscribe[] = [];

    subs.push(
      onPeerFound(async ({ peerId }) => {
        try {
          await requestConnection(peerId);
        } catch { /* peer may have moved away */ }
      })
    );

    subs.push(
      onInvitationReceived(async ({ peerId }) => {
        try {
          await acceptConnection(peerId);
        } catch { /* connection rejected */ }
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
          const busData: BusPayload = JSON.parse(text);
          if (!busData.isBusDriver)            return;
          if (busData.busLineId !== busLineId) return;
          const myLoc = locationRef.current;
          if (!myLoc) return;
          const dist = haversineDistance(
            myLoc.coords.latitude, myLoc.coords.longitude,
            busData.latitude,      busData.longitude
          );
          if (dist > MAX_DETECTION_RADIUS_M) return;
          const eta = estimateArrival(dist, busData.speed);
          const nearbyBus: NearbyBus = {
            ...busData,
            distanceMeters:          Math.round(dist),
            estimatedArrivalSeconds: eta,
            status:                  getBusStatus(eta),
            lastUpdated:             Date.now(),
          };
          setNearbyBuses((prev) => {
            const filtered = prev.filter((b) => b.deviceId !== busData.deviceId);
            return [...filtered, nearbyBus].sort(
              (a, b) => a.estimatedArrivalSeconds - b.estimatedArrivalSeconds
            );
          });
        } catch { /* malformed JSON */ }
      })
    );

    return () => { subs.forEach((unsub) => unsub()); };
  }, [busLineId]);

  // Driver Broadcast
  useEffect(() => {
    if (!isDriver) return;
    broadcastTimer.current = setInterval(async () => {
      const loc = locationRef.current;
      if (!loc || peersRef.current.length === 0) return;
      const payload: BusPayload = {
        deviceId:    myPeerIdRef.current || "driver-unknown",
        busLine:     busLineId,
        busLineId,
        latitude:    loc.coords.latitude,
        longitude:   loc.coords.longitude,
        speed:       (loc.coords.speed ?? 0) * 3.6,
        direction:   loc.coords.heading ?? 0,
        timestamp:   Date.now(),
        isBusDriver: true,
        platform:    "android",
      };
      const text = JSON.stringify(payload);
      const failedPeers: string[] = [];
      for (const peerId of peersRef.current) {
        try {
          await sendText(peerId, text);
        } catch {
          failedPeers.push(peerId);
        }
      }
      if (failedPeers.length > 0) {
        peersRef.current = peersRef.current.filter((id) => !failedPeers.includes(id));
      }
    }, BROADCAST_INTERVAL_MS);

    return () => {
      if (broadcastTimer.current) clearInterval(broadcastTimer.current);
    };
  }, [isDriver, busLineId]);

  // Cleanup buses perdidos
  useEffect(() => {
    cleanupTimer.current = setInterval(() => {
      const now = Date.now();
      setNearbyBuses((prev) =>
        prev.filter((b) => now - b.lastUpdated < BUS_TIMEOUT_MS)
      );
    }, CLEANUP_INTERVAL_MS);

    return () => {
      if (cleanupTimer.current) clearInterval(cleanupTimer.current);
    };
  }, []);

  return { myLocation, nearbyBuses, p2pState };
}
