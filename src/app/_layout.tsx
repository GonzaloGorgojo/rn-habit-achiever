import { Colors } from '@src/common/constants/colors';
import { Link, Stack } from 'expo-router';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import SwitchSelectorComponent from '@src/components/SwitchSelector.component';
import { ActiveUserContextProvider } from '@src/context/userContext';
import { UserHabitsContextProvider } from '@src/context/habitsContext';

export default function Layout() {
  return (
    <ActiveUserContextProvider>
      <UserHabitsContextProvider>
        <Stack
          screenOptions={{
            title: 'Habit Achiever',
            headerBackTitleVisible: false,

            headerStyle: {
              backgroundColor: Colors.mainColor,
            },
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontWeight: 'bold',
            },

            headerRight: () => (
              <TouchableOpacity>
                <Link href="/settings.screen">
                  <AntDesign name="setting" size={30} color="black" />
                </Link>
              </TouchableOpacity>
            ),

            headerLeft: () => (
              <TouchableOpacity>
                <Link href="/addHabit.screen">
                  <AntDesign name="pluscircleo" size={28} color="black" />
                </Link>
              </TouchableOpacity>
            ),
          }}
        >
          <Stack.Screen name="home.screen" />
          <Stack.Screen
            name="login.screen"
            options={{
              title: 'Habit Achiever',
              headerLeft: undefined,
              headerRight: () => (
                <SwitchSelectorComponent style={styles.selectorStyle} />
              ),
            }}
          />
          <Stack.Screen
            name="addHabit.screen"
            options={{
              headerLeft: undefined,
            }}
          />
          <Stack.Screen
            name="settings.screen"
            options={{
              headerLeft: undefined,
              headerRight: undefined,
            }}
          />
        </Stack>
      </UserHabitsContextProvider>
    </ActiveUserContextProvider>
  );
}

export const styles = StyleSheet.create({
  selectorStyle: {
    width: 70,
  },
});
