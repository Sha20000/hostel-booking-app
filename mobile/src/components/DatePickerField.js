import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';

export default function DatePickerField({ label, value, onChange, error, minimumDate }) {
    const [show, setShow] = useState(false);

    if (Platform.OS === 'web') {
        return (
            <View style={styles.wrapper}>
                {label ? <Text style={styles.label}>{label}</Text> : null}
                <input
                    type="date"
                    value={value || ''}
                    min={minimumDate ? minimumDate.toISOString().split('T')[0] : undefined}
                    onChange={(e) => onChange(e.target.value)}
                    style={webInputStyle}
                />
                {error ? <Text style={styles.error}>{error}</Text> : null}
            </View>
        );
    }

    const DateTimePicker = require('@react-native-community/datetimepicker').default;
    const dateValue = value ? new Date(value) : new Date();

    const handleChange = (event, selectedDate) => {
        if (Platform.OS === 'android') setShow(false);
        if (event.type === 'dismissed') return;
        if (selectedDate) {
            const iso = selectedDate.toISOString().split('T')[0];
            onChange(iso);
        }
    };

    return (
        <View style={styles.wrapper}>
            {label ? <Text style={styles.label}>{label}</Text> : null}
            <TouchableOpacity style={styles.input} onPress={() => setShow(true)}>
                <Text style={value ? styles.valueText : styles.placeholderText}>
                    {value || 'Select date'}
                </Text>
            </TouchableOpacity>
            {show && (
                <DateTimePicker
                    value={dateValue}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'inline' : 'default'}
                    minimumDate={minimumDate}
                    onChange={handleChange}
                />
            )}
            {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>
    );
}

const webInputStyle = {
    border: '1px solid #d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: 'inherit',
    color: '#111827',
    width: '100%',
    boxSizing: 'border-box',
};

const styles = StyleSheet.create({
    wrapper: { marginBottom: 16 },
    label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 6 },
    input: {
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        padding: 12,
    },
    valueText: { fontSize: 16, color: '#111827' },
    placeholderText: { fontSize: 16, color: '#9ca3af' },
    error: { color: '#dc2626', fontSize: 12, marginTop: 4 },
});
