import React, { createContext, useState, useEffect, useContext, Children} from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStoredUser();
    },[]);



    const loadStoredUser = async () => {
        try{

            const storedUser = await AsyncStorage.getItem('user');
            if (storedUser) setUser(JSON.parse(storedUser));



        } catch(err) {
            console.log('Failed to load stored user', err);
        } finally {
            setLoading(false);
        }
    };

    const register = 





};





