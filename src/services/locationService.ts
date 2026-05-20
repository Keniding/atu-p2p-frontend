import * as Location from "expo-location";

export async function requestLocationPermissions(isDriver: boolean): Promise<boolean> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") return false;
  if (isDriver) {
    const { status: bgStatus } = await Location.requestBackgroundPermissionsAsync();
    return bgStatus === "granted";
  }
  return true;
}

export async function startLocationTracking(
  isDriver: boolean,
  callback: (location: Location.LocationObject) => void
): Promise<Location.LocationSubscription> {
  return Location.watchPositionAsync(
    {
      accuracy: isDriver
        ? Location.Accuracy.BestForNavigation
        : Location.Accuracy.Balanced,
      timeInterval:     isDriver ? 2000 : 5000,
      distanceInterval: isDriver ? 5    : 10,
    },
    callback
  );
}

export function stopLocationTracking(sub: Location.LocationSubscription): void {
  sub.remove();
}
