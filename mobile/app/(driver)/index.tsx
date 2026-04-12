import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { getMobileV1Base } from '../constants';

export default function DriverDashboard() {
  const [isOnline, setIsOnline] = useState(true);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [trips, setTrips] = useState<any[]>([]);
  const [driver, setDriver] = useState<any>(null);
  const [loadingActionId, setLoadingActionId] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const token = await SecureStore.getItemAsync('fleetToken');
      const userData = await SecureStore.getItemAsync('fleetUser');
      
      if (userData) {
        setDriver(JSON.parse(userData));
      }

      if (!token) return;

      const response = await fetch(`${getMobileV1Base()}/trips/daily`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      if (result.success) {
        setTrips(result.data);
      }
    } catch (error) {
      console.error('Fetch Error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleTripAction = async (tripId: string, action: 'START' | 'COMPLETE') => {
    try {
      setLoadingActionId(tripId);
      const token = await SecureStore.getItemAsync('fleetToken');
      
      const response = await fetch(`${getMobileV1Base()}/trips/${tripId}/action`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action })
      });

      const data = await response.json();
      if (data.success) {
        fetchData();
      } else {
        Alert.alert("Action Failed", data.error || "Could not update trip.");
      }
    } catch (error) {
      Alert.alert("Network Error", "Could not reach the server.");
    } finally {
      setLoadingActionId(null);
    }
  };

  const nextTrip = trips.find(t => t.status === 'SCHEDULED' || t.status === 'EN_ROUTE');
  const todaysCount = trips.length;

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#7c3aed" />
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={{ padding: 24, paddingTop: 60 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#7c3aed" />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good Morning,</Text>
          <Text style={styles.driverName}>{driver?.name || 'Driver'}</Text>
        </View>
        <TouchableOpacity 
          style={[styles.toggleBtn, isOnline ? styles.toggleOnline : styles.toggleOffline]}
          onPress={() => setIsOnline(!isOnline)}
        >
          <View style={[styles.toggleThumb, isOnline ? styles.thumbOnline : styles.thumbOffline]} />
          <Text style={[styles.toggleText, isOnline ? styles.textOnline : styles.textOffline]}>
            {isOnline ? 'ONLINE' : 'OFFLINE'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Next Trip Card */}
      <Text style={styles.sectionTitle}>CURRENT ASSIGNMENT</Text>
      
      {isOnline ? (
        nextTrip ? (
          <View style={styles.tripCard}>
            <View style={styles.cardHeader}>
              <View style={styles.badge}><Text style={styles.badgeText}>TRIP #{nextTrip.id.slice(-4).toUpperCase()}</Text></View>
              <Text style={styles.timeText}>
                {new Date(nextTrip.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
            
            <View style={styles.routeContainer}>
              <View style={styles.timeline}>
                <View style={styles.dotGreen} />
                <View style={styles.line} />
                <View style={styles.dotRed} />
              </View>
              <View style={styles.routeDetails}>
                <View style={styles.locationBlock}>
                  <Text style={styles.locationTitle}>{nextTrip.startLocation || 'Pickup Point'}</Text>
                  <Text style={styles.locationSub}>Pickup • {nextTrip.passengers?.length || 0} Employees</Text>
                </View>
                <View style={styles.locationBlock}>
                  <Text style={styles.locationTitle}>{nextTrip.endLocation || 'Drop-off Point'}</Text>
                  <Text style={styles.locationSub}>Drop-off</Text>
                </View>
              </View>
            </View>

            {nextTrip.status === 'SCHEDULED' ? (
              <TouchableOpacity 
                style={styles.startBtn} 
                onPress={() => handleTripAction(nextTrip.id, 'START')}
                disabled={loadingActionId === nextTrip.id}
              >
                {loadingActionId === nextTrip.id ? (
                  <ActivityIndicator color="#7c3aed" />
                ) : (
                  <Text style={styles.startBtnText}>Start Trip</Text>
                )}
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={[styles.startBtn, { backgroundColor: '#10b981' }]} 
                onPress={() => handleTripAction(nextTrip.id, 'COMPLETE')}
                disabled={loadingActionId === nextTrip.id}
              >
                {loadingActionId === nextTrip.id ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={[styles.startBtnText, { color: '#fff' }]}>Complete Trip</Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={styles.offlineCard}>
            <Text style={styles.offlineTextTitle}>No Active Trips</Text>
            <Text style={styles.offlineTextSub}>You're all caught up for now.</Text>
          </View>
        )
      ) : (
        <View style={styles.offlineCard}>
          <Text style={styles.offlineTextTitle}>You are Offline</Text>
          <Text style={styles.offlineTextSub}>Go Online to receive trip assignments.</Text>
        </View>
      )}

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>TODAY'S TRIPS</Text>
          <Text style={styles.statValue}>{trips.length} <Text style={styles.statUnit}>Total</Text></Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>VEHICLE</Text>
          <Text style={[styles.statValue, { fontSize: 16, marginTop: 4 }]}>{nextTrip?.vehicle?.plateNumber || 'N/A'}</Text>
          <Text style={styles.statUnit}>{nextTrip?.vehicle?.model || ''}</Text>
        </View>
      </View>

      {/* SOS Button */}
      <TouchableOpacity style={styles.sosButton} onPress={() => Alert.alert('S.O.S', 'Emergency services notified.')}>
        <Text style={styles.sosText}>EMERGENCY S.O.S</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#080810' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 },
  greeting: { fontSize: 28, fontWeight: '900', color: '#fff' },
  driverName: { fontSize: 16, color: '#94a3b8', fontWeight: '600' },
  
  toggleBtn: { width: 140, height: 56, borderRadius: 100, justifyContent: 'center', paddingHorizontal: 6, position: 'relative' },
  toggleOnline: { backgroundColor: 'rgba(16,185,129,0.1)' },
  toggleOffline: { backgroundColor: 'rgba(255,255,255,0.05)' },
  toggleThumb: { width: 44, height: 44, borderRadius: 22, position: 'absolute', top: 6 },
  thumbOnline: { backgroundColor: '#10b981', right: 6, shadowColor: '#10b981', shadowOpacity: 0.5, shadowRadius: 10 },
  thumbOffline: { backgroundColor: '#64748b', left: 6 },
  toggleText: { fontSize: 13, fontWeight: '800', position: 'absolute' },
  textOnline: { left: 24, color: '#34d399' },
  textOffline: { right: 24, color: '#94a3b8' },

  sectionTitle: { fontSize: 12, fontWeight: '800', color: '#64748b', letterSpacing: 1.5, marginBottom: 16, marginLeft: 4 },
  
  tripCard: { backgroundColor: '#7c3aed', borderRadius: 32, padding: 24, shadowColor: '#4c1d95', shadowOpacity: 0.5, shadowRadius: 20 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  badge: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 100 },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '800' },
  timeText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  
  routeContainer: { flexDirection: 'row' },
  timeline: { width: 24, alignItems: 'center', paddingVertical: 6 },
  dotGreen: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#34d399' },
  dotRed: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#fb7185' },
  line: { width: 2, flex: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginVertical: 4 },
  
  routeDetails: { flex: 1, paddingLeft: 12 },
  locationBlock: { marginBottom: 24 },
  locationTitle: { fontSize: 18, color: '#fff', fontWeight: '800' },
  locationSub: { fontSize: 14, color: 'rgba(255,255,255,0.7)', fontWeight: '600', marginTop: 4 },
  
  startBtn: { backgroundColor: '#fff', height: 56, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginTop: 8 },
  startBtnText: { color: '#7c3aed', fontSize: 18, fontWeight: '900' },

  offlineCard: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 32, padding: 32, alignItems: 'center' },
  offlineTextTitle: { fontSize: 20, color: '#fff', fontWeight: '800', marginBottom: 8 },
  offlineTextSub: { fontSize: 15, color: '#94a3b8', textAlign: 'center' },

  statsRow: { flexDirection: 'row', gap: 16, marginVertical: 24 },
  statBox: { flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 24, padding: 20 },
  statLabel: { fontSize: 11, color: '#94a3b8', fontWeight: '800', letterSpacing: 1.5, marginBottom: 8 },
  statValue: { fontSize: 32, color: '#fff', fontWeight: '900' },
  statUnit: { fontSize: 14, color: '#64748b' },

  sosButton: { height: 60, backgroundColor: 'rgba(244,63,94,0.1)', borderColor: 'rgba(244,63,94,0.3)', borderWidth: 1, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 40 },
  sosText: { color: '#fb7185', fontSize: 16, fontWeight: '800', letterSpacing: 1 }
});
