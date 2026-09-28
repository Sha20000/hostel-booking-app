import { useState, useCallback } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { useLocalSearchParams, router, useFocusEffect } from 'expo-router';
import api from '../../src/services/api';
import { SERVER_URL } from '../../src/services/api';
import LoadingSpinner from '../../src/components/LoadingSpinner';
import { useAuth } from '../../src/context/AuthContext';

export default function RoomDetailsScreen(){

    const { id } = useLocalSearchParams<{id: string}>();
    const { user } = useAuth();
    const [room,setRoom] = useState<any>(null);
    const [loading,setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);

    const fetchRoom = async () => {
        try{
            const { data } = await api.get(`/rooms/${id}`);
            setRoom(data);

        }catch (err){
            console.log('Failed to fetch room', err);
        }finally{
            setLoading(false);

        }
    };

    useFocusEffect(
        useCallback(()=>{
            fetchRoom();
        },[id])
    );


    const performDelete = async () => {
        setDeleting(true);
        try {
            await api.delete(`/rooms/${id}`);
            if (Platform.OS === 'web') {
                window.alert('Room deleted successfully');
            } else {
                Alert.alert('Deleted', 'Room deleted successfully');
            }
            router.replace('/rooms');
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to delete room';
            if (Platform.OS === 'web') {
                window.alert(message);
            } else {
                Alert.alert('Error', message);
            }
        } finally {
            setDeleting(false);
        }
    };

    const handleDelete = () => {
        if (Platform.OS === 'web') {
            const confirmed = window.confirm(`Are you sure you want to delete Room ${room.roomNumber}? This cannot be undone.`);
            if (confirmed) {
                performDelete();
            }
            return;
        }

        Alert.alert(
            'Delete Room',
            `Are you sure you want to delete Room ${room.roomNumber}? This cannot be undone.`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: performDelete
                }
            ]
        );
    };

    if(loading || !room) return <LoadingSpinner/>

    const isFull = room.availabilityStatus === 'Full' ;

    return(
        <ScrollView style={styles.container}>
      {room.image ? (
        <Image source={{ uri: `${SERVER_URL}${room.image}` }} style={styles.image} />
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

        {user?.isAdmin ? (
          <>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => router.push(`/admin/edit-room/${id}` as any)}
            >
              <Text style={styles.editButtonText}>Edit Room</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDelete}
              disabled={deleting}
            >
              <Text style={styles.deleteButtonText}>
                {deleting ? 'Deleting...' : 'Delete Room'}
              </Text>
            </TouchableOpacity>
          </>
        ) : null}
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
    buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
    deleteButton: {
      backgroundColor: '#fff',
      borderWidth: 1,
      borderColor: '#dc2626',
      borderRadius: 8,
      paddingVertical: 14,
      alignItems: 'center',
      marginTop: 12
    },
    deleteButtonText: { color: '#dc2626', fontSize: 16, fontWeight: '600' },
    editButton: {
      backgroundColor: '#fff',
      borderWidth: 1,
      borderColor: '#2563eb',
      borderRadius: 8,
      paddingVertical: 14,
      alignItems: 'center',
      marginTop: 12
    },
    editButtonText: { color: '#2563eb', fontSize: 16, fontWeight: '600' }
  });



