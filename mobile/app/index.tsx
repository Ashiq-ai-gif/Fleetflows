import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { router } from 'expo-router';

import * as SecureStore from 'expo-secure-store';
import { getMobileV1Base } from './constants';

export default function LoginScreen() {
  const [role, setRole] = useState<'DRIVER' | 'EMPLOYEE'>('DRIVER');
  const [identifier, setIdentifier] = useState(''); // phone or email
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!identifier || !pin) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch(`${getMobileV1Base()}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, identifier, pin }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Securely store the JWT token for future API requests
        await SecureStore.setItemAsync('fleetToken', data.token);
        await SecureStore.setItemAsync('fleetUser', JSON.stringify(data.user));

        if (role === 'DRIVER') router.replace('/(driver)');
        if (role === 'EMPLOYEE') router.replace('/(employee)');
      } else {
        Alert.alert('Login Failed', data.error || 'Invalid credentials.');
      }
    } catch (error) {
      Alert.alert('Network Error', 'Could not reach the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <View style={styles.header}>
            <View style={[styles.logoBox, role === 'EMPLOYEE' && styles.logoBoxEmployee]}>
              <Text style={styles.logoText}>FF</Text>
            </View>
            <Text style={styles.title}>{role === 'DRIVER' ? 'Driver Hub' : 'Employee Portal'}</Text>
            <Text style={styles.subtitle}>Sign in to view your itinerary</Text>
          </View>

          <View style={styles.form}>
            {/* Role Toggle */}
            <View style={styles.roleToggle}>
              <TouchableOpacity 
                style={[styles.roleBtn, role === 'DRIVER' && styles.roleBtnActive]}
                onPress={() => setRole('DRIVER')}
              >
                <Text style={[styles.roleText, role === 'DRIVER' && styles.roleTextActive]}>Driver</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.roleBtn, role === 'EMPLOYEE' && styles.roleBtnActive]}
                onPress={() => setRole('EMPLOYEE')}
              >
                <Text style={[styles.roleText, role === 'EMPLOYEE' && styles.roleTextActive]}>Employee</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>{role === 'DRIVER' ? 'Phone Number' : 'Work Email / ID'}</Text>
            <TextInput
              style={styles.input}
              placeholder={role === 'DRIVER' ? 'Enter phone number' : 'Enter email or ID'}
              placeholderTextColor="#64748b"
              keyboardType={role === 'DRIVER' ? 'phone-pad' : 'email-address'}
              autoCapitalize="none"
              value={identifier}
              onChangeText={setIdentifier}
            />

            <Text style={styles.label}>PIN Code</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter 4-digit PIN"
              placeholderTextColor="#64748b"
              keyboardType="number-pad"
              secureTextEntry
              value={pin}
              onChangeText={setPin}
            />

            <TouchableOpacity 
              style={[styles.button, role === 'EMPLOYEE' && styles.buttonEmployee, (!identifier || !pin) && styles.buttonDisabled]} 
              onPress={handleLogin}
              disabled={loading || !identifier || !pin}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>
                  {role === 'DRIVER' ? 'Sign In To Drive' : 'Sign In To Commute'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#080810', padding: 24 },
  inner: { flex: 1, justifyContent: 'space-between' },
  header: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  logoBox: { width: 80, height: 80, backgroundColor: '#7c3aed', borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  logoBoxEmployee: { backgroundColor: '#2563eb' },
  logoText: { color: '#fff', fontSize: 32, fontWeight: '900' },
  title: { fontSize: 32, fontWeight: '900', color: '#fff', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#94a3b8', fontWeight: '500' },
  
  form: { flex: 1, justifyContent: 'flex-end', paddingBottom: 32 },
  
  roleToggle: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 4, marginBottom: 32 },
  roleBtn: { flex: 1, paddingVertical: 14, alignItems: 'center', borderRadius: 12 },
  roleBtnActive: { backgroundColor: 'rgba(255,255,255,0.1)' },
  roleText: { color: '#64748b', fontSize: 15, fontWeight: '800' },
  roleTextActive: { color: '#fff' },

  label: { fontSize: 14, fontWeight: '700', color: '#94a3b8', marginBottom: 8, marginLeft: 4 },
  input: { height: 60, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 16, paddingHorizontal: 20, color: '#fff', fontSize: 16, marginBottom: 24, fontWeight: '500' },
  
  button: { height: 60, backgroundColor: '#7c3aed', borderRadius: 100, justifyContent: 'center', alignItems: 'center', shadowColor: '#7c3aed', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20 },
  buttonEmployee: { backgroundColor: '#2563eb', shadowColor: '#2563eb' },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '800' }
});
