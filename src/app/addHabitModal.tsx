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
import { commonStyle } from '@src/common/style/commonStyle.style';
import { useTranslation } from 'react-i18next';

export default function Modal() {
  const { t } = useTranslation();
  const [newHabit, setNewHabit] = useState<ICreateHabit>({
    habit: '',
    goal: 21,
  });

  return (
    <SafeAreaView edges={['right', 'bottom', 'left']} style={styles.modal}>
      <Text style={commonStyle.label}>{t('addHabitQuestion')} </Text>
      <TextInput
        style={commonStyle.textInput}
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
        onPress={() => alert(JSON.stringify(newHabit))}
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
