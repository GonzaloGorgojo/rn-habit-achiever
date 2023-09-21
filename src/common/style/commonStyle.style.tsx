import { StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

export const commonStyle = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  flatlist: {
    width: '90%',
    marginVertical: 10,
  },
  habit: {
    flexDirection: 'row',
    justifyContent: 'center',
    borderColor: Colors.black,
    borderRadius: 10,
    borderWidth: 1,
    marginVertical: 3,
    paddingVertical: 2,
  },
  straightLine: {
    width: '40%',
    borderWidth: 0.5,
    borderColor: Colors.black,
  },
});
