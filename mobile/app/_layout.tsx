import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#080810' } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(driver)" options={{ gestureEnabled: false }} />
      </Stack>
    </>
  );
}
