import React from "react";
import { View, ActivityIndicator, StyleSheet } from 'react-native';

export default function EmptyState() {
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

  