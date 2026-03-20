import { useCallback } from 'react';
import { Alert, Linking } from 'react-native';
import { useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import * as MediaLibrary from 'expo-media-library';

// ─── Helper ───────────────────────────────────────────────────────────────────

const alertDenied = (name: string): void => {
  Alert.alert(
    `${name} Permission Required`,
    `Travel Diary needs ${name.toLowerCase()} access. Please enable it in Settings.`,
    [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Open Settings', onPress: () => Linking.openSettings() },
    ]
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const usePermissions = () => {
  const [, requestCameraPermissionExpo] = useCameraPermissions();

  const requestCameraPermission = useCallback(async (): Promise<boolean> => {
    try {
      const result = await requestCameraPermissionExpo();
      if (!result.granted) alertDenied('Camera');
      return result.granted;
    } catch (err) {
      console.error('Camera permission error:', err);
      return false;
    }
  }, [requestCameraPermissionExpo]);

  const requestLocationPermission = useCallback(async (): Promise<boolean> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      const granted = status === 'granted';
      if (!granted) alertDenied('Location');
      return granted;
    } catch (err) {
      console.error('Location permission error:', err);
      return false;
    }
  }, []);

  const requestNotificationPermission = useCallback(async (): Promise<boolean> => {
    try {
      const { status: existing } = await Notifications.getPermissionsAsync();
      if (existing === 'granted') return true;
      const { status } = await Notifications.requestPermissionsAsync();
      const granted = status === 'granted';
      if (granted) {
        Notifications.setNotificationHandler({
          handleNotification: async () => ({
            shouldShowAlert: true,
            shouldShowBanner: true,
            shouldShowList: true,
            shouldPlaySound: true,
            shouldSetBadge: false,
          }),
        });
      }
      return granted;
    } catch (err) {
      console.error('Notification permission error:', err);
      return false;
    }
  }, []);

  const requestMediaLibraryPermission = useCallback(async (): Promise<boolean> => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      const granted = status === 'granted';
      if (!granted) alertDenied('Media Library');
      return granted;
    } catch (err) {
      console.error('MediaLibrary permission error:', err);
      return false;
    }
  }, []);

  const requestAllPermissions = useCallback(async (): Promise<void> => {
    await Promise.all([
      requestCameraPermission(),
      requestLocationPermission(),
      requestNotificationPermission(),
      requestMediaLibraryPermission(),
    ]);
  }, [
    requestCameraPermission,
    requestLocationPermission,
    requestNotificationPermission,
    requestMediaLibraryPermission,
  ]);

  return {
    requestCameraPermission,
    requestLocationPermission,
    requestNotificationPermission,
    requestMediaLibraryPermission,
    requestAllPermissions,
  };
};
