import React from "react";
import { View, Text, TextInput, StyleSheet } from 'react-native';



export default function FormInput({ label, error = null, ...props}) {

    return(

        <View style={styles.wrapper}>
            {label? <Text style={styles.label}>{label}</Text> :null}
            <TextInput style={[styles.input, error ? styles.inputError : null]} 
            placeholderTextColor="#9ca3af"
            {...props} />

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

        </View>

    )



}


const styles = StyleSheet.create({
    wrapper: { marginBottom: 14 },
    label: { fontSize: 13, color: '#374151', marginBottom: 4, fontWeight: '600' },
    input: {
      borderWidth: 1,
      borderColor: '#d1d5db',
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      fontSize: 15,
      backgroundColor: '#fff'
    },
    inputError: { borderColor: '#dc2626' },
    errorText: { color: '#dc2626', fontSize: 12, marginTop: 4 }
  });


