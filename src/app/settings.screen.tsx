import { StackActions } from '@react-navigation/native';
import { Colors } from '@src/common/constants/colors';
import SwitchSelectorComponent from '@src/components/SwitchSelector.component';
import { useActiveUserContext } from '@src/context/userContext';
import { database } from '@src/database/database';
import { Redirect, router, useNavigation } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import { useState } from 'react';
import { CustomModal } from '@src/components/CustomModal.component';

export default function SettingsModal() {
  const { t } = useTranslation();
  const { activeUser, setActiveUser } = useActiveUserContext();
  const navigation = useNavigation();
  const [notificationsModalVisible, setNotificationsModalVisible] =
    useState<boolean>(false);
  const [deleteUserModalVisible, setDeleteUserModalVisible] =
    useState<boolean>(false);

  if (!activeUser) {
    return <Redirect href="/" />;
  }

  const confirmToDeleteUser = () => {
    try {
      database.deleteUser(activeUser.id);
      setActiveUser(null);
      const resetAction = StackActions.popToTop();
      navigation.dispatch(resetAction);
      router.replace('/');
    } catch (error) {
      console.error('error: ', error);
    }
  };

  const confirmToCancelNotifications = async () => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      setNotificationsModalVisible(false);
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
      <View style={styles.languageContainer}>
        <Text style={styles.languageText}>{t('cancelNotifications')}</Text>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => setNotificationsModalVisible(true)}
        >
          <Text style={styles.buttonText}>{t('cancel')}</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => setDeleteUserModalVisible(true)}
      >
        <Text style={styles.buttonText}>{t('deleteUserButton')}</Text>
      </TouchableOpacity>

      <CustomModal
        isVisible={notificationsModalVisible}
        text={`${t('cancelNotifications')} ?`}
        buttonTitle={t('confirm')}
        onButtonPress={async () => await confirmToCancelNotifications()}
        onClose={() => setNotificationsModalVisible(false)}
      />
      <CustomModal
        isVisible={deleteUserModalVisible}
        text={`${t('deleteUserConfirmation')} ${activeUser.name}`}
        buttonTitle={t('delete')}
        onButtonPress={confirmToDeleteUser}
        onClose={() => setDeleteUserModalVisible(false)}
      />
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
    bottom: '5%',
  },
  cancelButton: {
    backgroundColor: Colors.lightRed,
    padding: 5,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: '25%',
    borderColor: Colors.black,
    borderWidth: 1,
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
