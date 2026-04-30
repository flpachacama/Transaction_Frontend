import React, {useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet} from 'react-native';
import {Product} from '../types';
import {useAppState} from '../hooks/useAppState';

type Props = {
  initial?: Partial<Product>;
  isEdit?: boolean;
  checkExists?: (id: string) => Promise<boolean>;
  onSubmit: (payload: Product) => Promise<any>;
  onSuccess?: (res: any) => void;
};

const empty = {
  id: '',
  name: '',
  description: '',
  logo: '',
  date_release: '',
  date_revision: '',
};

const ProductForm: React.FC<Props> = ({initial = {}, isEdit = false, checkExists, onSubmit, onSuccess}) => {
  const {setLoading, setError, isLoading} = useAppState();
  const [form, setForm] = useState<Partial<Product>>({...empty, ...initial});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const setField = (k: keyof Product, v: string) => {
    const next: any = {...form, [k]: v};
    if (k === 'date_release') {
      const d = new Date(v);
      if (!isNaN(d.getTime())) {
        const rev = new Date(d);
        rev.setFullYear(rev.getFullYear() + 1);
        next.date_revision = rev.toISOString().slice(0, 10);
      } else {
        next.date_revision = '';
      }
    }
    setForm(next);
  };

  const validate = async () => {
    const e: Record<string, string> = {};
    const now = new Date();
    // id
    if (!form.id || String(form.id).length < 3 || String(form.id).length > 10) e.id = 'ID must be 3-10 characters';
    // name
    if (!form.name || form.name.length < 5 || form.name.length > 100) e.name = 'Name must be 5-100 characters';
    // description
    if (!form.description || form.description.length < 10 || form.description.length > 200) e.description = 'Description must be 10-200 characters';
    // logo
    if (!form.logo) e.logo = 'Logo is required';
    // date_release
    const dr = new Date(form.date_release || '');
    if (!form.date_release || isNaN(dr.getTime())) e.date_release = 'Invalid release date (YYYY-MM-DD)';
    else {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const releaseDay = new Date(dr.getFullYear(), dr.getMonth(), dr.getDate());
      if (releaseDay < today) e.date_release = 'Release date must be today or in the future';
    }

    setFieldErrors(e);
    if (Object.keys(e).length) {
      setError({code: 400, message: 'Please fix validation errors', fieldErrors: e});
      return false;
    }

    if (!isEdit && checkExists) {
      const exists = await checkExists(String(form.id));
      if (exists) {
        const err = {id: 'This ID already exists'};
        setFieldErrors(err);
        setError({code: 400, message: 'Validation error', fieldErrors: err});
        return false;
      }
    }

    return true;
  };

  const submit = async () => {
    const ok = await validate();
    if (!ok) return;

    setLoading(true);
    try {
      const payload: Product = {
        id: String(form.id),
        name: String(form.name),
        description: String(form.description),
        logo: String(form.logo),
        date_release: String(form.date_release),
        date_revision: String(form.date_revision),
      };
      const res = await onSubmit(payload);
      setLoading(false);
      if (res && res.success) {
        setFieldErrors({});
        onSuccess && onSuccess(res);
      } else {
        setError({code: 400, message: res?.error?.message || 'Operation failed'});
      }
    } catch (err: any) {
      setLoading(false);
      const status = err?.status || 500;
      setError({code: status, message: err?.message || 'Operation failed'});
    }
  };

  const reset = () => {
    setForm({...empty, ...initial});
    setFieldErrors({});
  };

  return (
    <View>
      <Field label="ID" value={String(form.id || '')} onChangeText={(t) => setField('id', t)} error={fieldErrors.id} editable={!isEdit} />
      <Field label="Name" value={String(form.name || '')} onChangeText={(t) => setField('name', t)} error={fieldErrors.name} />
      <Field label="Description" value={String(form.description || '')} onChangeText={(t) => setField('description', t)} error={fieldErrors.description} multiline />
      <Field label="Logo (URL)" value={String(form.logo || '')} onChangeText={(t) => setField('logo', t)} error={fieldErrors.logo} />
      <Field label="Date release (YYYY-MM-DD)" value={String(form.date_release || '')} onChangeText={(t) => setField('date_release', t)} error={fieldErrors.date_release} />
      <Field label="Date revision" value={String(form.date_revision || '')} onChangeText={(t) => setField('date_revision', t)} error={fieldErrors.date_revision} editable={false} />

      <View style={styles.buttons}>
        <Button title={isLoading ? 'Working...' : isEdit ? 'Update' : 'Submit'} onPress={submit} disabled={isLoading} />
        <View style={{width: 12}} />
        <Button title="Reset" onPress={reset} color="#999" />
      </View>
    </View>
  );
};

const Field: React.FC<any> = ({label, value, onChangeText, error, multiline, editable = true}) => (
  <View style={styles.field}>
    <Text style={styles.label}>{label}</Text>
    <TextInput value={value} onChangeText={onChangeText} style={[styles.input, multiline && {height: 80}]} multiline={multiline} editable={editable} />
    {error ? <Text style={styles.err}>{error}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  field: {marginBottom: 12},
  label: {fontWeight: '600', marginBottom: 6},
  input: {borderWidth: 1, borderColor: '#ddd', padding: 8, borderRadius: 6, backgroundColor: '#fff'},
  err: {color: '#b00020', marginTop: 6},
  buttons: {flexDirection: 'row', marginTop: 8},
});

export default ProductForm;
