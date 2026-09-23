import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

export default function RoomCard({ room, onPress }) {
    return (

     <TouchableOpacity style={styles.card} onPress={onPress}>
        {


            room.image?(
                <Image source={{uri:room.image}} style={styles.image}/>
            ):(
                <View style={[styles.image, styles.imagePlaceholder]}>
                    <Text style={styles.placeholderText}>No image</Text>
                </View>
            )

        }

        <View style={styles.info}>
        <Text style={styles.roomNumber}>Room {room.roomNumber}</Text>
        <Text style={styles.roomType}>{room.roomType} · Rs. {room.pricePerMonth}/mo</Text>
        <Text style={[styles.status, room.availabilityStatus === 'Full' ? styles.full : styles.available]}>
          {room.availabilityStatus} ({room.currentOccupancy}/{room.capacity})
          </Text>
        </View>
     </TouchableOpacity>









    );
}


const styles = StyleSheet.create({
    card: {
      flexDirection: 'row',
      backgroundColor: '#fff',
      borderRadius: 10,
      marginBottom: 12,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: '#e5e7eb'
    },
    image: { width: 90, height: 90 },
    imagePlaceholder: { backgroundColor: '#f3f4f6', justifyContent: 'center', alignItems: 'center' },
    placeholderText: { fontSize: 11, color: '#9ca3af' },
    info: { flex: 1, padding: 10, justifyContent: 'center' },
    roomNumber: { fontSize: 16, fontWeight: '700', color: '#111827' },
    roomType: { fontSize: 13, color: '#6b7280', marginTop: 2 },
    status: { fontSize: 12, fontWeight: '600', marginTop: 6 },
    available: { color: '#059669' },
    full: { color: '#dc2626' }
  });


