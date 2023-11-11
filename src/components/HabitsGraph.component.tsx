import { commonStyle } from '@src/common/style/commonStyle.style';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors } from '@src/common/constants/colors';
import CalendarHeatmap from 'react-native-calendar-heatmap';
import { useUserHabitsContext } from '@src/context/habitsContext';

const isAndroid = Platform.OS === 'android' ? true : false;

const HabitsGraph = () => {
  const { t } = useTranslation();
  const { userHabitsDates } = useUserHabitsContext();

  const extractedDates = userHabitsDates.map((habit) => habit.dateCompleted);

  const uniqueDates = Array.from(new Set(extractedDates));

  const formattedDate = uniqueDates.map((date) => {
    return { date };
  });

  return (
    <View style={statisticsStyle.container}>
      <Text style={commonStyle.title}>{t('habitsGraph')}</Text>
      <View style={commonStyle.straightLine} />

      <ScrollView
        style={statisticsStyle.graph}
        horizontal={true}
        contentContainerStyle={statisticsStyle.graphScrollable}
      >
        <CalendarHeatmap
          endDate={new Date()}
          numDays={365}
          gutterSize={2}
          colorArray={[Colors.black, Colors.lightYellow]}
          values={formattedDate}
          onPress={() => alert('Dalma ese dia besaste a malbec')}
        />
      </ScrollView>
    </View>
  );
};

export const statisticsStyle = StyleSheet.create({
  container: {
    width: '95%',
    alignItems: 'center',
    height: '35%',
    backgroundColor: Colors.mainColor,
    borderRadius: 10,
    marginBottom: isAndroid ? 10 : 0,
  },
  graph: {
    width: '95%',
  },
  graphScrollable: {
    height: '85%',
    alignItems: 'center',
  },
});

export default HabitsGraph;
