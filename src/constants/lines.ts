import type { BusLine } from "../types/bus.types";

export const LIMA_BUS_LINES = [
  { id: "corredor-azul",     name: "Corredor Azul",     color: "#2563EB" },
  { id: "corredor-rojo",     name: "Corredor Rojo",     color: "#DC2626" },
  { id: "corredor-morado",   name: "Corredor Morado",   color: "#7C3AED" },
  { id: "corredor-amarillo", name: "Corredor Amarillo", color: "#D97706" },
  { id: "corredor-verde",    name: "Corredor Verde",    color: "#16A34A" },
  { id: "metropolitano",     name: "Metropolitano",     color: "#0891B2" },
  { id: "metro-linea1",      name: "Metro Linea 1",     color: "#BE185D" },
  { id: "metro-linea2",      name: "Metro Linea 2",     color: "#B45309" },
] as const;

export const LIMA_BUS_LINES_FULL: BusLine[] = LIMA_BUS_LINES.map((l) => ({
  ...l,
  active: true,
}));
