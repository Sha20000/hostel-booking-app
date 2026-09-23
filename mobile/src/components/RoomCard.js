import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

export default function RoomCard({ room, onPress }) {
    return (

     <TouchableOpacity style={styles.card} onPress={onPress}>
        {


            room.image?(
                <Image source={{uri:room.image}} style={styles.image}/>
            ):(
                <View style={[style.image, style.image]}></>
            )

        }
     </TouchableOpacity>







    );
}


