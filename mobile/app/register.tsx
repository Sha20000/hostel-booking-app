import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link,router } from "expo-router";
import { useAuth } from "../src/context/AuthContext";
import FormInput from "../src/components/FormInput";


export default function RegisterScreen(){

    const {register} = useAuth();
    const [name,setName] = useState('');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});
    const[submitting,setSubmitting] = useState(false);
    const[serverError,setServerError] = useState('')

    const validate = () => {
        const newErrors: { name?: string; email?: string; password?: string } = {};
        if (!name.trim()) newErrors.name = 'Name is required';
        if (!email.trim()) newErrors.email = 'Email is required';
        if (!password || password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
      };


      const handleRegister = async () => {

        setServerError('');
        if (!validate()) return;
        setSubmitting(true);

        try{
            await register(name.trim(),email.trim(), password);
            router.replace('/rooms');

        } catch (err){
            setServerError(err.response?.data?.message || 'Registration failed. Please try again.');  

        } finally {
            setSubmitting(false);

        }
    };

    return(

      <View style={styles.container}>
      <Text style={styles.title}>Create an account</Text>

      <FormInput
        label="Name"
        placeholder="Your full name"
        value={name}
        onChangeText={setName}
        error={errors.name}
      />

      <FormInput
        label="Email"
        placeholder="you@example.com"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        error={errors.email}
      />

      <FormInput
        label="Password"
        placeholder="••••••••"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        error={errors.password}
      />

    <FormInput
        label="Password"
        placeholder="••••••••"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        error={errors.password}
      />

    {serverError ? <Text style={styles.serverError}>{serverError}</Text> : null}

    <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={submitting}>
    <Text style={styles.buttonText}>{submitting ? 'Creating account...' : 'Register'}</Text>
    </TouchableOpacity>

    <Link href="/login" style={styles.link}>
    Already have an account? Log in
    </Link>
    </View>








    );


    


};



const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
    title: { fontSize: 26, fontWeight: '700', marginBottom: 24, color: '#111827' },
    button: {
      backgroundColor: '#2563eb',
      borderRadius: 8,
      paddingVertical: 14,
      alignItems: 'center',
      marginTop: 8
    },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
    serverError: { color: '#dc2626', marginBottom: 12, textAlign: 'center' },
    link: { marginTop: 20, textAlign: 'center', color: '#2563eb' }
  });

