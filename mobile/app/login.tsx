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
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [serverError, setServerError] = useState('');

    
    const validate = () => {
        
        const newErrors = {};
        if (!email.trim()) newErrors.email = 'Email is required';
        if (!password) newErrors.password = 'Password is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;

    }

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


    

    

    










}