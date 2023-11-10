import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import { commonStyle } from '@src/common/style/commonStyle.style';
import { useTranslation } from 'react-i18next';
import { Colors } from '@src/common/constants/colors';
import { useUserHabitsContext } from '@src/context/habitsContext';
import { router } from 'expo-router';

const AchievedHabit = () => {
  const { t } = useTranslation();
  const { userHabits } = useUserHabitsContext();

  const achievedHabits = userHabits.filter((habit) => habit.habitReached === 1);

  const goToSelectedHabit = (habitId: number) => {
    router.push({
      pathname: '/selectedHabitModal',
      params: { habitId },
    });
  };

  return (
    <View style={achievedHabitStyle.container}>
      <Text style={commonStyle.title}>{t('achievedHabits')}</Text>
      <View style={commonStyle.straightLine} />
      {achievedHabits?.length <= 0 ? (
        <Text style={commonStyle.noHabitsText}>{t('noAchievedHabits')}</Text>
      ) : (
        <FlatList
          style={commonStyle.flatlist}
          data={achievedHabits}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                style={commonStyle.habit}
                key={item.id}
                onPress={() => goToSelectedHabit(item.id)}
              >
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

export const achievedHabitStyle = StyleSheet.create({
  container: {
    width: '95%',
    alignItems: 'center',
    height: '30%',
    marginBottom: 10,
    backgroundColor: Colors.mainColor,
    borderRadius: 10,
  },
});

export default AchievedHabit;
