import { Colors } from '@src/common/constants/colors';
import { StyleSheet } from 'react-native';

export const currentHabitStyle = StyleSheet.create({
  container: {
    flex: 1,
    width: '95%',
    alignItems: 'center',
    height: '40%',
    marginVertical: 10,
    backgroundColor: Colors.mainColor,
    borderRadius: 10,
  },
});
