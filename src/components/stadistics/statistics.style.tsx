import { Colors } from '@src/common/constants/colors';
import { StyleSheet } from 'react-native';

export const statisticsStyle = StyleSheet.create({
  container: {
    width: '95%',
    alignItems: 'center',
    height: '20%',
    backgroundColor: Colors.mainColor,
    borderRadius: 10,
  },
  rowView: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  columnView: {
    width: '40%',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colors.black,
    borderWidth: 1,
    borderRadius: 10,
    marginHorizontal: 5,
  },
});
