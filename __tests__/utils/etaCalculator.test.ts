import { describe, it, expect } from "bun:test";
import { estimateArrival, getBusStatus } from "@/utils/etaCalculator";

describe("estimateArrival", () => {
  it("debe retornar 999 si el bus esta detenido", () => {
    expect(estimateArrival(400, 0)).toBe(999);
  });

  it("debe retornar 999 si la velocidad es menor a 1 km/h", () => {
    expect(estimateArrival(400, 0.5)).toBe(999);
  });

  it("debe calcular ETA correctamente: 400m a 20km/h = 72s", () => {
    expect(estimateArrival(400, 20)).toBe(72);
  });

  it("debe clasificar como ARRIVING si ETA < 60s", () => {
    const eta = estimateArrival(100, 20);
    expect(eta).toBeLessThan(60);
  });

  it("debe calcular correctamente a alta velocidad", () => {
    const eta = estimateArrival(800, 60);
    expect(eta).toBe(48);
  });
});

describe("getBusStatus", () => {
  it("debe retornar NO_DATA cuando eta >= 999", () => {
    expect(getBusStatus(999)).toBe("NO_DATA");
    expect(getBusStatus(1000)).toBe("NO_DATA");
  });

  it("debe retornar ARRIVING cuando eta < 60s", () => {
    expect(getBusStatus(30)).toBe("ARRIVING");
    expect(getBusStatus(59)).toBe("ARRIVING");
  });

  it("debe retornar ENROUTE cuando 60 <= eta < 180", () => {
    expect(getBusStatus(60)).toBe("ENROUTE");
    expect(getBusStatus(120)).toBe("ENROUTE");
    expect(getBusStatus(179)).toBe("ENROUTE");
  });

  it("debe retornar FAR cuando eta >= 180 y < 999", () => {
    expect(getBusStatus(180)).toBe("FAR");
    expect(getBusStatus(500)).toBe("FAR");
    expect(getBusStatus(998)).toBe("FAR");
  });
});
