import { Colors } from '@src/common/constants/colors';
import { ICreateHabit } from '@src/common/interfaces/dbInterfaces';
import { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Slider from 'react-native-a11y-slider';

export default function Modal() {
  const [newHabit, setNewHabit] = useState<ICreateHabit>({
    habit: '',
    goal: 21,
  });

  return (
    <SafeAreaView edges={['right', 'bottom', 'left']} style={styles.modal}>
      <Text style={styles.label}>What Habit you want to achieve? </Text>
      <TextInput
        style={styles.input}
        value={newHabit.habit}
        maxLength={40}
        placeholder="E.g: Reading, sleeping early."
        placeholderTextColor={Colors.grey}
        onChangeText={(txt) =>
          setNewHabit({
            ...newHabit,
            habit: txt,
          })
        }
      />
      <Text style={styles.label}>Goal: </Text>
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
        onPress={() => alert(JSON.stringify(newHabit))}
      >
        <Text style={styles.label}>Create Habit</Text>
      </TouchableOpacity>
      <View style={styles.informativeContainer}>
        <Ionicons name="information-circle-outline" size={24} color="black" />
        <Text style={styles.informative}>
          A habit is a repetitive behavior or routine that you perform almost
          automatically, often without consciously thinking about it. Habits can
          be both positive and negative, shaping our daily lives and long-term
          outcomes. It&apos;s often said that it takes around 21 to 66 days of
          consistent practice to turn an activity into a habit, though the exact
          timeframe can vary from person to person. Tracking your habits can
          help you become more aware of your actions and work towards the goal
          of making them a natural part of your daily life for a healthier and
          more productive lifestyle.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  modal: { flex: 1, alignItems: 'center', marginTop: 20 },
  input: {
    width: '80%',
    height: 40,
    borderColor: Colors.black,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginVertical: 5,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 3,
  },
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
