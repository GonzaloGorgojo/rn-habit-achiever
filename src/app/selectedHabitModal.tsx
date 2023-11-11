import { StatusBar } from 'expo-status-bar';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import '@src/languages/i18n';
import { Colors } from '@src/common/constants/colors';
import { useUserHabitsContext } from '@src/context/habitsContext';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { database } from '@src/database/database';
import { useActiveUserContext } from '@src/context/userContext';
import { calculateUpdatedHabitStats } from '@src/common/helpers/habit.helper';

export default function SelectedHabitModal() {
  const { userHabits, setUserHabits, setUserHabitsDates } =
    useUserHabitsContext();
  const { habitId } = useLocalSearchParams();
  const { activeUser } = useActiveUserContext();
  const { t } = useTranslation();

  const selectedHabit = userHabits.find(
    (habit) => habit.id === Number(habitId),
  );

  if (!activeUser) {
    return <Redirect href="/loginScreen" />;
  }
  if (!selectedHabit) {
    return <Redirect href="/homeScreen" />;
  }

  const deleteHabitAlert = async () =>
    new Promise((resolve) => {
      Alert.alert(
        `${t('confirm')}`,
        `${t('deleteHabitConfirmation')} ${selectedHabit?.habit}`,
        [
          {
            text: `${t('delete')}`,
            onPress: () => {
              resolve(true);
            },
          },
          {
            text: `${t('cancel')}`,
            onPress: () => resolve(false),
            style: 'cancel',
          },
        ],
        {
          cancelable: true,
          onDismiss: () => {},
        },
      );
    });

  const deleteHabit = async () => {
    const userSelection = await deleteHabitAlert();
    if (userSelection) {
      await database.deleteUserHabit(selectedHabit.id);

      const dbUserHabits = await database.getUserHabits(activeUser.id);
      setUserHabits(dbUserHabits);

      const dbUserHabitsDates = await database.getUserHabitsDates(
        activeUser.id,
      );
      setUserHabitsDates(dbUserHabitsDates);

      router.replace('/homeScreen');
    }
  };

  const completeHabitOfTheDay = async () => {
    selectedHabit.consecutiveDaysCompleted += 1;
    selectedHabit.isTodayCompleted = 1;

    const calculatedHabit = calculateUpdatedHabitStats(selectedHabit);

    await database.updateUserHabit(calculatedHabit);
    const dbUserHabits = await database.getUserHabits(activeUser.id);
    setUserHabits(dbUserHabits);

    const dbUserHabitsDates = await database.getUserHabitsDates(activeUser.id);
    setUserHabitsDates(dbUserHabitsDates);

    router.replace('/homeScreen');
  };

  return (
    <SafeAreaView edges={['right', 'bottom', 'left']} style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.selectedHabitContainer}>
        <Text style={styles.userTitle}>
          {t('habit')}: {selectedHabit?.habit}
        </Text>
        <Text style={styles.userTitle}>
          {t('selectedGoal')}: {selectedHabit?.goal} days
        </Text>
        <Text style={styles.userTitle}>
          {t('daysCompleted')}: {selectedHabit?.consecutiveDaysCompleted} days
        </Text>
        <Text style={styles.userTitle}>
          {t('maxDaysCompleted')}: {selectedHabit?.maxConsecutiveDaysCompleted}{' '}
          days
        </Text>
        <Text style={styles.userTitle}>
          {t('habitReached')}:{' '}
          {selectedHabit?.habitReached === 0 ? t('no') : t('yes')}
        </Text>
        <Text style={styles.userTitle}>
          {t('ask')}: {selectedHabit?.ask === 0 ? t('no') : t('yes')}
        </Text>
        <Text style={styles.userTitle}>
          {t('isTodayCompleted')}:{' '}
          {selectedHabit?.isTodayCompleted === 0 ? t('no') : t('yes')}
        </Text>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            ...styles.completeButton,
            opacity: selectedHabit.isTodayCompleted ? 0.5 : 1,
          }}
          onPress={() => void completeHabitOfTheDay()}
          disabled={!!selectedHabit.isTodayCompleted}
        >
          <Text style={styles.buttonText}>{t('completeDayHabit')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            ...styles.completeButton,
            backgroundColor: Colors.errorColor,
          }}
          onPress={() => void deleteHabit()}
        >
          <Text style={styles.buttonText}>{t('deleteHabit')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.black,
  },
  selectedHabitContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Colors.mainColor,
    borderWidth: 0.5,
    padding: 15,
    borderRadius: 10,
    position: 'absolute',
    top: '15%',
  },
  userTitle: {
    color: Colors.mainColor,
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 5,
  },
  completeButton: {
    width: '45%',
    height: 40,
    backgroundColor: Colors.mainColor,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.black,
    fontWeight: 'bold',
    fontSize: 18,
  },
  buttonsContainer: {
    flexDirection: 'row',
    position: 'absolute',
    justifyContent: 'space-around',
    bottom: '10%',
  },
});
