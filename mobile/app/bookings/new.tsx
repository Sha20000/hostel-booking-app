import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import api from '../../src/services/api';
import DatePickerField from '../../src/components/DatePickerField';


export default function BookingRequestScreen(){

    const { roomId } = useLocalSearchParams<{roomId: string}>();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [errors, setErrors] = useState<{ startDate?: string; endDate?: string }>({});
    const [submitting,setSubmitting] = useState(false);
    const [serverError, setServerError] = useState('');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const validate = () => {

    const newErrors: { startDate?: string; endDate?: string } = {};

    if (!startDate) newErrors.startDate = 'Please select a start date';
    if (!endDate) newErrors.endDate = 'Please select an end date';
    if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
      newErrors.endDate = 'End date must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async () => {

    setServerError('');
    if(!validate()) return;
    setSubmitting(true);

    try{
        await api.post('/bookings',{roomId, startDate, endDate})
        router.replace('bookings' as any);

    }catch (err:any){
        setServerError(err.response?.data?.message || 'Booking request failed. Please try again.');

    }finally{
        setSubmitting(false);

    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Request a Booking</Text>

      <DatePickerField
        label="Start Date"
        value={startDate}
        onChange={setStartDate}
        error={errors.startDate}
        minimumDate={today}
      />

      <DatePickerField
        label="End Date"
        value={endDate}
        onChange={setEndDate}
        error={errors.endDate}
        minimumDate={startDate ? new Date(startDate) : today}
      />

      {serverError ? <Text style={styles.serverError}>{serverError}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={submitting}>
        <Text style={styles.buttonText}>{submitting ? 'Submitting...' : 'Submit Request'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 24, color: '#111827' },
  button: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  serverError: { color: '#dc2626', marginBottom: 12, textAlign: 'center' }
});
