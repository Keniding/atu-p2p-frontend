import { type ReactNode } from "react";
import { usePermissions } from "@/hooks/usePermissions";

interface PermissionGateProps {
  children: ReactNode;
  fallback: ReactNode;
  isDriver?: boolean;
}

export default function PermissionGate({
  children,
  fallback,
  isDriver = false,
}: Readonly<PermissionGateProps>) {
  const { locationGranted } = usePermissions(isDriver);

  if (!locationGranted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
