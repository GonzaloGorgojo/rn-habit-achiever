import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import '@src/languages/i18n';
import { Colors } from '@src/common/constants/colors';
import CurrentHabit from '@src/components/CurrentHabit.component';
import AchievedHabit from '@src/components/AchievedHabit.component';
import Statistics from '@src/components/Statistics.component';
import { Redirect } from 'expo-router';
import { IUser } from '@src/common/interfaces/dbInterfaces';
import users from '@src/database/users.json';

export default function HomeScreen() {
  const activeUser: IUser = users.find((user) => user.active) as IUser;

  if (!activeUser) {
    return <Redirect href="/loginScreen" />;
  }

  return (
    <SafeAreaView edges={['right', 'bottom', 'left']} style={styles.container}>
      <StatusBar style="dark" />
      <CurrentHabit />
      <AchievedHabit />
      <Statistics />
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
