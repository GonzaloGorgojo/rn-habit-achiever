import { StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

export const commonStyle = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  flatlist: {
    width: '90%',
    marginVertical: 10,
  },
  habit: {
    alignItems: 'center',
    borderColor: Colors.black,
    borderRadius: 10,
    borderWidth: 1.5,
    marginVertical: 3,
    paddingVertical: 2,
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    elevation: 2,
    shadowRadius: 10,
  },
  straightLine: {
    width: '50%',
    borderWidth: 0.5,
    borderColor: Colors.black,
  },
  habitText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
