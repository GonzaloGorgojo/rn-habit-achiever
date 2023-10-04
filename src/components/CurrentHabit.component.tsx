/* eslint-disable react-native/no-inline-styles */
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import allHabits from '@src/database/habits.json';
import { IHabit } from '@src/common/interfaces/dbInterfaces';
import { calculatePercentage } from '@src/common/helpers/calculation.helper';
import { commonStyle } from '@src/common/style/commonStyle.style';
import { Colors } from '@src/common/constants/colors';
import { useTranslation } from 'react-i18next';

const CurrentHabit = () => {
  const { t } = useTranslation();
  const habits: IHabit[] = allHabits.filter(
    (habit) => habit.userId === 1 && habit.habitReached === false,
  ) as IHabit[];

  return (
    <View style={currentHabitStyle.container}>
      <Text style={commonStyle.title}>{t('currentHabits')}</Text>
      <View style={commonStyle.straightLine} />
      {habits?.length <= 0 ? (
        <Text style={commonStyle.habitText}>{t('noHabits')}</Text>
      ) : (
        <FlatList
          style={commonStyle.flatlist}
          data={habits}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const calculateColor =
              calculatePercentage(item.consecutiveDaysCompleted, item.goal) > 50
                ? Colors.mainColor
                : Colors.lightYellow;
            return (
              <TouchableOpacity style={commonStyle.habit} key={item.id}>
                <View
                  style={{
                    backgroundColor: calculateColor,
                    position: 'absolute',
                    left: 0,
                    right: `${
                      100 -
                      calculatePercentage(
                        item.consecutiveDaysCompleted,
                        item.goal,
                      )
                    }%`,
                    top: 0,
                    bottom: 0,
                    borderRadius: 10,
                  }}
                />
                <Text style={commonStyle.habitText}>
                  {item.habit}:{' '}
                  {calculatePercentage(
                    item.consecutiveDaysCompleted,
                    item.goal,
                  )}
                  %
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
};

export const currentHabitStyle = StyleSheet.create({
  container: {
    width: '95%',
    alignItems: 'center',
    marginVertical: 10,
    backgroundColor: Colors.mainColor,
    borderRadius: 10,
    height: '35%',
  },
});

export default CurrentHabit;
