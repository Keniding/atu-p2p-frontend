import { renderHook, act } from "@testing-library/react-native";
import { usePermissions } from "../../src/hooks/usePermissions";

jest.mock("../../src/services/locationService", () => ({
  requestLocationPermissions: jest.fn().mockResolvedValue(true),
}));
jest.mock("../../src/services/notificationService", () => ({
  requestNotificationPermissions: jest.fn().mockResolvedValue(true),
  scheduleArrivalNotification: jest.fn(),
  cancelAllNotifications: jest.fn(),
}));

describe("usePermissions", () => {
  it("inicia con permisos denegados y sin carga", () => {
    const { result } = renderHook(() => usePermissions(false));
    expect(result.current.locationGranted).toBe(false);
    expect(result.current.notifGranted).toBe(false);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("otorga permisos al llamar requestAll", async () => {
    const { result } = renderHook(() => usePermissions(false));
    await act(async () => {
      await result.current.requestAll();
    });
    expect(result.current.locationGranted).toBe(true);
    expect(result.current.notifGranted).toBe(true);
    expect(result.current.isLoading).toBe(false);
  });

  it("maneja error cuando falla el permiso", async () => {
    const locationService = require("../../src/services/locationService");
    locationService.requestLocationPermissions.mockRejectedValueOnce(
      new Error("Permission denied by OS")
    );
    const { result } = renderHook(() => usePermissions(false));
    await act(async () => {
      await result.current.requestAll();
    });
    expect(result.current.error).toBe("Permission denied by OS");
  });
});
