import { Colors } from '@src/common/constants/colors';
import { commonStyle } from '@src/common/style/commonStyle.style';
import { CustomModal } from '@src/components/CustomModal.component';
import { useActiveUserContext } from '@src/context/userContext';
import { database } from '@src/database/database';
import { Redirect, router } from 'expo-router';
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
  const [borderColor, setBorderColor] = useState<string>(Colors.grey);
  const { activeUser, setActiveUser } = useActiveUserContext();
  const [createUserModalVisible, setCreateUserModalVisible] =
    useState<boolean>(false);

  if (activeUser) {
    <Redirect href="/home.screen" />;
  }

  const createUser = (name: string) => {
    if (name.trim().length <= 0) {
      setBorderColor(Colors.errorColor);
    } else {
      setBorderColor(Colors.grey);
      setCreateUserModalVisible(true);
    }
  };

  const confirmToCreateUser = async () => {
    try {
      database.insertUser(userName);
      const activeUser = await database.getActiveUser();
      setActiveUser(activeUser);
      router.replace('/home.screen');
      setUserName('');
    } catch (error) {
      console.log('error: ', error);
    }
  };

  return (
    <SafeAreaView edges={['right', 'bottom', 'left']} style={styles.container}>
      <StatusBar style="dark" />

      <Text style={styles.welcomeText}>{t('welcomeMessage')}</Text>

      <View style={styles.inputContainer}>
        <Text style={{ ...commonStyle.label, color: Colors.black }}>
          {t('writeName')}
        </Text>
        <TextInput
          placeholder={t('namePlaceholder')}
          style={[commonStyle.textInput, { borderColor: borderColor }]}
          value={userName}
          onChangeText={(txt) => setUserName(txt)}
        />
      </View>

      <TouchableOpacity
        onPress={() => void createUser(userName)}
        style={styles.creeateUserButton}
      >
        <Text>{t('createUser')}</Text>
      </TouchableOpacity>

      <CustomModal
        isVisible={createUserModalVisible}
        text={`${t('confirmUser')} ${userName}`}
        buttonTitle={t('confirm')}
        onButtonPress={async () => await confirmToCreateUser()}
        onClose={() => setCreateUserModalVisible(false)}
      />
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
