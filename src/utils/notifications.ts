import * as Notifications from 'expo-notifications';

export const sendEntrySavedNotification = async (address: string): Promise<void> => {
  try {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '✈️ Memory Saved!',
        body: `Your travel memory from ${address} has been added to your diary.`,
        sound: true,
      },
      trigger: null,
    });
  } catch (err) {
    console.error('Failed to send notification:', err);
  }
};
