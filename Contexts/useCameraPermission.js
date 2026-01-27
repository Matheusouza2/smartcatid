import { useEffect, useState } from "react";
import { Camera } from "react-native-vision-camera";

export function useCameraPermission() {
  const [status, setStatus] = useState("pending");

  useEffect(() => {
    let mounted = true;

    (async () => {
      const permission = await Camera.getCameraPermissionStatus();

      if (!mounted) return;

      if (permission === "authorized") {
        setStatus("authorized");
        return;
      }

      const request = await Camera.requestCameraPermission();
      if (mounted) {
        setStatus(request);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return status;
}
