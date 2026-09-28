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

    const register = async (name, email, password) => {

        const {data} = await api.post('/auth/register', {name, email, password});
        await persistSession(data);
        return data;

    };

    const login = async (email, password) => {
      
        const {data} = await api.post('/auth/login', {email, password});
        await persistSession(data);
        return data;
    };

    const adminLogin = async (email, password) => {

        const {data} = await api.post('/auth/admin-login', {email, password});
        await persistSession(data);
        return data;
    };

    const persistSession = async (data) => {


        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('user', JSON.stringify(data));
        setUser(data);

    };

    const logout = async () => {

        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
        setUser(null);
    };





    return (
        <AuthContext.Provider value={{ user, loading, register, login, adminLogin, logout }}>
          {children}
        </AuthContext.Provider>
      );


};

export const useAuth = () => useContext(AuthContext);





