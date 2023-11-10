import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import '@src/languages/i18n';
import { Colors } from '@src/common/constants/colors';
import CurrentHabit from '@src/components/CurrentHabit.component';
import AchievedHabit from '@src/components/AchievedHabit.component';
import HabitsGraph from '@src/components/HabitsGraph.component';
import { Redirect } from 'expo-router';
import { useActiveUserContext } from '@src/context/userContext';
import { useTranslation } from 'react-i18next';

export default function HomeScreen() {
  const { t } = useTranslation();
  const { activeUser } = useActiveUserContext();

  if (!activeUser) {
    return <Redirect href="/loginScreen" />;
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
