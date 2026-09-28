import React from "react";
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { TextInput, Text } from "react-native-gesture-handler";

export default function EmptyState({message= 'Nothing here yet'}) {
    return(
        <View style={styles.container}>
            <Text styles={styles.text}>{message}</Text>
        </View>


    );
}


const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
    text: { color: '#6b7280', fontSize: 16, textAlign: 'center' }
  });

