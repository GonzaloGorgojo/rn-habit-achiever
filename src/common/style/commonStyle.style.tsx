import { StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

export const commonStyle = StyleSheet.create({
  title: {
    marginTop: 1,
    fontSize: 18,
    fontWeight: 'bold',
  },
  flatlist: {
    width: '90%',
    marginVertical: 10,
  },
  habit: {
    alignItems: 'center',
    borderColor: Colors.black,
    borderRadius: 8,
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
    fontSize: 14,
    fontWeight: '500',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 3,
  },
  textInput: {
    width: '80%',
    height: 40,
    borderColor: Colors.black,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginVertical: 5,
  },
  noHabitsText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.black,
    margin: 10,
  },
});
