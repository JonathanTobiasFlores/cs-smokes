import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/HomeScreen';
import { MapDetailScreen } from '../screens/MapDetailScreen';
import { LineupDetailScreen } from '../screens/LineupDetailScreen';
import { UploadTest } from '../components/UploadTest';
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
          component={MapDetailScreen}
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};