import { commonStyle } from '@src/common/style/commonStyle.style';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors } from '@src/common/constants/colors';
import CalendarHeatmap from 'react-native-calendar-heatmap';
import { useUserHabitsContext } from '@src/context/habitsContext';
import dayjs from 'dayjs';
import dayOfYear from 'dayjs/plugin/dayOfYear';

const isAndroid = Platform.OS === 'android' ? true : false;
dayjs.extend(dayOfYear);

const HabitsGraph = () => {
  const { t } = useTranslation();
  const { userHabitsDates } = useUserHabitsContext();

  const extractedDatesValues = userHabitsDates.map((habit) => {
    return { date: habit.dateCompleted };
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
          endDate={dayjs().toDate()}
          numDays={364}
          gutterSize={2}
          colorArray={[
            Colors.black,
            Colors.lightOrange,
            Colors.lightYellow,
            Colors.lighterMainColor,
            Colors.lightMainColor,
          ]}
          values={extractedDatesValues}
          onPress={(value: number) => {
            console.log(value);
            // console.log(dayjs().dayOfYear(value).format(dateFormat));
          }}
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
