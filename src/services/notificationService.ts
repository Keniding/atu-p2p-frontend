import * as Notifications from "expo-notifications";
import type { NearbyBus } from "@/types/bus.types";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

export async function scheduleArrivalNotification(bus: NearbyBus): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `Bus llegando: ${bus.busLine}`,
      body: `Llega en aproximadamente ${bus.estimatedArrivalSeconds} segundos. Distancia: ${bus.distanceMeters}m`,
      data: { deviceId: bus.deviceId, busLineId: bus.busLineId },
    },
    trigger: null,
  });
}

export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
