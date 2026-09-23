import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';


const statusColors = {
    Pending: '#d97706',
    Approved: '#059669',
    Rejected: '#dc2626',
    Cancelled: '#6b7280'
  };


export default function BookingCard({ booking, onPress }) {
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
    status: { fontSize: 13, fontWeight: '700', marginTop: 6 }
  });