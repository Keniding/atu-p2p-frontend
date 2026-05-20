import { device, element, by, expect as detoxExpect } from "detox";

describe("Flujo pasajero", () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  it("muestra splash screen al iniciar", async () => {
    await detoxExpect(element(by.text("BusLima P2P"))).toBeVisible();
  });

  it("navega a pantalla de permisos", async () => {
    await detoxExpect(element(by.text("Permisos requeridos"))).toBeVisible();
  });

  it("muestra botones de permisos de ubicacion y notificaciones", async () => {
    await detoxExpect(element(by.text("Ubicacion"))).toBeVisible();
    await detoxExpect(element(by.text("Notificaciones"))).toBeVisible();
  });

  it("permite seleccionar rol de pasajero", async () => {
    await element(by.text("Otorgar permisos")).tap();
    await detoxExpect(element(by.text("¿Quien eres?"))).toBeVisible();
    await element(by.text("Soy pasajero")).tap();
    await element(by.text("Continuar")).tap();
  });

  it("muestra mapa con barra de estado P2P", async () => {
    await detoxExpect(element(by.text("Buscando buses..."))).toBeVisible();
  });
});
