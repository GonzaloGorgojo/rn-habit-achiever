import { Colors } from '@src/common/constants/colors';
import { commonStyle } from '@src/common/style/commonStyle.style';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SwitchSelector from 'react-native-switch-selector';

export default function SettingsModal() {
  const { t, i18n } = useTranslation();

  const options = [
    { label: 'Es', value: 'es' },
    { label: 'En', value: 'en' },
  ];
  const indexOfLan = options.findIndex((opt) => opt.value === i18n.language);

  return (
    <SafeAreaView edges={['right', 'bottom', 'left']} style={styles.container}>
      <Text style={commonStyle.label}>{t('selectLanguage')}:</Text>
      <View style={styles.switch}>
        <SwitchSelector
          accessibilityLabel="language-switch-selector"
          options={options}
          initial={indexOfLan}
          onPress={(value: string) => i18n.changeLanguage(value)}
          selectedColor={'black'}
          buttonColor={Colors.mainColor}
          borderColor={'black'}
          hasPadding
        />
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
});
