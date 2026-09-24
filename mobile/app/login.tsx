import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from "expo-router";
import { useAuth } from "../src/context/AuthContext";
import LoadingSpinner from "../src/components/LoadingSpinner";
import FormInput from "../src/components/FormInput";

export default function LoginScreen(){

    const {login} = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const [submitting, setSubmitting] = useState(false);
    const [serverError, setServerError] = useState('');

    
    const validate = () => {
        const newErrors: { email?: string; password?: string } = {};
        if (!email.trim()) newErrors.email = 'Email is required';
        if (!password) newErrors.password = 'Password is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
      };

    const handleLogIn = async () => {

        setServerError('');
        if (!validate()) return;
        setSubmitting(true);

        try{
            await login(email.trim(), password);

        } catch (err){
            setServerError(err.response?.data?.message || 'Login failed. Please try again.');  

        } finally {
            setSubmitting(false);

        }
    };


    return (

        <View style={styles.container}>

             <Text style={styles.title}>Welcome Back</Text>

             <FormInput
             label="Email"
             placeholder="you@example.com"
             value={email}
             onChangeText={setEmail}
             autoCapitalize="none"
             keyBoardType="email-address"
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

            {serverError ? <Text style={styles.serverError}>{serverError}</Text> : null}

            <TouchableOpacity style={styles.button} onPress={handleLogIn} disabled={submitting}>
                <Text style={styles.buttonText}>{submitting ? 'Logging in...' : 'Log In'}</Text>
            </TouchableOpacity>   

            <Link href="/register" style={styles.link}>Don't have an account? Register
            </Link> 
                
              



        </View>






    );

    

    










}


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