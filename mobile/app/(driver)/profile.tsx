import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

export default function DriverProfile() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadUser = async () => {
      const userData = await SecureStore.getItemAsync('fleetUser');
      if (userData) setUser(JSON.parse(userData));
    };
    loadUser();
  }, []);

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Logout', 
        style: 'destructive',
        onPress: async () => {
          await SecureStore.deleteItemAsync('fleetToken');
          await SecureStore.deleteItemAsync('fleetUser');
          router.replace('/');
        }
      }
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 24, paddingTop: 60 }}>
      <Text style={styles.title}>Profile</Text>

      {/* Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user?.name?.charAt(0) || 'D'}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{user?.name || 'Driver'}</Text>
          <Text style={styles.phone}>{user?.role || 'DRIVER'}</Text>
          <View style={styles.tenantBadge}>
            <Text style={styles.tenantText}>{user?.tenantName || 'Fleet Flows'}</Text>
          </View>
        </View>
      </View>

      {/* Menu Options */}
      <View style={styles.menuGroup}>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>Account Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]}>
          <Text style={styles.menuItemText}>Support & Help</Text>
        </TouchableOpacity>
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>

      <Text style={styles.version}>Fleet Flows Driver App v1.0 (Native)</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#080810' },
  title: { fontSize: 28, fontWeight: '900', color: '#fff', marginBottom: 24 },
  
  profileCard: { backgroundColor: '#0d0d18', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 24, padding: 20, flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#7c3aed', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  avatarText: { color: '#fff', fontSize: 24, fontWeight: '800' },
  info: { flex: 1 },
  name: { fontSize: 20, fontWeight: '800', color: '#fff' },
  phone: { fontSize: 14, color: '#94a3b8', fontWeight: '500', marginTop: 2 },
  tenantBadge: { backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginTop: 8 },
  tenantText: { color: '#cbd5e1', fontSize: 10, fontWeight: '800', letterSpacing: 1 },

  vehicleCard: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 24, padding: 20, flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 24 },
  vehicleIcon: { width: 48, height: 48, borderRadius: 16, backgroundColor: 'rgba(245,158,11,0.1)', justifyContent: 'center', alignItems: 'center' },
  iconText: { fontSize: 24 },
  vehicleLabel: { fontSize: 10, color: '#64748b', fontWeight: '800', letterSpacing: 1.5, marginBottom: 4 },
  vehicleName: { fontSize: 16, color: '#fff', fontWeight: '800' },
  vehiclePlate: { fontSize: 13, color: '#94a3b8', marginTop: 2 },

  menuGroup: { backgroundColor: '#0d0d18', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 24, marginBottom: 24 },
  menuItem: { padding: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  menuItemText: { color: '#e2e8f0', fontSize: 16, fontWeight: '700' },

  logoutBtn: { backgroundColor: 'rgba(244,63,94,0.1)', height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  logoutText: { color: '#fb7185', fontSize: 16, fontWeight: '800' },

  version: { textAlign: 'center', color: '#475569', fontSize: 12, fontWeight: '600', marginTop: 32, marginBottom: 20 }
});
