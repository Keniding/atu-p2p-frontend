import { renderHook } from "@testing-library/react-native";

jest.mock("expo-location", () => ({
  requestForegroundPermissionsAsync: jest.fn().mockResolvedValue({ status: "granted" }),
  requestBackgroundPermissionsAsync: jest.fn().mockResolvedValue({ status: "granted" }),
  watchPositionAsync: jest.fn().mockResolvedValue({ remove: jest.fn() }),
  Accuracy: {
    Balanced: 3,
    BestForNavigation: 6,
  },
}));

jest.mock("expo-nearby-connections", () => ({
  startAdvertising: jest.fn().mockResolvedValue(undefined),
  startDiscovery: jest.fn().mockResolvedValue(undefined),
  stopAdvertising: jest.fn().mockResolvedValue(undefined),
  stopDiscovery: jest.fn().mockResolvedValue(undefined),
  addEndpointFoundListener: jest.fn().mockReturnValue({ remove: jest.fn() }),
  addConnectionInitiatedListener: jest.fn().mockReturnValue({ remove: jest.fn() }),
  addEndpointLostListener: jest.fn().mockReturnValue({ remove: jest.fn() }),
  addPayloadReceivedListener: jest.fn().mockReturnValue({ remove: jest.fn() }),
  getLocalEndpointId: jest.fn().mockResolvedValue("local-endpoint-id"),
  sendPayload: jest.fn().mockResolvedValue(undefined),
  Strategy: { P2P_CLUSTER: "P2P_CLUSTER" },
}));

import { useBusDetection } from "../../src/hooks/useBusDetection";

describe("useBusDetection", () => {
  it("inicia con estado inicial correcto", () => {
    const { result } = renderHook(() =>
      useBusDetection("corredor-azul", false)
    );
    expect(result.current.nearbyBuses).toEqual([]);
    expect(result.current.myLocation).toBeNull();
    expect(result.current.p2pState.connectedPeers).toEqual([]);
    expect(result.current.p2pState.error).toBeNull();
  });

  it("retorna la estructura correcta de datos", () => {
    const { result } = renderHook(() =>
      useBusDetection("corredor-azul", false)
    );
    expect(Array.isArray(result.current.nearbyBuses)).toBe(true);
    expect(typeof result.current.p2pState.isAdvertising).toBe("boolean");
    expect(typeof result.current.p2pState.isDiscovering).toBe("boolean");
  });
});
