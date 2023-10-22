import { Colors } from '@src/common/constants/colors';
import { ICreateHabit, IHabit } from '@src/common/interfaces/dbInterfaces';
import { useState } from 'react';
import {
  Alert,
  StyleSheet,
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
import { router, useNavigation } from 'expo-router';
import { calculateHabitStats } from '@src/common/helpers/habit.helper';
import { StackActions } from '@react-navigation/native';
import { database } from '@src/database/database';

export default function Modal() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [borderColor, setBorderColor] = useState<string>(Colors.grey);
  const { activeUser } = useActiveUserContext();
  const { setUserHabits } = useUserHabitsContext();
  const [newHabit, setNewHabit] = useState<ICreateHabit>({
    habit: '',
    goal: 21,
  });

  if (!activeUser) {
    const resetAction = StackActions.popToTop();
    navigation.dispatch(resetAction);
    return router.replace('/loginScreen');
  }

  const createHabit = async (habitName: string, habitDays: number) => {
    if (habitName.trim().length <= 0 || isNaN(habitDays)) {
      setBorderColor(Colors.errorColor);
    } else {
      setBorderColor(Colors.grey);
      await confirmHabitAlert(habitName, habitDays);
      const newHabit: IHabit = calculateHabitStats(
        { habit: habitName, goal: habitDays },
        activeUser.id,
      );
      await database.insertUserHabit(newHabit);
      const dbUserHabits = await database.getUserHabits(activeUser.id);
      setUserHabits(dbUserHabits);
      router.replace('/homeScreen');
    }
    setNewHabit({ habit: '', goal: 21 });
  };

  const confirmHabitAlert = async (habitName: string, habitDays: number) =>
    new Promise((resolve) => {
      Alert.alert(
        `${t('confirm')}`,
        `${t('confirmHabitName')} ${habitName}  ${t(
          'confirmHabitDays',
        )} ${habitDays}`,
        [
          {
            style: 'default',
            text: `${t('create')}`,
            onPress: () => {
              resolve('YES');
            },
          },
          {
            style: 'cancel',
            text: `${t('cancel')}`,
            onPress: () => resolve('Cancel Pressed'),
          },
        ],
        {
          cancelable: true,
          onDismiss: () => {},
        },
      );
    });

  return (
    <SafeAreaView edges={['right', 'bottom', 'left']} style={styles.modal}>
      <Text style={commonStyle.label}>{t('addHabitQuestion')} </Text>
      <TextInput
        style={{ ...commonStyle.textInput, borderColor: borderColor }}
        value={newHabit.habit}
        maxLength={40}
        placeholder={t('exampleHabit')}
        placeholderTextColor={Colors.grey}
        onChangeText={(txt) =>
          setNewHabit({
            ...newHabit,
            habit: txt,
          })
        }
      />
      <Text style={commonStyle.label}>{t('goal')}: </Text>
      <View style={styles.slider}>
        <Slider
          min={21}
          max={66}
          values={[]}
          onChange={(val: number[]) =>
            setNewHabit({ ...newHabit, goal: val[0] })
          }
        />
      </View>
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => void createHabit(newHabit.habit, newHabit.goal)}
      >
        <Text style={commonStyle.label}>{t('createHabitButton')}</Text>
      </TouchableOpacity>
      <View style={styles.informativeContainer}>
        <Ionicons name="information-circle-outline" size={28} color="black" />
        <Text style={styles.informative}>{t('information')}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  modal: { flex: 1, alignItems: 'center', marginTop: 20 },
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
  },
  informative: {
    fontSize: 17,
    textAlign: 'justify',
    padding: 5,
  },
  slider: {
    width: '70%',
    marginBottom: 20,
  },
});
