import { Colors } from '@src/common/constants/colors';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsModal() {
  return (
    <SafeAreaView edges={['right', 'bottom', 'left']} style={styles.container}>
      <Text>Settings</Text>
      <Text>Select Language</Text>

      <TouchableOpacity style={styles.deleteButton}>
        <Text style={styles.buttonText}>Delete User</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    width: '95%',
  },
  deleteButton: {
    backgroundColor: Colors.errorColor,
    padding: 5,
    borderRadius: 10,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: '40%',
    borderColor: Colors.black,
    borderWidth: 1,
  },
  buttonText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 18,
  },
});
