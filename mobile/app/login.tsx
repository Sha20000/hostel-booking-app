import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from "expo-router";
import { useAuth } from "../src/context/AuthContext";
import LoadingSpinner from "../src/components/LoadingSpinner";
import FormInput 