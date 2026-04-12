import { Tabs } from 'expo-router';

export default function DriverTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0d0d18',
          borderTopWidth: 1,
          borderTopColor: 'rgba(255,255,255,0.05)',
          height: 85,
          paddingBottom: 25,
          paddingTop: 10,
        },
        tabBarActiveTintColor: '#a78bfa',
        tabBarInactiveTintColor: '#64748b',
        sceneStyle: { backgroundColor: '#080810' }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          // Icon configuration would go here using @expo/vector-icons
        }}
      />
      <Tabs.Screen
        name="trips"
        options={{
          title: 'Itinerary',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
        }}
      />
    </Tabs>
  );
}
