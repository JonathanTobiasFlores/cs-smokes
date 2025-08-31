import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/HomeScreen';
import { SimplifiedMapScreen } from '../screens/SimplifiedMapScreen';
import { LineupDetailScreen } from '../screens/LineupDetailScreen';
import { UploadTest } from '../components/UploadTest';
import { SupabaseTest } from '../components/SupabaseTest';
import { RootStackParamList } from '../types';
import { theme } from '../theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.surface,
          },
          headerTintColor: theme.colors.text,
          headerTitleStyle: {
            fontWeight: '600',
          },
          contentStyle: {
            backgroundColor: theme.colors.background,
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ 
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="MapDetail" 
          component={SimplifiedMapScreen}
          options={({ route }) => ({
            title: route.params.mapName,
          })}
        />
        <Stack.Screen 
          name="LineupDetail" 
          component={LineupDetailScreen}
          options={{
            title: 'Lineup Details',
          }}
        />
        <Stack.Screen 
          name="UploadTest" 
          component={UploadTest}
          options={{
            title: 'Upload Test',
          }}
        />
        <Stack.Screen 
          name="SupabaseTest" 
          component={SupabaseTest}
          options={{
            title: 'Supabase Test',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};