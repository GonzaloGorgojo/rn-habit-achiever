import AchievedHabit from '@src/components/achievedHabits/AchievedHabit.component';
import CurrentHabit from '@src/components/currentHabit/CurrentHabit.component';
import Statistics from '@src/components/stadistics/Statistics.component';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import '@src/languages/i18n';
import { Colors } from '@src/common/constants/colors';

export default function HomeScreen() {
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
