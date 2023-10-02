import { Colors } from '@src/common/constants/colors';
import SwitchSelectorComponent from '@src/components/SwitchSelector.component';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsModal() {
  const { t } = useTranslation();

  return (
    <SafeAreaView edges={['right', 'bottom', 'left']} style={styles.container}>
      <View style={styles.languageContainer}>
        <Text style={styles.languageText}>{t('selectLanguage')}</Text>
        <SwitchSelectorComponent style={styles.switch} />
      </View>

      <TouchableOpacity style={styles.deleteButton}>
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
