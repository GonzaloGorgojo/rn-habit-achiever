import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { achievedHabitStyle } from './achievedHabit.style';
import allHabits from '@src/database/habits.json';
import { IHabit } from '@src/common/interfaces/dbInterfaces';
import { commonStyle } from '@src/common/style/commonStyle.style';

const AchievedHabit = () => {
  const achievedHabits = allHabits.filter(
    (habit) => habit.habitReached === true,
  ) as IHabit[];

  return (
    <View style={achievedHabitStyle.container}>
      <Text style={commonStyle.title}>Achieved Habits</Text>
      <View style={commonStyle.straightLine} />
      {achievedHabits?.length <= 0 ? (
        <Text>There are no habits</Text>
      ) : (
        <FlatList
          style={commonStyle.flatlist}
          data={achievedHabits}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity style={commonStyle.habit} key={item.id}>
                <Text style={commonStyle.habitText}>
                  {item.habit}: {item.consecutiveDaysCompleted} days
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
};

export default AchievedHabit;
