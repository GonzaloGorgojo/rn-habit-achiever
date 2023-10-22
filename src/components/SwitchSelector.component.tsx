import { Colors } from '@src/common/constants/colors';
import { ICommonProps } from '@src/common/interfaces/dbInterfaces';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import SwitchSelector from 'react-native-switch-selector';

const SwitchSelectorComponent = ({ style }: ICommonProps) => {
  const { t, i18n } = useTranslation();

  const options = [
    { label: `${t('spanish')}`, value: 'es' },
    { label: `${t('english')}`, value: 'en' },
  ];
  const indexOfLan = options.findIndex((opt) => opt.value === i18n.language);

  return (
    <View style={style}>
      <SwitchSelector
        accessibilityLabel="language-switch-selector"
        options={options}
        initial={indexOfLan}
        onPress={(value: string) => i18n.changeLanguage(value)}
        hasPadding
        selectedColor={Colors.lightRed}
        buttonColor={Colors.mainColor}
        borderColor={'black'}
        buttonMargin={1}
        height={35}
      />
    </View>
  );
};

export default SwitchSelectorComponent;
