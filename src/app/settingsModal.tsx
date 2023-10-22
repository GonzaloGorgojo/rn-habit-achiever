import { StackActions } from '@react-navigation/native';
import { Colors } from '@src/common/constants/colors';
import SwitchSelectorComponent from '@src/components/SwitchSelector.component';
import { useActiveUserContext } from '@src/context/userContext';
import { database } from '@src/database/database';
import { Redirect, router, useNavigation } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsModal() {
  const { t } = useTranslation();
  const { activeUser, setActiveUser } = useActiveUserContext();
  const navigation = useNavigation();

  if (!activeUser) {
    return <Redirect href="/" />;
  }

  const deleteUserAlert = async () =>
    new Promise((resolve) => {
      Alert.alert(
        `${t('confirm')}`,
        `${t('deleteUserConfirmation')} ${activeUser.name}`,
        [
          {
            text: 'ok',
            onPress: () => {
              database.deleteUser(activeUser.id);
              setActiveUser(null);
              resolve('YES');
            },
          },
          {
            text: 'Cancel',
            onPress: () => resolve('Cancel Pressed'),
            style: 'cancel',
          },
        ],
        {
          cancelable: true,
          onDismiss: () => {},
        },
      );
    });

  const deleteUser = async () => {
    try {
      await deleteUserAlert();
      const resetAction = StackActions.popToTop();
      navigation.dispatch(resetAction);
      router.replace('/');
    } catch (error) {
      console.error('error: ', error);
    }
  };

  return (
    <SafeAreaView edges={['right', 'bottom', 'left']} style={styles.container}>
      <View style={styles.languageContainer}>
        <Text style={styles.languageText}>{t('selectLanguage')}</Text>
        <SwitchSelectorComponent style={styles.switch} />
      </View>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => void deleteUser()}
      >
        <Text style={styles.buttonText}>{t('deleteUserButton')}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
  },
  deleteButton: {
    backgroundColor: Colors.lightRed,
    padding: 5,
    borderRadius: 10,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: '40%',
    borderColor: Colors.black,
    borderWidth: 1,
    position: 'absolute',
    bottom: 0,
  },
  buttonText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 18,
  },
  switch: {
    width: '20%',
    marginTop: 5,
  },
  languageContainer: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
    width: '100%',
    paddingLeft: 10,
  },
  languageText: {
    fontSize: 17,
    marginRight: 10,
  },
});
