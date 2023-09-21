import { Colors } from '@src/common/constants/colors';
import { Link, Stack } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import users from '@src/database/users.json';
import { IUser } from '@src/common/interfaces/dbInterfaces';

export default function Layout() {
  const activeUser: IUser = users.find((user) => user.active) as IUser;

  return (
    <Stack
      screenOptions={{
        title: `Welcome ${activeUser?.name} !`,
        headerStyle: {
          backgroundColor: Colors.mainColor,
        },
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontWeight: 'bold',
        },

        headerRight: () => (
          <TouchableOpacity onPress={() => alert('Settings')}>
            <AntDesign name="setting" size={30} color="black" />
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
      <Stack.Screen name="index" />
      <Stack.Screen
        name="addHabitModal"
        options={{
          presentation: 'modal',
          headerLeft: undefined,
        }}
      />
    </Stack>
  );
}
