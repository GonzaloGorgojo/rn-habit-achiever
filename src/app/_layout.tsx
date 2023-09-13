import { Colors } from "@src/constants/colors";
import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        title: "Habit Tracker",
        headerStyle: {
          backgroundColor: Colors.mainColor,
        },
        headerTitleAlign: "center",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    />
  );
}
