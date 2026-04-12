import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

export default function EmployeeProfile() {
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
          <Text style={styles.avatarText}>{user?.name?.charAt(0) || 'E'}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{user?.name || 'Employee'}</Text>
          <Text style={styles.email}>{user?.role || 'EMPLOYEE'}</Text>
          <View style={styles.tenantBadge}>
            <Text style={styles.tenantText}>{user?.tenantName || 'Fleet Flows'}</Text>
          </View>
        </View>
      </View>

      {/* Menu Options */}
      <View style={styles.menuGroup}>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>Notification Preferences</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>Commute History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]}>
          <Text style={styles.menuItemText}>Contact Admin Support</Text>
        </TouchableOpacity>
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>

      <Text style={styles.version}>Fleet Flows Employee App v1.0 (Native)</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#080810' },
  title: { fontSize: 28, fontWeight: '900', color: '#fff', marginBottom: 24 },
  
  profileCard: { backgroundColor: '#1e3a8a', borderRadius: 24, padding: 20, flexDirection: 'row', alignItems: 'center', marginBottom: 24, shadowColor: '#1d4ed8', shadowOpacity: 0.3, shadowRadius: 20 },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#3b82f6', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  avatarText: { color: '#fff', fontSize: 24, fontWeight: '800' },
  info: { flex: 1 },
  name: { fontSize: 20, fontWeight: '800', color: '#fff' },
  email: { fontSize: 13, color: '#bfdbfe', fontWeight: '500', marginTop: 2 },
  tenantBadge: { backgroundColor: 'rgba(255,255,255,0.1)', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginTop: 10 },
  tenantText: { color: '#fff', fontSize: 10, fontWeight: '800', letterSpacing: 1 },

  settingsCard: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 24, padding: 20, flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 24 },
  settingsIcon: { width: 48, height: 48, borderRadius: 16, backgroundColor: 'rgba(59,130,246,0.1)', justifyContent: 'center', alignItems: 'center' },
  iconText: { fontSize: 24 },
  settingsLabel: { fontSize: 10, color: '#64748b', fontWeight: '800', letterSpacing: 1.5, marginBottom: 4 },
  settingsName: { fontSize: 16, color: '#fff', fontWeight: '800' },
  settingsSub: { fontSize: 13, color: '#94a3b8', marginTop: 2 },

  menuGroup: { backgroundColor: '#0d0d18', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 24, marginBottom: 24 },
  menuItem: { padding: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  menuItemText: { color: '#e2e8f0', fontSize: 16, fontWeight: '700' },

  logoutBtn: { backgroundColor: 'rgba(244,63,94,0.1)', height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  logoutText: { color: '#fb7185', fontSize: 16, fontWeight: '800' },

  version: { textAlign: 'center', color: '#475569', fontSize: 12, fontWeight: '600', marginTop: 32, marginBottom: 40 }
});
