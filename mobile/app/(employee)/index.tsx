import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import MapView, { Marker } from 'react-native-maps';
import { getMobileV1Base } from '../constants';

export default function EmployeeDashboard() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [trips, setTrips] = useState<any[]>([]);
  const [employee, setEmployee] = useState<any>(null);
  const [driverLocation, setDriverLocation] = useState<any>(null);

  const fetchData = async () => {
    try {
      const token = await SecureStore.getItemAsync('fleetToken');
      const userData = await SecureStore.getItemAsync('fleetUser');
      
      if (userData) {
        setEmployee(JSON.parse(userData));
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

  const handlePassengerAction = async (tripId: string, action: 'BOARD' | 'NO_SHOW') => {
    try {
      setLoading(true);
      const token = await SecureStore.getItemAsync('fleetToken');
      
      const response = await fetch(`${getMobileV1Base()}/passengers/${tripId}/action`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action })
      });

      const data = await response.json();
      if (data.success) {
        Alert.alert("Success", action === 'BOARD' ? "You have boarded." : "Recorded as No Show.");
        fetchData();
      } else {
        Alert.alert("Action Failed", data.error || "Could not update status.");
      }
    } catch (error) {
      Alert.alert("Network Error", "Could not reach the server.");
    } finally {
      setLoading(false);
    }
  };

  const nextTrip = trips.length > 0 ? trips[0] : null;
  // Determine if employee already boarded the active trip
  const amIBoarded = nextTrip?.passengers?.find((p: any) => p.employeeId === employee?.id)?.status === "boarded";
  const myPassengerRecord = nextTrip?.passengers?.find((p: any) => p.employeeId === employee?.id);

  useEffect(() => {
    let interval: any;
    if (nextTrip?.driverId && nextTrip?.status === 'EN_ROUTE') {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`${getMobileV1Base().replace('/v1', '')}/driver/location?driverId=${nextTrip.driverId}`);
          const data = await res.json();
          if (data.success && data.location.latitude) {
            setDriverLocation({ lat: data.location.latitude, lng: data.location.longitude });
          }
        } catch (e) {}
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [nextTrip]);

  if (loading && !refreshing) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={{ padding: 24, paddingTop: 60 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3b82f6" />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello,</Text>
          <Text style={styles.name}>{employee?.name || 'Employee'}</Text>
        </View>
        <TouchableOpacity style={styles.sosButton} onPress={() => Alert.alert('SOS', 'Emergency alert sent to Admin.')}>
          <Text style={styles.sosText}>SOS</Text>
        </TouchableOpacity>
      </View>

      {/* UPCOMING RIDE CARD */}
      <Text style={styles.sectionTitle}>UPCOMING COMMUTE</Text>
      
      {nextTrip ? (
        <View style={styles.rideCard}>
          <View style={styles.cardHeader}>
            <View style={styles.badge}><Text style={styles.badgeText}>TRIP #{nextTrip.id.slice(-4).toUpperCase()}</Text></View>
            <View style={{alignItems: 'flex-end'}}>
               <Text style={{color: '#34d399', fontSize: 10, fontWeight: '800', uppercase: true}}>Precise ETA</Text>
               <Text style={styles.timeText}>
                 {myPassengerRecord?.estimatedPickupTime ? new Date(myPassengerRecord.estimatedPickupTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : new Date(nextTrip.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
               </Text>
            </View>
          </View>

          {/* Live Map Stub */}
          <View style={styles.mapStub}>
            {driverLocation ? (
              <MapView 
                style={{ width: '100%', height: '100%' }}
                region={{
                  latitude: driverLocation.lat,
                  longitude: driverLocation.lng,
                  latitudeDelta: 0.0122,
                  longitudeDelta: 0.0121,
                }}
              >
                 <Marker coordinate={{ latitude: driverLocation.lat, longitude: driverLocation.lng }} pinColor="#3b82f6" />
              </MapView>
            ) : (
              <Text style={styles.mapText}>{nextTrip.status === 'EN_ROUTE' ? 'Locating driver...' : 'Live tracking begins when trip starts'}</Text>
            )}
          </View>

          <View style={styles.driverInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{nextTrip.driver?.name?.charAt(0) || 'D'}</Text>
            </View>
            <View style={styles.driverDetails}>
              <Text style={styles.driverName}>{nextTrip.driver?.name || 'Driver Assigned'}</Text>
              <Text style={styles.driverVehicle}>{nextTrip.vehicle?.model || 'Vehicle'} • {nextTrip.vehicle?.plateNumber || ''}</Text>
            </View>
          </View>

          <View style={styles.routeContainer}>
            <View style={styles.timeline}>
              <View style={styles.dotCurrent} />
              <View style={styles.line} />
              <View style={styles.dotDestination} />
            </View>
            <View style={styles.routeDetails}>
              <View style={styles.locationBlock}>
                <Text style={styles.locationTitle}>{nextTrip.startLocation || 'Pickup Point'}</Text>
                <Text style={styles.locationSub}>Your Pickup • Scheduled</Text>
              </View>
              <View style={styles.locationBlock}>
                <Text style={styles.locationTitle}>{nextTrip.endLocation || 'Office HQ'}</Text>
                <Text style={styles.locationSub}>Drop-off</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={{ gap: 12 }}>
            {nextTrip.status === "EN_ROUTE" && !amIBoarded && (
              <TouchableOpacity 
                style={[styles.callBtn, { backgroundColor: '#10b981' }]} 
                onPress={() => handlePassengerAction(nextTrip.id, 'BOARD')}
              >
                <Text style={[styles.callBtnText, { color: '#fff' }]}>Confirm Boarding</Text>
              </TouchableOpacity>
            )}
            {amIBoarded && (
              <View style={[styles.callBtn, { backgroundColor: 'rgba(16,185,129,0.1)' }]}>
                <Text style={[styles.callBtnText, { color: '#34d399' }]}>✓ Boarded Successfully</Text>
              </View>
            )}
            <TouchableOpacity 
              style={styles.callBtn} 
              onPress={() => Alert.alert('Call', `Calling driver ${nextTrip.driver?.name}...`)}
            >
              <Text style={styles.callBtnText}>Call Driver ({nextTrip.driver?.phone || 'N/A'})</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTextTitle}>No Rides Scheduled</Text>
          <Text style={styles.emptyTextSub}>We'll notify you when a trip is assigned.</Text>
        </View>
      )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#080810' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 },
  greeting: { fontSize: 28, fontWeight: '900', color: '#fff' },
  name: { fontSize: 16, color: '#94a3b8', fontWeight: '600' },
  
  sosButton: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(244,63,94,0.1)', borderWidth: 2, borderColor: '#fb7185', justifyContent: 'center', alignItems: 'center', shadowColor: '#fb7185', shadowOpacity: 0.3, shadowRadius: 10 },
  sosText: { color: '#fb7185', fontSize: 13, fontWeight: '900', letterSpacing: 1 },

  sectionTitle: { fontSize: 12, fontWeight: '800', color: '#64748b', letterSpacing: 1.5, marginBottom: 16, marginLeft: 4 },
  
  rideCard: { backgroundColor: '#1e3a8a', borderRadius: 32, padding: 24, shadowColor: '#1d4ed8', shadowOpacity: 0.5, shadowRadius: 20 },
  emptyCard: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 32, padding: 40, alignItems: 'center' },
  emptyTextTitle: { fontSize: 20, color: '#fff', fontWeight: '800', marginBottom: 8 },
  emptyTextSub: { fontSize: 15, color: '#94a3b8', textAlign: 'center' },

  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  badge: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 100 },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '800' },
  timeText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  
  mapStub: { height: 160, backgroundColor: '#0f172a', borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 20, position: 'relative', overflow: 'hidden' },
  mapText: { color: '#334155', fontWeight: '800', fontSize: 12 },
  driverPin: { position: 'absolute', width: 24, height: 24, backgroundColor: '#3b82f6', borderRadius: 12, borderWidth: 3, borderColor: '#fff' },

  driverInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 24, paddingVertical: 16, borderTopWidth: 1, borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#3b82f6', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  avatarText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  driverDetails: { flex: 1 },
  driverName: { fontSize: 18, color: '#fff', fontWeight: '800' },
  driverVehicle: { fontSize: 13, color: '#bfdbfe', marginTop: 2 },

  routeContainer: { flexDirection: 'row', marginBottom: 20 },
  timeline: { width: 24, alignItems: 'center', paddingVertical: 6 },
  dotCurrent: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#3b82f6' },
  dotDestination: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#fb7185' },
  line: { width: 2, flex: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginVertical: 4 },
  
  routeDetails: { flex: 1, paddingLeft: 12 },
  locationBlock: { marginBottom: 20 },
  locationTitle: { fontSize: 18, color: '#fff', fontWeight: '800' },
  locationSub: { fontSize: 14, color: 'rgba(255,255,255,0.7)', fontWeight: '600', marginTop: 4 },
  
  callBtn: { backgroundColor: '#fff', height: 56, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  callBtnText: { color: '#1e3a8a', fontSize: 16, fontWeight: '900' }
});
