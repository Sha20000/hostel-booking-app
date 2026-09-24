import { useState, useCallback } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, router, useFocusEffect } from 'expo-router';
import api from '../../src/services/api';
import LoadingSpinner from '../../src/components/LoadingSpinner';

export default function RoomDetailsScreen(){

    const { id } = useLocalSearchParams<{id: string}>();
    const [room,setRoom] = useState<any>(null);
    const [loading,setLoading] = useState(true);

    const fetchRooms = async () => {
        try{
            const { data } = await api.get('/rooms');
            setRoom(data);

        }catch (err){
            console.log('Failed to fetch rooms', err);
        }finally{
            setLoading(false);

        }
    };

    useFocusEffect(
        useCallback(()=>{
            fetchRooms();
        },[id])
    );


    if(loading || !room) return <LoadingSpinner/>

    const isFull = room.availabilityStatus === 'Full' ;

    return(
        <ScrollView style={styles.container}>
      {room.image ? (
        <Image source={{ uri: room.image }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]}>
          <Text style={styles.placeholderText}>No image available</Text>
        </View>
      )}

      <View style={styles.content}>
        <Text style={styles.roomNumber}>Room {room.roomNumber}</Text>
        <Text style={styles.roomType}>{room.roomType} Room</Text>
        <Text style={styles.price}>Rs. {room.pricePerMonth} / month</Text>

        <Text style={[styles.status, isFull ? styles.full : styles.available]}>
          {room.availabilityStatus} — {room.currentOccupancy}/{room.capacity} occupied
        </Text>

        {room.description ? <Text style={styles.description}>{room.description}</Text> : null}

        <TouchableOpacity
          style={[styles.button, isFull && styles.buttonDisabled]}
          onPress={() => router.push(`/bookings/new?roomId=${room._id}` as any)}
          disabled={isFull}
        >
          <Text style={styles.buttonText}>
            {isFull ? 'Room Full — Not Available' : 'Request Booking'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>




    );




}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    image: { width: '100%', height: 220 },
    imagePlaceholder: { backgroundColor: '#f3f4f6', justifyContent: 'center', alignItems: 'center' },
    placeholderText: { color: '#9ca3af' },
    content: { padding: 20 },
    roomNumber: { fontSize: 24, fontWeight: '700', color: '#111827' },
    roomType: { fontSize: 16, color: '#6b7280', marginTop: 4 },
    price: { fontSize: 18, fontWeight: '600', color: '#111827', marginTop: 8 },
    status: { fontSize: 14, fontWeight: '600', marginTop: 12 },
    available: { color: '#059669' },
    full: { color: '#dc2626' },
    description: { fontSize: 14, color: '#374151', marginTop: 16, lineHeight: 20 },
    button: {
      backgroundColor: '#2563eb',
      borderRadius: 8,
      paddingVertical: 14,
      alignItems: 'center',
      marginTop: 24
    },
    buttonDisabled: { backgroundColor: '#9ca3af' },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' }
  });



