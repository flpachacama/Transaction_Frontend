"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const useAppState_1 = require("../hooks/useAppState");
const ErrorOverlay = () => {
    const { error, clearError } = (0, useAppState_1.useAppState)();
    if (!error)
        return null;
    const isSuccess = error.code === 200;
    const bgColor = isSuccess ? '#d4edda' : '#f8d7da';
    const textColor = isSuccess ? '#155724' : '#721c24';
    const borderColor = isSuccess ? '#c3e6cb' : '#f5c6cb';
    const buttonBgColor = isSuccess ? '#28a745' : '#dc3545';
    return (<react_native_1.Modal visible transparent animationType="fade">
      <react_native_1.View style={styles.overlay}>
        <react_native_1.View style={[styles.card, { backgroundColor: bgColor, borderColor }]}>
          <react_native_1.Text style={[styles.title, { color: textColor }]}>
            {isSuccess ? 'Success' : 'Error'}
          </react_native_1.Text>
          <react_native_1.Text style={[styles.message, { color: textColor }]}>{error.message}</react_native_1.Text>

          {error.fieldErrors && Object.keys(error.fieldErrors).length > 0 && (<react_native_1.View style={[styles.fieldErrors, { backgroundColor: isSuccess ? '#c3e6cb' : '#f5c6cb' }]}>
              {Object.entries(error.fieldErrors).map(([field, msg]) => (<react_native_1.Text key={field} style={[styles.fieldError, { color: textColor }]}>
                  • {field}: {msg}
                </react_native_1.Text>))}
            </react_native_1.View>)}

          <react_native_1.TouchableOpacity style={[styles.button, { backgroundColor: buttonBgColor }]} onPress={clearError}>
            <react_native_1.Text style={styles.buttonText}>Dismiss</react_native_1.Text>
          </react_native_1.TouchableOpacity>
        </react_native_1.View>
      </react_native_1.View>
    </react_native_1.Modal>);
};
const styles = react_native_1.StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', alignItems: 'center', justifyContent: 'center' },
    card: {
        padding: 16,
        borderRadius: 8,
        width: '80%',
        maxWidth: 400,
        borderWidth: 1,
    },
    title: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
    message: { fontSize: 14, marginBottom: 12 },
    fieldErrors: { padding: 8, borderRadius: 4, marginBottom: 12 },
    fieldError: { fontSize: 12, marginBottom: 4 },
    button: { paddingVertical: 10, borderRadius: 6, alignItems: 'center' },
    buttonText: { color: '#fff', fontWeight: '600' },
});
exports.default = ErrorOverlay;
