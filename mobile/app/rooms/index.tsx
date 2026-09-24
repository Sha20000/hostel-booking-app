import { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, RefreshControl } from "react-native";
import { router, useFocusEffect } from 'expo-router';
import api from '../../src/services/api';
import RoomCard from '../../src/components/RoomCard';
import LoadingSpinner from '../../src/components/LoadingSpinner';
import EmptyState from '../../src/components/EmptyState';


export default function RoomListScreen(){

    const[rooms,setRooms] = useState<any[]>([]);
    const[loading,setLoading] = useState(true);
    const[refreshing,setRefreshing] = useState(false);

    const fetchRooms = async () => {
        try{
            const { data } = await api.get('/rooms');
            setRooms(data);

        }catch (err){
            console.log('Failed to fetch rooms', err);
        }finally{

        }
    };

    useFocusEffect(
        useCallback(
            () => {
          fetchRooms();
            }, [])

    );

    const onRefresh = () => {
       setRefreshing(true);
       fetchRooms();

    };


    if (loading) return <LoadingSpinner/>;

    return(
        <View style = {styles.container}>
            <FlatList 

            data={rooms}
            keyExtractor={(item) => item._id}
            renderItem={({item}) => (
                <RoomCard room={item} onPress={ ()=> router.push(`/rooms/${item._id}`)} />
                
            )}  
            
            contentContainerStyle={rooms.length === 0 ? styles.emptyContainer : styles.list}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            ListEmptyComponent={<EmptyState message="No rooms available yet" />}


            
            
            
            
            />
        </View>
    )






}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f9fafb' },
    list: { padding: 16 },
    emptyContainer: { flex: 1 }
  });