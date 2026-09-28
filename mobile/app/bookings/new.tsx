import { useState, useCallback } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, router, useFocusEffect } from 'expo-router';
import api from '../../src/services/api';
import FormInput from '../../src/components/FormInput';


export default function BookingRequestScreen(){

    const { roomId } = useLocalSearchParams<{roomId: string}>();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; startDate?: string; endDate?: string }>({});
    const [submitting,setSubmitting] = useState(false);
    const [serverError, setServerError] = useState('');


    const validate = () => {
    
    const newErrors: { startDate?: string; endDate?: string } = {};
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (!dateRegex.test(startDate)) newErrors.startDate = 'Use format YYYY-MM-DD';
    if (!dateRegex.test(endDate)) newErrors.endDate = 'Use format YYYY-MM-DD';
    if (dateRegex.test(startDate) && dateRegex.test(endDate) && new Date(startDate) >= new Date(endDate)) {
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

      <FormInput
        label="Start Date"
        placeholder="YYYY-MM-DD"
        value={startDate}
        onChangeText={setStartDate}
        error={errors.startDate}
      />

      <FormInput
        label="End Date"
        placeholder="YYYY-MM-DD"
        value={endDate}
        onChangeText={setEndDate}
        error={errors.endDate}
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








