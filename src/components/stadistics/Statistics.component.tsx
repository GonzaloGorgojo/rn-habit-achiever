import { commonStyle } from '@src/common/style/commonStyle.style';
import { Text, View } from 'react-native';
import { statisticsStyle } from './statistics.style';
import allHabits from '@src/database/habits.json';
import { useTranslation } from 'react-i18next';

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

export default Statistics;
