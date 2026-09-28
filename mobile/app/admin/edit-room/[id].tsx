import { useState, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image, Platform } from 'react-native';
import { router, useLocalSearchParams, useFocusEffect } from "expo-router";
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from "../../../src/context/AuthContext";
import FormInput from "../../../src/components/FormInput";
import api, { SERVER_URL } from "../../../src/services/api";
import LoadingSpinner from "../../../src/components/LoadingSpinner";

export default function EditRoomScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [roomNumber, setRoomNumber] = useState('');
  const [roomType, setRoomType] = useState('Single');
  const [pricePerMonth, setPricePerMonth] = useState('');
  const [capacity, setCapacity] = useState('');
  const [description, setDescription] = useState('');
  const [existingImage, setExistingImage] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ pricePerMonth?: string; capacity?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const fetchRoom = async () => {
    try {
      const { data } = await api.get(`/rooms/${id}`);
      setRoomNumber(data.roomNumber);
      setRoomType(data.roomType);
      setPricePerMonth(String(data.pricePerMonth));
      setCapacity(String(data.capacity));
      setDescription(data.description || '');
      setExistingImage(data.image || null);
    } catch (err) {
      console.log('Failed to fetch room', err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchRoom();
    }, [id])
  );

  if (!user?.isAdmin) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Access denied</Text>
        <Text>You must be an admin to edit rooms.</Text>
      </View>
    );
  }

  if (loading) return <LoadingSpinner />;

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Please allow photo library access to change the room image.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const validate = () => {
    const newErrors: { pricePerMonth?: string; capacity?: string } = {};
    if (!pricePerMonth || isNaN(Number(pricePerMonth))) newErrors.pricePerMonth = 'Enter a valid price';
    if (!capacity || isNaN(Number(capacity))) newErrors.capacity = 'Enter a valid capacity';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateRoom = async () => {
    setServerError('');
    if (!validate()) return;
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('roomType', roomType);
      formData.append('pricePerMonth', pricePerMonth);
      formData.append('capacity', capacity);
      formData.append('description', description);

      if (image) {
        if (Platform.OS === 'web') {
          const response = await fetch(image);
          const blob = await response.blob();
          formData.append('image', blob, `room-${Date.now()}.jpg`);
        } else {
          const filename = image.split('/').pop() || 'room.jpg';
          const match = /\.(\w+)$/.exec(filename);
          const type = match ? `image/${match[1]}` : 'image';
          formData.append('image', { uri: image, name: filename, type } as any);
        }
      }

      await api.put(`/rooms/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (Platform.OS === 'web') {
        window.alert('Room updated successfully');
      } else {
        Alert.alert('Success', 'Room updated successfully');
      }
      router.replace(`/rooms/${id}` as any);
    } catch (err: any) {
      setServerError(err.response?.data?.message || 'Failed to update room. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const previewUri = image || (existingImage ? `${SERVER_URL}${existingImage}` : null);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Room {roomNumber}</Text>

      <FormInput
        label="Room Type (Single/Double/Triple)"
        placeholder="Single"
        value={roomType}
        onChangeText={setRoomType}
      />

      <FormInput
        label="Price Per Month"
        placeholder="15000"
        value={pricePerMonth}
        onChangeText={setPricePerMonth}
        keyboardType="numeric"
        error={errors.pricePerMonth}
      />

      <FormInput
        label="Capacity"
        placeholder="2"
        value={capacity}
        onChangeText={setCapacity}
        keyboardType="numeric"
        error={errors.capacity}
      />

      <FormInput
        label="Description"
        placeholder="Describe the room"
        value={description}
        onChangeText={setDescription}
      />

      <Text style={styles.label}>Room Image</Text>
      <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
        <Text style={styles.imageButtonText}>{previewUri ? 'Change Image' : 'Pick an Image'}</Text>
      </TouchableOpacity>
      {previewUri ? <Image source={{ uri: previewUri }} style={styles.preview} /> : null}

      {serverError ? <Text style={styles.serverError}>{serverError}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleUpdateRoom} disabled={submitting}>
        <Text style={styles.buttonText}>{submitting ? 'Updating...' : 'Update Room'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 20, color: '#111827' },
  button: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  serverError: { color: '#dc2626', marginBottom: 12, textAlign: 'center' },
  label: { fontSize: 13, color: '#374151', marginBottom: 4, fontWeight: '600' },
  imageButton: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 12
  },
  imageButtonText: { color: '#2563eb', fontWeight: '600' },
  preview: { width: '100%', height: 180, borderRadius: 8, marginBottom: 14 }
});
