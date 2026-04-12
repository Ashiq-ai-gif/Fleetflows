import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function DriverTrips() {
  const trips = [
    { id: '1042', time: '09:00 AM', status: 'EN_ROUTE', pickup: 'Tech Park Sector 4', dropoff: 'Central Station', pax: 5 },
    { id: '1043', time: '01:30 PM', status: 'SCHEDULED', pickup: 'Central Station', dropoff: 'Office HQ', pax: 3 },
    { id: '1041', time: '06:00 AM', status: 'COMPLETED', pickup: 'Office HQ', dropoff: 'Tech Park Sector 4', pax: 4 }
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 24, paddingTop: 60 }}>
      <Text style={styles.title}>Today's Itinerary</Text>
      <Text style={styles.subtitle}>You have {trips.length} trips assigned for today.</Text>

      <View style={styles.list}>
        {trips.map((trip) => {
          const isEnRoute = trip.status === 'EN_ROUTE';
          const isCompleted = trip.status === 'COMPLETED';

          return (
            <View key={trip.id} style={[styles.card, isEnRoute && styles.cardActive, isCompleted && styles.cardCompleted]}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.timeText}>{trip.time}</Text>
                  <Text style={styles.idText}>TRIP #{trip.id}</Text>
                </View>
                <View style={[styles.badge, isEnRoute && styles.badgeActive, isCompleted && styles.badgeCompleted]}>
                  <Text style={[styles.badgeText, isEnRoute && styles.badgeTextActive, isCompleted && styles.badgeTextCompleted]}>
                    {trip.status.replace('_', ' ')}
                  </Text>
                </View>
              </View>

              <View style={styles.routeContainer}>
                <View style={styles.timeline}>
                  <View style={[styles.dot, isCompleted ? styles.dotGray : styles.dotGreen]} />
                  <View style={[styles.line, isCompleted && styles.lineGray]} />
                  <View style={[styles.dot, isCompleted ? styles.dotGray : styles.dotRed]} />
                </View>
                <View style={styles.routeDetails}>
                  <View style={styles.locationBlock}>
                    <Text style={[styles.locationTitle, isCompleted && styles.textGray]}>{trip.pickup}</Text>
                    <Text style={styles.locationSub}>{trip.pax} Pickups</Text>
                  </View>
                  <View style={styles.locationBlock}>
                    <Text style={[styles.locationTitle, isCompleted && styles.textGray]}>{trip.dropoff}</Text>
                    <Text style={styles.locationSub}>Drop-off Point</Text>
                  </View>
                </View>
              </View>

              {isEnRoute && (
                <View style={styles.actionRow}>
                  <TouchableOpacity style={styles.supportBtn}>
                    <Text style={styles.supportText}>Support</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.endBtn}>
                    <Text style={styles.endBtnText}>End Trip</Text>
                  </TouchableOpacity>
                </View>
              )}

              {trip.status === 'SCHEDULED' && (
                <TouchableOpacity style={styles.startBtn}>
                  <Text style={styles.startBtnText}>Start Navigating</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#080810' },
  title: { fontSize: 28, fontWeight: '900', color: '#fff', marginBottom: 4 },
  subtitle: { fontSize: 16, color: '#94a3b8', fontWeight: '600', marginBottom: 32 },
  list: { paddingBottom: 40 },
  
  card: { backgroundColor: '#0d0d18', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 24, padding: 20, marginBottom: 16 },
  cardActive: { backgroundColor: 'rgba(124,58,237,0.1)', borderColor: 'rgba(124,58,237,0.3)', shadowColor: '#7c3aed', shadowOpacity: 0.2, shadowRadius: 20 },
  cardCompleted: { opacity: 0.6, borderColor: 'transparent' },

  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  timeText: { color: '#fff', fontSize: 18, fontWeight: '800' },
  idText: { color: '#64748b', fontSize: 11, fontWeight: '800', letterSpacing: 1, marginTop: 4 },
  
  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 100, backgroundColor: 'rgba(245,158,11,0.2)' },
  badgeActive: { backgroundColor: 'rgba(16,185,129,0.2)' },
  badgeCompleted: { backgroundColor: 'rgba(100,116,139,0.2)' },
  badgeText: { fontSize: 10, fontWeight: '900', letterSpacing: 1, color: '#fbbf24' },
  badgeTextActive: { color: '#34d399' },
  badgeTextCompleted: { color: '#94a3b8' },

  routeContainer: { flexDirection: 'row' },
  timeline: { width: 20, alignItems: 'center', paddingVertical: 6 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  dotGreen: { backgroundColor: '#34d399' },
  dotRed: { backgroundColor: '#fb7185' },
  dotGray: { backgroundColor: '#64748b' },
  line: { width: 2, flex: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginVertical: 4 },
  lineGray: { backgroundColor: 'rgba(255,255,255,0.05)' },
  
  routeDetails: { flex: 1, paddingLeft: 12 },
  locationBlock: { marginBottom: 20 },
  locationTitle: { fontSize: 16, color: '#f8fafc', fontWeight: '800' },
  textGray: { color: '#94a3b8' },
  locationSub: { fontSize: 13, color: '#64748b', fontWeight: '600', marginTop: 2 },

  actionRow: { flexDirection: 'row', gap: 12, marginTop: 16, paddingTop: 20, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
  supportBtn: { flex: 1, height: 48, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  supportText: { color: '#cbd5e1', fontSize: 15, fontWeight: '800' },
  endBtn: { flex: 1, height: 48, backgroundColor: '#10b981', borderRadius: 16, justifyContent: 'center', alignItems: 'center', shadowColor: '#059669', shadowOpacity: 0.4, shadowRadius: 10 },
  endBtnText: { color: '#fff', fontSize: 15, fontWeight: '900' },

  startBtn: { height: 48, backgroundColor: '#7c3aed', borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginTop: 16 },
  startBtnText: { color: '#fff', fontSize: 15, fontWeight: '900' }
});
