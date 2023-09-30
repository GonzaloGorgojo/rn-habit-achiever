import { commonStyle } from '@src/common/style/commonStyle.style';
import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  return (
    <SafeAreaView edges={['right', 'bottom', 'left']} style={styles.container}>
      <StatusBar style="dark" />

      <Text>
        Welcome to your next friend to achieve your habits and modify your life.
      </Text>

      <Text style={commonStyle.label}>
        Please write your name to track your habits
      </Text>
      <TextInput placeholder="Your name..." style={commonStyle.textInput} />

      <Button title="Create user" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
});
