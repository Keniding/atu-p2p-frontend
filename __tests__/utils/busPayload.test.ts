import { describe, it, expect } from "bun:test";
import { serializePayload, deserializePayload } from "@/utils/busPayload";
import type { BusPayload } from "@/types/bus.types";

const samplePayload: BusPayload = {
  deviceId: "device-001",
  busLine: "Corredor Azul",
  busLineId: "corredor-azul",
  latitude: -12.0464,
  longitude: -77.0428,
  speed: 30,
  direction: 180,
  timestamp: 1700000000000,
  isBusDriver: true,
  platform: "android",
};

describe("serializePayload", () => {
  it("debe serializar un BusPayload a string JSON", () => {
    const text = serializePayload(samplePayload);
    expect(typeof text).toBe("string");
    expect(text.length).toBeGreaterThan(0);
  });

  it("debe producir JSON que contenga el deviceId", () => {
    const text = serializePayload(samplePayload);
    expect(text).toContain("device-001");
  });

  it("debe ser JSON valido", () => {
    const text = serializePayload(samplePayload);
    expect(() => JSON.parse(text)).not.toThrow();
  });
});

describe("deserializePayload", () => {
  it("debe deserializar correctamente un payload serializado", () => {
    const text = serializePayload(samplePayload);
    const result = deserializePayload(text);
    expect(result.deviceId).toBe(samplePayload.deviceId);
    expect(result.busLineId).toBe(samplePayload.busLineId);
    expect(result.latitude).toBe(samplePayload.latitude);
    expect(result.longitude).toBe(samplePayload.longitude);
    expect(result.speed).toBe(samplePayload.speed);
    expect(result.isBusDriver).toBe(true);
  });

  it("debe lanzar error para JSON invalido", () => {
    expect(() => deserializePayload("invalid json{{{")).toThrow();
  });

  it("debe lanzar error para JSON valido pero estructura incorrecta", () => {
    expect(() => deserializePayload('{"foo": "bar"}')).toThrow("Invalid BusPayload structure");
  });

  it("debe preservar passengerCount opcional", () => {
    const withCount: BusPayload = { ...samplePayload, passengerCount: 15 };
    const result = deserializePayload(serializePayload(withCount));
    expect(result.passengerCount).toBe(15);
  });
});
