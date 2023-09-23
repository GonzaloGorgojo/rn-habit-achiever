import { Colors } from '@src/common/constants/colors';
import { Platform, StyleSheet } from 'react-native';

const isAndroid = Platform.OS === 'android' ? true : false;

export const statisticsStyle = StyleSheet.create({
  container: {
    width: '95%',
    alignItems: 'center',
    height: '20%',
    backgroundColor: Colors.mainColor,
    borderRadius: 10,
    marginBottom: isAndroid ? 10 : 0,
  },
  rowView: {
    flexDirection: 'row',
    marginVertical: isAndroid ? 8 : 5,
  },
  columnView: {
    width: '40%',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colors.black,
    borderWidth: 1,
    borderRadius: 10,
    marginHorizontal: 5,
    backgroundColor: Colors.white,
    paddingBottom: 2,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});
