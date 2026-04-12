import { Tabs } from 'expo-router';

export default function EmployeeTabsLayout() {
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
        tabBarActiveTintColor: '#3b82f6', // distinct blue for employee app
        tabBarInactiveTintColor: '#64748b',
        sceneStyle: { backgroundColor: '#080810' }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Upcoming Ride',
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
