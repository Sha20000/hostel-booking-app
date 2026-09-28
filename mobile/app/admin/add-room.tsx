import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { router, Link } from "expo-router";
import { useAuth } from "../../src/context/AuthContext";
import FormInput from "../../src/components/FormInput";
import api from "../../src/services/api";

export default function AddRoomScreen() {
  const { user } = useAuth();
  const [roomNumber, setRoomNumber] = useState('');
  const [roomType, setRoomType] = useState('Single');
  const [pricePerMonth, setPricePerMonth] = useState('');
  const [capacity, setCapacity] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<{ roomNumber?: string; pricePerMonth?: string; capacity?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [image, setImage] = useState<string | null>(null);

  if (!user?.isAdmin) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Access denied</Text>
        <Text>You must be an admin to add rooms.</Text>
      </View>
    );
  }

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Please allow photo library access to add a room image.');
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
    const newErrors: { roomNumber?: string; pricePerMonth?: string; capacity?: string } = {};
    if (!roomNumber.trim()) newErrors.roomNumber = 'Room number is required';
    if (!pricePerMonth || isNaN(Number(pricePerMonth))) newErrors.pricePerMonth = 'Enter a valid price';
    if (!capacity || isNaN(Number(capacity))) newErrors.capacity = 'Enter a valid capacity';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateRoom = async () => {
    setServerError('');
    if (!validate()) return;
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('roomNumber', roomNumber.trim());
      formData.append('roomType', roomType);
      formData.append('pricePerMonth', pricePerMonth);
      formData.append('capacity', capacity);
      formData.append('description', description);

      if (image) {
        if (Platform.OS === 'web') {
          const response = await fetch(image);
          const blob = await response.blob();
          const filename = `room-${Date.now()}.jpg`;
          formData.append('image', blob, filename);
        } else {
          const filename = image.split('/').pop() || 'room.jpg';
          const match = /\.(\w+)$/.exec(filename);
          const type = match ? `image/${match[1]}` : 'image';
          formData.append('image', { uri: image, name: filename, type } as any);
        }
      }

      await api.post('/rooms', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      Alert.alert('Success', 'Room created successfully');
      router.replace('/rooms');
    } catch (err: any) {
      setServerError(err.response?.data?.message || 'Failed to create room. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Room</Text>

      <Link href="/admin/manage-bookings" style={styles.navLink}>
        Go to Manage Bookings →
      </Link>

      <FormInput
        label="Room Number"
        placeholder="e.g. A101"
        value={roomNumber}
        onChangeText={setRoomNumber}
        error={errors.roomNumber}
      />

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

      <Text style={styles.label}>Room Image (optional)</Text>
      <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
        <Text style={styles.imageButtonText}>{image ? 'Change Image' : 'Pick an Image'}</Text>
      </TouchableOpacity>
      {image ? <Image source={{ uri: image }} style={styles.preview} /> : null}

      {serverError ? <Text style={styles.serverError}>{serverError}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleCreateRoom} disabled={submitting}>
        <Text style={styles.buttonText}>{submitting ? 'Creating...' : 'Create Room'}</Text>
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
