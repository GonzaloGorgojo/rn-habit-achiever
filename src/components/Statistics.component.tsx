import { commonStyle } from '@src/common/style/commonStyle.style';
import { Platform, StyleSheet, Text, View } from 'react-native';
import allHabits from '@src/database/habits.json';
import { useTranslation } from 'react-i18next';
import { Colors } from '@src/common/constants/colors';

const isAndroid = Platform.OS === 'android' ? true : false;

const Statistics = () => {
  const { t } = useTranslation();
  const habitsAchieved = allHabits.filter(
    (habit) => habit.habitReached === true,
  );

  const currentHabits = allHabits.filter(
    (habit) => habit.habitReached === false,
  );

  return (
    <View style={statisticsStyle.container}>
      <Text style={commonStyle.title}>{t('habitsStatistics')}</Text>
      <View style={commonStyle.straightLine} />

      <View style={statisticsStyle.rowView}>
        <View style={statisticsStyle.columnView}>
          <Text style={statisticsStyle.title}>Last 365 days: </Text>
          <Text>{habitsAchieved.length}</Text>
        </View>
        <View style={statisticsStyle.columnView}>
          <Text style={statisticsStyle.title}>Total Achieved: </Text>
          <Text>{habitsAchieved.length}</Text>
        </View>
      </View>

      <View style={statisticsStyle.rowView}>
        <View style={statisticsStyle.columnView}>
          <Text style={statisticsStyle.title}>Consecutive days: </Text>
          <Text>{currentHabits.length}</Text>
        </View>
        <View style={statisticsStyle.columnView}>
          <Text style={statisticsStyle.title}>Current Habits: </Text>
          <Text>{currentHabits.length}</Text>
        </View>
      </View>
    </View>
  );
};

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

export default Statistics;
