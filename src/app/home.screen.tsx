import { StatusBar } from 'expo-status-bar';
import { Button, Linking, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import '@src/languages/i18n';
import { Colors } from '@src/common/constants/colors';
import CurrentHabit from '@src/components/CurrentHabit.component';
import AchievedHabit from '@src/components/AchievedHabit.component';
import HabitsGraph from '@src/components/HabitsGraph.component';
import { Redirect } from 'expo-router';
import { useActiveUserContext } from '@src/context/userContext';
import { useTranslation } from 'react-i18next';
import * as Notifications from 'expo-notifications';
import { CustomModal } from '@src/components/CustomModal.component';
import { useState } from 'react';

Notifications.setNotificationHandler({
  // eslint-disable-next-line @typescript-eslint/require-await
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const getScheduledNotifications = async () => {
  const notifications = await Notifications.getAllScheduledNotificationsAsync();
  console.log(notifications);
  console.log(notifications.length);
};

export default function HomeScreen() {
  const { t } = useTranslation();
  const { activeUser, askForPermission, setAskForPermission } =
    useActiveUserContext();
  const [settingsModalVisible, setSettingsModalVisible] =
    useState<boolean>(false);

  if (!activeUser) {
    return <Redirect href="/login.screen" />;
  }

  const checkPermissions = async () => {
    try {
      const { status } = await Notifications.getPermissionsAsync();

      // let finalStatus = existingStatus;

      // if (existingStatus !== 'granted') {
      //   const { status } = await Notifications.requestPermissionsAsync();
      //   finalStatus = status;
      // }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
      if (status !== 'granted') {
        setSettingsModalVisible(true);
      }
    } catch (error) {
      console.error('error:', error);
    }
  };

  const confirmGoToSettings = () => {
    setAskForPermission(false);
    Linking.openSettings();
  };

  if (askForPermission) {
    checkPermissions();
  }

  return (
    <SafeAreaView edges={['right', 'bottom', 'left']} style={styles.container}>
      <StatusBar style="dark" />
      <Button
        title="Press to get scheduled notifications"
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onPress={async () => {
          await getScheduledNotifications();
        }}
      />

      <CurrentHabit />
      <AchievedHabit />
      <HabitsGraph />

      <CustomModal
        isVisible={settingsModalVisible}
        text={`${t('notificationsBlocked')}`}
        buttonTitle={`${t('goToSettings')}`}
        onButtonPress={confirmGoToSettings}
        onClose={() => {
          setAskForPermission(false);
          setSettingsModalVisible(false);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.black,
  },
});
