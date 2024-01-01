import { Colors } from '@src/common/constants/colors';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';

interface CustomModalProps {
  isVisible: boolean;
  text: string;
  buttonTitle: string;
  onButtonPress: () => Promise<void> | void;
  onClose: () => void;
}

export const CustomModal: FC<CustomModalProps> = ({
  isVisible,
  text,
  buttonTitle,
  onButtonPress,
  onClose,
}) => {
  const { t } = useTranslation();

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{text}</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => void onButtonPress()}>
                  <Text style={styles.buttonText}>{buttonTitle}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onClose}>
                  <Text style={styles.cancelButton}>{t('cancel')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.glassLike,
  },
  modalContent: {
    backgroundColor: Colors.black,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  buttonContainer: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 20,
  },
  buttonText: {
    color: Colors.mainColor,
    fontSize: 20,
    fontWeight: 'bold',
  },
  cancelButton: {
    color: Colors.errorColor,
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalTitle: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
