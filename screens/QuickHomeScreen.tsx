// src/screens/QuickHomeScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { theme } from '../theme';

type QuickHomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: QuickHomeScreenNavigationProp;
}

export const QuickHomeScreen: React.FC<Props> = ({ navigation }) => {
  const maps = [
    { id: 'dust2', name: 'Dust 2', color: '#E8B866' },
    { id: 'mirage', name: 'Mirage', color: '#7BA4D0' },
    { id: 'inferno', name: 'Inferno', color: '#D97F5B' },
    { id: 'nuke', name: 'Nuke', color: '#91B85D' },
    { id: 'overpass', name: 'Overpass', color: '#6B9B84' },
    { id: 'ancient', name: 'Ancient', color: '#A67C52' },
    { id: 'anubis', name: 'Anubis', color: '#C4A05A' },
    { id: 'vertigo', name: 'Vertigo', color: '#5C8FA8' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>CS2 LINEUPS</Text>
        <Text style={styles.subtitle}>Quick Access</Text>
      </View>

      <ScrollView 
        style={styles.mapGrid}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.gridContainer}>
          {maps.map(map => (
            <TouchableOpacity
              key={map.id}
              style={[styles.mapCard, { backgroundColor: map.color }]}
              onPress={() => navigation.navigate('MapDetail', {
                mapId: map.id,
                mapName: map.name,
              })}
              activeOpacity={0.8}
            >
              <Text style={styles.mapName}>{map.name.toUpperCase()}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0E27',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 4,
  },
  mapGrid: {
    flex: 1,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    justifyContent: 'space-between',
  },
  mapCard: {
    width: '48%',
    aspectRatio: 1.5,
    borderRadius: 12,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFF',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
});