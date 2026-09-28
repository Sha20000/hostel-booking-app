import { useState, useCallback } from 'react';
import { View, FlatList, RefreshControl, StyleSheet } from 'react-native';
import {  useFocusEffect } from 'expo-router';
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

    if(loading) return <LoadingSpinner/>;


    return(
     <View style={styles.container}>
      <FlatList
        data={bookings}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <BookingCard booking={item} onPress={() => {}} />}
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






