import React from 'react';
import {View, Text, StyleSheet, Modal, TouchableOpacity} from 'react-native';
import {useAppState} from '../hooks/useAppState';

const ErrorOverlay: React.FC = () => {
  const {error, clearError} = useAppState();

  if (!error) return null;

  const isSuccess = error.code === 200;
  const bgColor = isSuccess ? '#d4edda' : '#f8d7da';
  const textColor = isSuccess ? '#155724' : '#721c24';
  const borderColor = isSuccess ? '#c3e6cb' : '#f5c6cb';
  const buttonBgColor = isSuccess ? '#28a745' : '#dc3545';

  return (
    <Modal visible transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.card, {backgroundColor: bgColor, borderColor}]}>
          <Text style={[styles.title, {color: textColor}]}>
            {isSuccess ? 'Success' : 'Error'}
          </Text>
          <Text style={[styles.message, {color: textColor}]}>{error.message}</Text>

          {error.fieldErrors && Object.keys(error.fieldErrors).length > 0 && (
            <View style={[styles.fieldErrors, {backgroundColor: isSuccess ? '#c3e6cb' : '#f5c6cb'}]}>
              {Object.entries(error.fieldErrors).map(([field, msg]) => (
                <Text key={field} style={[styles.fieldError, {color: textColor}]}>
                  • {field}: {msg}
                </Text>
              ))}
            </View>
          )}

          <TouchableOpacity style={[styles.button, {backgroundColor: buttonBgColor}]} onPress={clearError}>
            <Text style={styles.buttonText}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', alignItems: 'center', justifyContent: 'center'},
  card: {
    padding: 16,
    borderRadius: 8,
    width: '80%',
    maxWidth: 400,
    borderWidth: 1,
  },
  title: {fontSize: 18, fontWeight: '700', marginBottom: 8},
  message: {fontSize: 14, marginBottom: 12},
  fieldErrors: {padding: 8, borderRadius: 4, marginBottom: 12},
  fieldError: {fontSize: 12, marginBottom: 4},
  button: {paddingVertical: 10, borderRadius: 6, alignItems: 'center'},
  buttonText: {color: '#fff', fontWeight: '600'},
});

export default ErrorOverlay;
