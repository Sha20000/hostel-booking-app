import { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router';
import api from '../../../src/services/api';
import FormInput from '../../../src/components/FormInput';
import LoadingSpinner from '../../../src/components/LoadingSpinner';

export default function EditBookingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [errors, setErrors] = useState<{ startDate?: string; endDate?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const fetchBooking = async () => {
    try {
      const { data } = await api.get(`/bookings/${id}`);
      setStartDate(data.startDate.slice(0, 10));
      setEndDate(data.endDate.slice(0, 10));
    } catch (err) {
      console.log('Failed to fetch booking', err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchBooking();
    }, [id])
  );

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

  const handleUpdate = async () => {
    setServerError('');
    if (!validate()) return;
    setSubmitting(true);

    try {
      await api.put(`/bookings/${id}`, { startDate, endDate });
      router.replace('/bookings' as any);
    } catch (err: any) {
      setServerError(err.response?.data?.message || 'Failed to update booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Booking Dates</Text>

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

      <TouchableOpacity style={styles.button} onPress={handleUpdate} disabled={submitting}>
        <Text style={styles.buttonText}>{submitting ? 'Updating...' : 'Update Booking'}</Text>
      </TouchableOpacity>
    </View>
  );
}

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
