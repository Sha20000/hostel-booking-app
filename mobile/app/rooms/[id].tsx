import { useState, useCallback } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, router, useFocusEffect } from 'expo-router';
import api from '../../src/services/api';
import LoadingSpinner from '../../src/components/LoadingSpinner';