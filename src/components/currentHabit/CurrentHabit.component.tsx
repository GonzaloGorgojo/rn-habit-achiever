import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { currentHabitStyle } from './currentHabit.style';
import allHabits from '@src/database/habits.json';
import { IHabit } from '@src/common/interfaces/dbInterfaces';
import { calculatePercentage } from '@src/common/helpers/calculation.helper';
import { commonStyle } from '@src/common/style/commonStyle.style';

const CurrentHabit = () => {
  const habits: IHabit[] = allHabits.filter(
    (habit) => habit.userId === 1 && habit.habitReached === false,
  ) as IHabit[];

  return (
    <View style={currentHabitStyle.container}>
      <Text style={commonStyle.title}>Current Habits</Text>
      <View style={commonStyle.straightLine} />
      {habits?.length <= 0 ? (
        <Text>There are no habits</Text>
      ) : (
        <FlatList
          style={commonStyle.flatlist}
          data={habits}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity style={commonStyle.habit} key={item.id}>
                <Text>{item.habit}: </Text>
                <Text>
                  {calculatePercentage(item.consecutiveDaysCompleted)}%
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
};

export default CurrentHabit;
