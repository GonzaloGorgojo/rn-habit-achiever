/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
import { StatusBar } from 'expo-status-bar';
import { Alert, Linking, StyleSheet, Text } from 'react-native';
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

export default function HomeScreen() {
  const { t } = useTranslation();
  const { activeUser, askForPermission, setAskForPermission } =
    useActiveUserContext();

  if (!activeUser) {
    return <Redirect href="/loginScreen" />;
  }

  const notificationsAlert = async () =>
    new Promise((resolve) => {
      Alert.alert(
        `${t('confirm')}`,
        'Tienes las notificaciones bloqueadas para la app, sin esto no podremos recordarte de tus habitos',
        [
          {
            style: 'default',
            text: 'Go to Settings',
            onPress: () => {
              Linking.openSettings();
              resolve(true);
            },
          },
          {
            style: 'cancel',
            text: `${t('cancel')}`,
            onPress: () => resolve(false),
          },
        ],
        {
          cancelable: true,
          onDismiss: () => {},
        },
      );
    });

  const checkPermissions = async () => {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      notificationsAlert();
    }
    setAskForPermission(false);
  };

  if (askForPermission) {
    checkPermissions();
  }

  return (
    <SafeAreaView edges={['right', 'bottom', 'left']} style={styles.container}>
      <StatusBar style="dark" />
      <Text style={styles.userTitle}>
        {t('welcome')} {activeUser.name}!
      </Text>
      <CurrentHabit />
      <AchievedHabit />
      <HabitsGraph />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.black,
  },
  userTitle: {
    color: Colors.mainColor,
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 5,
  },
});
