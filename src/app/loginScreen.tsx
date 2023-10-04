import { Colors } from '@src/common/constants/colors';
import { commonStyle } from '@src/common/style/commonStyle.style';
import { database } from '@src/database/database';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const { t } = useTranslation();
  const [userName, setUserName] = useState<string>('');

  const createUser = (name: string) => {
    database.insertUser(name);
    setUserName('');
    alert('user was created');
  };

  return (
    <SafeAreaView edges={['right', 'bottom', 'left']} style={styles.container}>
      <StatusBar style="dark" />

      <Text style={styles.welcomeText}>{t('welcomeMessage')}</Text>

      <View style={styles.inputContainer}>
        <Text style={commonStyle.label}>{t('writeName')}</Text>
        <TextInput
          placeholder={t('namePlaceholder')}
          style={commonStyle.textInput}
          value={userName}
          onChangeText={(txt) => setUserName(txt)}
        />
      </View>

      <TouchableOpacity
        onPress={() => createUser(userName)}
        style={styles.creeateUserButton}
      >
        <Text>{t('createUser')}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  inputContainer: {
    marginVertical: 30,
    alignItems: 'center',
    width: '80%',
  },
  welcomeText: {
    width: '80%',
    textAlign: 'justify',
    marginVertical: 30,
    fontSize: 16,
    fontWeight: 'bold',
  },
  creeateUserButton: {
    backgroundColor: Colors.mainColor,
    padding: 10,
    borderRadius: 5,
    borderColor: Colors.black,
    borderWidth: 0.5,
  },
});
