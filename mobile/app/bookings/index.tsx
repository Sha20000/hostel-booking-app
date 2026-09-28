import { useState, useCallback } from 'react';
import { View, FlatList, RefreshControl, StyleSheet, Platform, Alert } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import api from '../../src/services/api';
import BookingCard from '../../src/components/BookingCard';
import LoadingSpinner from '../../src/components/LoadingSpinner';
import EmptyState from '../../src/components/EmptyState';


export default function MyBookingsScreen(){

    const[bookings,setBookings] = useState<any[]>([]);
    const[loading,setLoading] = useState(true);
    const[refreshing,setRefreshing] = useState(false);

    const fetchBookings = async () => {
        try{
            const {data} = await api.get('/bookings/my');
            setBookings(data);

        }catch (err){
            console.log('Failed to fetch bookings', err);


        }finally{
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(()=>{
            fetchBookings();
        },[])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchBookings();
    };

    const handleCancel = (id: string) => {
        const doCancel = async () => {
            try {
                await api.delete(`/bookings/${id}`);
                fetchBookings();
            } catch (err: any) {
                const message = err.response?.data?.message || 'Failed to cancel booking';
                if (Platform.OS === 'web') {
                    window.alert(message);
                } else {
                    Alert.alert('Error', message);
                }
            }
        };

        if (Platform.OS === 'web') {
            if (window.confirm('Are you sure you want to cancel this booking?')) {
                doCancel();
            }
            return;
        }

        Alert.alert('Cancel Booking', 'Are you sure you want to cancel this booking?', [
            { text: 'No', style: 'cancel' },
            { text: 'Yes, Cancel', style: 'destructive', onPress: doCancel }
        ]);
    };

    if(loading) return <LoadingSpinner/>;


    return(
     <View style={styles.container}>
      <FlatList
        data={bookings}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <BookingCard
            booking={item}
            onPress={() => {}}
            onEdit={() => router.push(`/bookings/edit/${item._id}` as any)}
            onCancel={() => handleCancel(item._id)}
          />
        )}
        contentContainerStyle={bookings.length === 0 ? styles.emptyContainer : styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={<EmptyState message="You haven't made any bookings yet" />}
      />
    </View>
    );



}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f9fafb' },
    list: { padding: 16 },
    emptyContainer: { flex: 1 }
  });






