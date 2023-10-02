import { Colors } from '@src/common/constants/colors';
import { Link, Stack } from 'expo-router';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import users from '@src/database/users.json';
import { IUser } from '@src/common/interfaces/dbInterfaces';
import { useTranslation } from 'react-i18next';
import SwitchSelectorComponent from '@src/components/SwitchSelector.component';

export default function Layout() {
  const { t } = useTranslation();
  const activeUser: IUser = users.find((user) => user.active) as IUser;

  return (
    <Stack
      screenOptions={{
        title: `${t('welcome')} ${activeUser?.name}!`,
        headerStyle: {
          backgroundColor: Colors.mainColor,
        },
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontWeight: 'bold',
        },

        headerRight: () => (
          <TouchableOpacity onPress={() => alert('Settings')}>
            <Link href="/settingsModal">
              <AntDesign name="setting" size={30} color="black" />
            </Link>
          </TouchableOpacity>
        ),

        headerLeft: () => (
          <TouchableOpacity>
            <Link href="/addHabitModal">
              <AntDesign name="pluscircleo" size={28} color="black" />
            </Link>
          </TouchableOpacity>
        ),
      }}
    >
      <Stack.Screen name="homeScreen" />
      <Stack.Screen
        name="loginScreen"
        options={{
          title: 'Habit Achiever',
          headerLeft: undefined,
          headerRight: () => (
            <SwitchSelectorComponent style={styles.selectorStyle} />
          ),
        }}
      />
      <Stack.Screen
        name="addHabitModal"
        options={{
          presentation: 'modal',
          headerLeft: undefined,
        }}
      />
      <Stack.Screen
        name="settingsModal"
        options={{
          presentation: 'modal',
          headerLeft: undefined,
          headerRight: undefined,
        }}
      />
    </Stack>
  );
}

export const styles = StyleSheet.create({
  selectorStyle: {
    width: 80,
  },
});
