import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { achievedHabitStyle } from './achievedHabit.style';
import allHabits from '@src/database/habits.json';
import { IHabit } from '@src/common/interfaces/dbInterfaces';
import { commonStyle } from '@src/common/style/commonStyle.style';
import { useTranslation } from 'react-i18next';

const AchievedHabit = () => {
  const { t } = useTranslation();
  const achievedHabits = allHabits.filter(
    (habit) => habit.habitReached === true,
  ) as IHabit[];

  return (
    <View style={achievedHabitStyle.container}>
      <Text style={commonStyle.title}>{t('achievedHabits')}</Text>
      <View style={commonStyle.straightLine} />
      {achievedHabits?.length <= 0 ? (
        <Text>{t('noHabits')}s</Text>
      ) : (
        <FlatList
          style={commonStyle.flatlist}
          data={achievedHabits}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity style={commonStyle.habit} key={item.id}>
                <Text style={commonStyle.habitText}>
                  {item.habit}: {item.consecutiveDaysCompleted} {t('days')}
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
