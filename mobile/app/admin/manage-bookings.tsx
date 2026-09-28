import { useState, useCallback } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { useFocusEffect } from "expo-router";
import { useAuth } from "../../src/context/AuthContext";
import api from "../../src/services/api";
import LoadingSpinner from "../../src/components/LoadingSpinner";
import EmptyState from "../../src/components/EmptyState";

const statusColors: Record<string, string> = {
  Pending: '#d97706',
  Approved: '#059669',
  Rejected: '#dc2626',
  Cancelled: '#6b7280'
};

export default function ManageBookingsScreen() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actioningId, setActioningId] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      const { data } = await api.get('/bookings');
      setBookings(data);
    } catch (err) {
      console.log('Failed to fetch bookings', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchBookings();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchBookings();
  };

  const handleApprove = async (id: string) => {
    setActioningId(id);
    try {
      await api.put(`/bookings/${id}/approve`);
      fetchBookings();
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to approve booking');
    } finally {
      setActioningId(null);
    }
  };

  const handleReject = async (id: string) => {
    setActioningId(id);
    try {
      await api.put(`/bookings/${id}/reject`);
      fetchBookings();
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to reject booking');
    } finally {
      setActioningId(null);
    }
  };

  if (!user?.isAdmin) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Access denied</Text>
        <Text>You must be an admin to manage bookings.</Text>
      </View>
    );
  }

  if (loading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Bookings</Text>
      <FlatList
        data={bookings}
        keyExtractor={(item) => item._id}
        contentContainerStyle={bookings.length === 0 ? styles.emptyContainer : styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={<EmptyState message="No bookings yet" />}
        renderItem={({ item }) => {
          const room = item.roomId || {};
          const student = item.userId || {};
          const isPending = item.status === 'Pending';
          const isActioning = actioningId === item._id;

          return (
            <View style={styles.card}>
              <Text style={styles.roomNumber}>Room {room.roomNumber || '—'} ({room.roomType || '—'})</Text>
              <Text style={styles.studentInfo}>{student.name || 'Unknown'} · {student.email || ''}</Text>
              <Text style={styles.dates}>
                {new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}
              </Text>
              <Text style={[styles.status, { color: statusColors[item.status] || '#111827' }]}>
                {item.status}
              </Text>

              {isPending ? (
                <View style={styles.actions}>
                  <TouchableOpacity
                    style={styles.approveButton}
                    onPress={() => handleApprove(item._id)}
                    disabled={isActioning}
                  >
                    <Text style={styles.approveButtonText}>{isActioning ? '...' : 'Approve'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.rejectButton}
                    onPress={() => handleReject(item._id)}
                    disabled={isActioning}
                  >
                    <Text style={styles.rejectButtonText}>{isActioning ? '...' : 'Reject'}</Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb', padding: 16 },
  title: { fontSize: 22, fontWeight: '700', color: '#111827', marginBottom: 16 },
  list: { paddingBottom: 24 },
  emptyContainer: { flex: 1 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb'
  },
  roomNumber: { fontSize: 16, fontWeight: '700', color: '#111827' },
  studentInfo: { fontSize: 13, color: '#374151', marginTop: 4 },
  dates: { fontSize: 13, color: '#6b7280', marginTop: 4 },
  status: { fontSize: 13, fontWeight: '700', marginTop: 6 },
  actions: { flexDirection: 'row', marginTop: 12, gap: 10 },
  approveButton: {
    flex: 1,
    backgroundColor: '#059669',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center'
  },
  approveButtonText: { color: '#fff', fontWeight: '600' },
  rejectButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dc2626',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center'
  },
  rejectButtonText: { color: '#dc2626', fontWeight: '600' }
});
