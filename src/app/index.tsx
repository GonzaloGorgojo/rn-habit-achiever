import AchievedHabit from '@src/components/achievedHabits/AchievedHabit.component';
import CurrentHabit from '@src/components/currentHabit/CurrentHabit.component';
import Statistics from '@src/components/stadistics/Statistics.component';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Page() {
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
  },
});
