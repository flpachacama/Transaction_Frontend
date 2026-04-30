"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const useAppState_1 = require("../hooks/useAppState");
const empty = {
    id: '',
    name: '',
    description: '',
    logo: '',
    date_release: '',
    date_revision: '',
};
const ProductForm = ({ initial = {}, isEdit = false, checkExists, onSubmit, onSuccess }) => {
    const { setLoading, setError, isLoading } = (0, useAppState_1.useAppState)();
    const [form, setForm] = (0, react_1.useState)(Object.assign(Object.assign({}, empty), initial));
    const [fieldErrors, setFieldErrors] = (0, react_1.useState)({});
    const setField = (k, v) => {
        const next = Object.assign(Object.assign({}, form), { [k]: v });
        if (k === 'date_release') {
            const d = new Date(v);
            if (!isNaN(d.getTime())) {
                const rev = new Date(d);
                rev.setFullYear(rev.getFullYear() + 1);
                next.date_revision = rev.toISOString().slice(0, 10);
            }
            else {
                next.date_revision = '';
            }
        }
        setForm(next);
    };
    const validate = () => __awaiter(void 0, void 0, void 0, function* () {
        const e = {};
        const now = new Date();
        // id
        if (!form.id || String(form.id).length < 3 || String(form.id).length > 10)
            e.id = 'ID must be 3-10 characters';
        // name
        if (!form.name || form.name.length < 5 || form.name.length > 100)
            e.name = 'Name must be 5-100 characters';
        // description
        if (!form.description || form.description.length < 10 || form.description.length > 200)
            e.description = 'Description must be 10-200 characters';
        // logo
        if (!form.logo)
            e.logo = 'Logo is required';
        // date_release
        const dr = new Date(form.date_release || '');
        if (!form.date_release || isNaN(dr.getTime()))
            e.date_release = 'Invalid release date (YYYY-MM-DD)';
        else {
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const releaseDay = new Date(dr.getFullYear(), dr.getMonth(), dr.getDate());
            if (releaseDay < today)
                e.date_release = 'Release date must be today or in the future';
        }
        setFieldErrors(e);
        if (Object.keys(e).length) {
            setError({ code: 400, message: 'Please fix validation errors', fieldErrors: e });
            return false;
        }
        if (!isEdit && checkExists) {
            const exists = yield checkExists(String(form.id));
            if (exists) {
                const err = { id: 'This ID already exists' };
                setFieldErrors(err);
                setError({ code: 400, message: 'Validation error', fieldErrors: err });
                return false;
            }
        }
        return true;
    });
    const submit = () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const ok = yield validate();
        if (!ok)
            return;
        setLoading(true);
        try {
            const payload = {
                id: String(form.id),
                name: String(form.name),
                description: String(form.description),
                logo: String(form.logo),
                date_release: String(form.date_release),
                date_revision: String(form.date_revision),
            };
            const res = yield onSubmit(payload);
            setLoading(false);
            if (res && res.success) {
                setFieldErrors({});
                onSuccess && onSuccess(res);
            }
            else {
                setError({ code: 400, message: ((_a = res === null || res === void 0 ? void 0 : res.error) === null || _a === void 0 ? void 0 : _a.message) || 'Operation failed' });
            }
        }
        catch (err) {
            setLoading(false);
            const status = (err === null || err === void 0 ? void 0 : err.status) || 500;
            setError({ code: status, message: (err === null || err === void 0 ? void 0 : err.message) || 'Operation failed' });
        }
    });
    const reset = () => {
        setForm(Object.assign(Object.assign({}, empty), initial));
        setFieldErrors({});
    };
    return (<react_native_1.View>
      <Field label="ID" value={String(form.id || '')} onChangeText={(t) => setField('id', t)} error={fieldErrors.id} editable={!isEdit}/>
      <Field label="Name" value={String(form.name || '')} onChangeText={(t) => setField('name', t)} error={fieldErrors.name}/>
      <Field label="Description" value={String(form.description || '')} onChangeText={(t) => setField('description', t)} error={fieldErrors.description} multiline/>
      <Field label="Logo (URL)" value={String(form.logo || '')} onChangeText={(t) => setField('logo', t)} error={fieldErrors.logo}/>
      <Field label="Date release (YYYY-MM-DD)" value={String(form.date_release || '')} onChangeText={(t) => setField('date_release', t)} error={fieldErrors.date_release}/>
      <Field label="Date revision" value={String(form.date_revision || '')} onChangeText={(t) => setField('date_revision', t)} error={fieldErrors.date_revision} editable={false}/>

      <react_native_1.View style={styles.buttons}>
        <react_native_1.Button title={isLoading ? 'Working...' : isEdit ? 'Update' : 'Submit'} onPress={submit} disabled={isLoading}/>
        <react_native_1.View style={{ width: 12 }}/>
        <react_native_1.Button title="Reset" onPress={reset} color="#999"/>
      </react_native_1.View>
    </react_native_1.View>);
};
const Field = ({ label, value, onChangeText, error, multiline, editable = true }) => (<react_native_1.View style={styles.field}>
    <react_native_1.Text style={styles.label}>{label}</react_native_1.Text>
    <react_native_1.TextInput value={value} onChangeText={onChangeText} style={[styles.input, multiline && { height: 80 }]} multiline={multiline} editable={editable}/>
    {error ? <react_native_1.Text style={styles.err}>{error}</react_native_1.Text> : null}
  </react_native_1.View>);
const styles = react_native_1.StyleSheet.create({
    field: { marginBottom: 12 },
    label: { fontWeight: '600', marginBottom: 6 },
    input: { borderWidth: 1, borderColor: '#ddd', padding: 8, borderRadius: 6, backgroundColor: '#fff' },
    err: { color: '#b00020', marginTop: 6 },
    buttons: { flexDirection: 'row', marginTop: 8 },
});
exports.default = ProductForm;
