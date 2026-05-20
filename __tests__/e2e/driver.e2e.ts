import { device, element, by, expect as detoxExpect } from "detox";

describe("Flujo chofer", () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  it("muestra splash screen al iniciar", async () => {
    await detoxExpect(element(by.text("BusLima P2P"))).toBeVisible();
  });

  it("navega a pantalla de permisos", async () => {
    await detoxExpect(element(by.text("Permisos requeridos"))).toBeVisible();
  });

  it("permite seleccionar rol de chofer", async () => {
    await element(by.text("Otorgar permisos")).tap();
    await detoxExpect(element(by.text("¿Quien eres?"))).toBeVisible();
    await element(by.text("Soy chofer")).tap();
    await element(by.text("Continuar")).tap();
  });

  it("muestra dashboard del chofer con estado P2P", async () => {
    await detoxExpect(element(by.text("Panel del chofer"))).toBeVisible();
    await detoxExpect(element(by.text("Transmision GPS"))).toBeVisible();
  });

  it("puede iniciar y detener la transmision", async () => {
    await element(by.text("▶ Iniciar transmision")).tap();
    await detoxExpect(element(by.text("⏹ Detener transmision"))).toBeVisible();
    await element(by.text("⏹ Detener transmision")).tap();
    await detoxExpect(element(by.text("▶ Iniciar transmision"))).toBeVisible();
  });
});
