import { Colors } from '@src/common/constants/colors';
import {
  ICreateHabit,
  IHabit,
  IHabitInput,
  IHabitNotification,
} from '@src/common/interfaces/dbInterfaces';
import { useState } from 'react';
import {
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Slider from 'react-native-a11y-slider';
import { commonStyle } from '@src/common/style/commonStyle.style';
import { useTranslation } from 'react-i18next';
import { useUserHabitsContext } from '@src/context/habitsContext';
import { useActiveUserContext } from '@src/context/userContext';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import {
  calculateNewHabitStats,
  calculateUpdateHabitStats,
} from '@src/common/helpers/habit.helper';
import { StackActions } from '@react-navigation/native';
import { database } from '@src/database/database';
import { ScrollView } from 'react-native-gesture-handler';
import { TimerPickerModal } from 'react-native-timer-picker';
import { formatTime } from '@src/common/helpers/calculation.helper';
import * as Notifications from 'expo-notifications';
import { CustomModal } from '@src/components/CustomModal.component';

export default function Modal() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { activeUser } = useActiveUserContext();
  const { habit, isEdit } = useLocalSearchParams();
  const { setUserHabits } = useUserHabitsContext();

  const [createHabitModalVisible, setCreateHabitModalVisible] =
    useState<boolean>(false);
  const [editHabitModalVisible, setEditHabitModalVisible] =
    useState<boolean>(false);
  const [borderColor, setBorderColor] = useState<string>(Colors.lightMainColor);

  const habitToEdit: IHabit | null = habit
    ? (JSON.parse(habit as string) as IHabit)
    : null;

  const [newHabit, setNewHabit] = useState<ICreateHabit>({
    habit: habitToEdit?.habit ?? '',
    goal: habitToEdit?.goal ?? 21,
  });

  const [habitNotification, setHabitNotification] =
    useState<IHabitNotification>({
      time: habitToEdit?.notificationTime ?? null,
      id: habitToEdit?.notificationId ?? null,
    });

  const [isEnabled, setIsEnabled] = useState<boolean>(
    habitToEdit?.ask ? true : false,
  );
  const [isVisible, setIsVisible] = useState<boolean>(false);

  if (!activeUser) {
    const resetAction = StackActions.popToTop();
    navigation.dispatch(resetAction);
    return router.replace('/login.screen');
  }

  const checkInputAndCallModal = () => {
    if (newHabit.habit.trim().length <= 0 || isNaN(newHabit.goal)) {
      setBorderColor(Colors.errorColor);
    } else {
      setBorderColor(Colors.grey);
      if (isEdit) {
        setEditHabitModalVisible(true);
      } else {
        setCreateHabitModalVisible(true);
      }
    }
  };

  const schedulePushNotification = async (
    notiTime: string,
  ): Promise<string> => {
    console.log('scheduling notification');
    const [hour, minutes] = notiTime.split(':');

    const notificationIdentifier =
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "You've got mail! 📬",
          body: 'Here is the notification body',
        },
        trigger: { hour: Number(hour), minute: Number(minutes), repeats: true },
      });

    return notificationIdentifier;
  };

  const toggleSwitch = () => {
    setIsEnabled((previousState) => !previousState);
    if (!isEnabled) {
      setIsVisible(true);
    }
  };

  const confirmToCreateHabit = async () => {
    try {
      const notificationId =
        isEnabled && habitNotification.time
          ? await schedulePushNotification(habitNotification.time)
          : null;

      const notificationTime = isEnabled ? habitNotification.time : null;

      const calculatedHabit: IHabitInput = calculateNewHabitStats(
        newHabit,
        activeUser.id,
        isEnabled && habitNotification.time ? 1 : 0,
        notificationId,
        notificationTime,
      );

      await database.insertUserHabit(calculatedHabit);

      const dbUserHabits = await database.getUserHabits(activeUser.id);
      setUserHabits(dbUserHabits);

      router.replace('/home.screen');
      setNewHabit({
        habit: '',
        goal: 21,
      });
    } catch (error) {
      console.error('error: ', error);
    }
  };

  const confirmToEditHabit = async () => {
    try {
      if (habitToEdit) {
        if (habitToEdit.notificationId) {
          await Notifications.cancelScheduledNotificationAsync(
            habitToEdit.notificationId,
          );
        }

        const notificationId =
          isEnabled && habitNotification.time
            ? await schedulePushNotification(habitNotification.time)
            : null;

        const notificationTime = isEnabled ? habitNotification.time : null;

        const calculatedHabit: IHabit = calculateUpdateHabitStats(
          habitToEdit,
          newHabit,
          activeUser.id,
          isEnabled && habitNotification.time ? 1 : 0,
          notificationId,
          notificationTime,
        );

        await database.updateUserHabit(calculatedHabit);

        const dbUserHabits = await database.getUserHabits(activeUser.id);
        setUserHabits(dbUserHabits);

        router.replace('/home.screen');
      }
    } catch (error) {
      console.error('error: ', error);
    }
  };

  return (
    <SafeAreaView edges={['right', 'bottom', 'left']}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.inputsContainer}>
          <Text style={commonStyle.label}>{t('addHabitQuestion')} </Text>
          <TextInput
            style={{
              ...commonStyle.textInput,
              borderColor: borderColor,
              color: Colors.mainColor,
            }}
            value={newHabit.habit}
            maxLength={40}
            placeholder={t('exampleHabit')}
            placeholderTextColor={Colors.lightMainColor}
            onChangeText={(txt) =>
              setNewHabit({
                ...newHabit,
                habit: txt,
              })
            }
          />
        </View>

        <View style={styles.inputsContainer}>
          <Text style={commonStyle.label}>{t('ask')} </Text>
          <Switch
            trackColor={{ false: '#767577', true: Colors.lightMainColor }}
            thumbColor={isEnabled ? Colors.mainColor : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
          {isEnabled && habitNotification.time ? (
            <View style={styles.timeContainer}>
              <Text style={commonStyle.label}>{t('selectedTime')} </Text>
              <Text style={commonStyle.label}>{habitNotification.time}</Text>
            </View>
          ) : null}
        </View>

        <TimerPickerModal
          modalTitle="Set notification time"
          visible={isVisible}
          setIsVisible={setIsVisible}
          onConfirm={(pickedDuration) => {
            setHabitNotification({
              ...habitNotification,
              time: formatTime(pickedDuration),
            });
            setIsVisible(false);
          }}
          onCancel={() => {
            setIsVisible(false);
            setIsEnabled(false);
          }}
          closeOnOverlayPress={false}
          modalProps={{
            overlayOpacity: 0.2,
          }}
          hideSeconds
          // eslint-disable-next-line react-native/no-inline-styles
          styles={{
            theme: 'dark',
          }}
        />

        <View style={styles.inputsContainer}>
          <Text style={commonStyle.label}>{t('goal')}: </Text>
          <View style={styles.slider}>
            <Slider
              labelStyle={styles.markerStyle}
              markerColor={Colors.mainColor}
              min={21}
              max={66}
              values={[newHabit.goal]}
              onChange={(val: number[]) =>
                setNewHabit({ ...newHabit, goal: val[0] })
              }
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.createButton}
          onPress={() => void checkInputAndCallModal()}
        >
          <Text style={{ ...commonStyle.label, color: Colors.black }}>
            {isEdit ? t('editHabitButton') : t('createHabitButton')}
          </Text>
        </TouchableOpacity>

        <View style={styles.informativeContainer}>
          <Ionicons
            name="information-circle-outline"
            size={28}
            color={Colors.mainColor}
          />
          <Text style={styles.informative}>{t('information')}</Text>
        </View>
      </ScrollView>

      <CustomModal
        isVisible={createHabitModalVisible}
        text={`${t('confirmHabitName')} ${newHabit.habit}  ${t(
          'confirmHabitDays',
        )} ${newHabit.goal}`}
        buttonTitle={t('create')}
        onButtonPress={async () => await confirmToCreateHabit()}
        onClose={() => setCreateHabitModalVisible(false)}
      />
      <CustomModal
        isVisible={editHabitModalVisible}
        text={`${t('confirmHabitName')} ${newHabit.habit}  ${t(
          'confirmHabitDays',
        )} ${newHabit.goal}`}
        buttonTitle={t('edit')}
        onButtonPress={async () => await confirmToEditHabit()}
        onClose={() => setEditHabitModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  createButton: {
    width: '40%',
    height: 40,
    backgroundColor: Colors.mainColor,
    borderRadius: 10,
    borderColor: Colors.black,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  informativeContainer: {
    width: '80%',
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colors.mainColor,
    borderRadius: 10,
    borderWidth: 0.5,
    padding: 5,
    marginBottom: 10,
  },
  informative: {
    fontSize: 17,
    textAlign: 'justify',
    padding: 5,
    color: Colors.mainColor,
  },
  slider: {
    width: '70%',
    marginBottom: 20,
  },
  inputsContainer: {
    alignItems: 'center',
    width: '80%',
    marginVertical: 5,
    borderColor: Colors.mainColor,
    borderWidth: 0.5,
    borderRadius: 10,
    padding: 5,
  },
  scrollContainer: {
    paddingTop: 5,
    alignItems: 'center',
    backgroundColor: Colors.black,
  },
  timeContainer: {
    alignItems: 'center',
  },
  markerStyle: {
    backgroundColor: Colors.mainColor,
    borderRadius: 10,
  },
});
