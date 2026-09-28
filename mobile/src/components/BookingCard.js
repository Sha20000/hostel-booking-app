import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';


const statusColors = {
    Pending: '#d97706',
    Approved: '#059669',
    Rejected: '#dc2626',
    Cancelled: '#6b7280'
  };


export default function BookingCard({ booking, onPress, onEdit, onCancel }) {
    const room = booking.roomId || {};
    return (
      <TouchableOpacity style={styles.card} onPress={onPress}>
        <Text style={styles.roomNumber}>Room {room.roomNumber || '—'}</Text>
        <Text style={styles.dates}>
          {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
        </Text>
        <Text style={[styles.status, { color: statusColors[booking.status] || '#111827' }]}>
          {booking.status}
        </Text>

        {booking.status === 'Pending' ? (
          <View style={styles.actions}>
            <TouchableOpacity style={styles.editButton} onPress={onEdit}>
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </TouchableOpacity>
    );
  }
  
const styles = StyleSheet.create({
    card: {
      backgroundColor: '#fff',
      borderRadius: 10,
      padding: 14,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: '#e5e7eb'
    },
    roomNumber: { fontSize: 16, fontWeight: '700', color: '#111827' },
    dates: { fontSize: 13, color: '#6b7280', marginTop: 4 },
    status: { fontSize: 13, fontWeight: '700', marginTop: 6 },
    actions: { flexDirection: 'row', marginTop: 10, gap: 10 },
    editButton: {
      flex: 1,
      borderWidth: 1,
      borderColor: '#2563eb',
      borderRadius: 8,
      paddingVertical: 8,
      alignItems: 'center'
    },
    editButtonText: { color: '#2563eb', fontWeight: '600', fontSize: 13 },
    cancelButton: {
      flex: 1,
      borderWidth: 1,
      borderColor: '#dc2626',
      borderRadius: 8,
      paddingVertical: 8,
      alignItems: 'center'
    },
    cancelButtonText: { color: '#dc2626', fontWeight: '600', fontSize: 13 }
  });