import { describe, it, expect } from "bun:test";
import { haversineDistance } from "../../src/utils/haversine";

describe("haversineDistance", () => {
  it("debe retornar 0 para coordenadas identicas", () => {
    const dist = haversineDistance(-12.0464, -77.0428, -12.0464, -77.0428);
    expect(dist).toBe(0);
  });

  it("debe calcular distancia correcta entre dos puntos en Lima", () => {
    const dist = haversineDistance(
      -12.1191, -77.0282,
      -12.0971, -77.0365
    );
    expect(dist).toBeGreaterThan(1500);
    expect(dist).toBeLessThan(3000);
  });

  it("debe detectar bus dentro del radio de 800m", () => {
    const dist = haversineDistance(
      -12.0464, -77.0428,
      -12.0464, -77.0500
    );
    expect(dist).toBeLessThan(800);
  });

  it("debe retornar un numero positivo para cualquier par de coordenadas", () => {
    const dist = haversineDistance(-12.0, -77.0, -12.1, -77.1);
    expect(dist).toBeGreaterThan(0);
  });

  it("debe ser simetrica: distancia(A,B) === distancia(B,A)", () => {
    const d1 = haversineDistance(-12.0464, -77.0428, -12.0971, -77.0365);
    const d2 = haversineDistance(-12.0971, -77.0365, -12.0464, -77.0428);
    expect(Math.abs(d1 - d2)).toBeLessThan(0.001);
  });
});
