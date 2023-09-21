import { Colors } from '@src/common/constants/colors';
import { ICreateHabit } from '@src/common/interfaces/dbInterfaces';
import { useState } from 'react';
import { StyleSheet, Text, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Modal() {
  const [newHabit, setNewHabit] = useState<ICreateHabit>({
    habit: '',
    description: '',
  });

  console.log(newHabit);

  return (
    <SafeAreaView edges={['right', 'bottom', 'left']} style={styles.modal}>
      <Text style={styles.label}>What Habit you want to achieve ? </Text>
      <TextInput
        style={styles.input}
        value={newHabit.habit}
        placeholder="E.g: Reading, sleeping early."
        placeholderTextColor={Colors.grey}
        onChangeText={(txt) =>
          setNewHabit({
            ...newHabit,
            habit: txt,
          })
        }
      />
      <Text style={styles.label}>Description of that Habit: </Text>
      <TextInput
        style={styles.input}
        selectionColor={Colors.mainColor}
        value={newHabit.description}
        placeholder="E.g: Reading 30 minutes a day."
        placeholderTextColor={Colors.grey}
        onChangeText={(txt) =>
          setNewHabit({
            ...newHabit,
            description: txt,
          })
        }
      />
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
  },
});
