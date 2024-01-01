import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import '@src/languages/i18n';
import { Colors } from '@src/common/constants/colors';
import { useUserHabitsContext } from '@src/context/habitsContext';
import {
  Link,
  Redirect,
  Stack,
  router,
  useLocalSearchParams,
} from 'expo-router';
import { useTranslation } from 'react-i18next';
import { database } from '@src/database/database';
import { useActiveUserContext } from '@src/context/userContext';
import {
  calculateCompletedHabitStats,
  isTodayAmongHabitDates,
} from '@src/common/helpers/habit.helper';
import { Feather } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import { IHabit } from '@src/common/interfaces/dbInterfaces';
import { CustomModal } from '@src/components/CustomModal.component';
import { useState } from 'react';

export default function SelectedHabitModal() {
  const { userHabits, setUserHabits, userHabitsDates, setUserHabitsDates } =
    useUserHabitsContext();
  const { habitId } = useLocalSearchParams();
  const { activeUser } = useActiveUserContext();
  const { t } = useTranslation();
  const [deleteHabitModalVisible, setDeleteHabitModalVisible] =
    useState<boolean>(false);

  const selectedHabit: IHabit | undefined = userHabits.find(
    (habit) => habit.id === Number(habitId),
  );

  if (!activeUser) {
    return <Redirect href="/login.screen" />;
  }
  if (!selectedHabit) {
    return <Redirect href="/home.screen" />;
  }

  const selectedHabitDates = userHabitsDates.filter(
    (habitDate) => habitDate.habitId === selectedHabit.id,
  );

  const isTodayCompleted = isTodayAmongHabitDates(selectedHabitDates);

  const confirmToDeleteHabit = async () => {
    try {
      if (selectedHabit.notificationId) {
        await Notifications.cancelScheduledNotificationAsync(
          selectedHabit.notificationId,
        );
      }

      await database.deleteUserHabit(selectedHabit.id);

      const dbUserHabits = await database.getUserHabits(activeUser.id);

      const dbUserHabitsDates = await database.getUserHabitsDates(
        activeUser.id,
      );
      setUserHabits(dbUserHabits);
      setUserHabitsDates(dbUserHabitsDates);

      router.replace('/home.screen');
    } catch (error) {
      console.error('error: ', error);
    }
  };

  const completeHabitOfTheDay = async () => {
    try {
      const calculatedHabit = calculateCompletedHabitStats(
        selectedHabit,
        selectedHabitDates,
      );

      await database.completeUserHabit(calculatedHabit);

      const dbUserHabits = await database.getUserHabits(activeUser.id);
      setUserHabits(dbUserHabits);

      const dbUserHabitsDates = await database.getUserHabitsDates(
        activeUser.id,
      );
      setUserHabitsDates(dbUserHabitsDates);
      router.replace('/home.screen');
    } catch (error) {
      console.error('error: ', error);
    }
  };

  return (
    <SafeAreaView edges={['right', 'bottom', 'left']} style={styles.container}>
      <StatusBar style="dark" />
      <Stack.Screen
        options={{
          headerLeft: undefined,
          headerRight: () => (
            <TouchableOpacity>
              <Link
                href={{
                  pathname: '/addHabit.screen',
                  params: {
                    habit: JSON.stringify(selectedHabit),
                    isEdit: String(true),
                  },
                }}
              >
                <Feather name="edit" size={26} color="black" />
              </Link>
            </TouchableOpacity>
          ),
        }}
      />

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
          {t('ask2')}: {selectedHabit?.ask === 0 ? t('no') : t('yes')}
        </Text>
        <Text style={styles.userTitle}>
          {t('notificationTime')}: {selectedHabit?.notificationTime ?? '-'}
        </Text>
        <Text style={styles.userTitle}>
          {t('isTodayCompleted')}: {isTodayCompleted ? t('yes') : t('no')}
        </Text>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            ...styles.completeButton,
            opacity: isTodayCompleted ? 0.5 : 1,
          }}
          onPress={() => void completeHabitOfTheDay()}
          disabled={!!isTodayCompleted}
        >
          <Text style={styles.buttonText}>{t('completeDayHabit')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            ...styles.completeButton,
            backgroundColor: Colors.errorColor,
          }}
          onPress={() => void setDeleteHabitModalVisible(true)}
        >
          <Text style={styles.buttonText}>{t('deleteHabit')}</Text>
        </TouchableOpacity>
      </View>

      <CustomModal
        isVisible={deleteHabitModalVisible}
        text={`${t('deleteHabitConfirmation')} ${selectedHabit?.habit}`}
        buttonTitle={t('delete')}
        onButtonPress={async () => await confirmToDeleteHabit()}
        onClose={() => setDeleteHabitModalVisible(false)}
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
    textAlign: 'justify',
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
