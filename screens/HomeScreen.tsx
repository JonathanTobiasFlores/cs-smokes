// src/screens/HomeScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { MapCard } from '../components/MapCard';
import { useMaps } from '../hooks/useMaps';
import { theme } from '../theme';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { data: maps, isLoading, error } = useMaps();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
      
      <View style={styles.header}>
        <Text style={styles.title}>CS2 Lineups</Text>
        <Text style={styles.subtitle}>Master your utility usage</Text>
        <View style={styles.testButtons}>
          <TouchableOpacity 
            style={styles.testButton}
            onPress={() => navigation.navigate('UploadTest')}
          >
            <Text style={styles.testButtonText}>Test Upload</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.testButton}
            onPress={() => navigation.navigate('SupabaseTest')}
          >
            <Text style={styles.testButtonText}>Test Connection</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={maps?.filter(map => map.active) || []}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.mapList}
        columnWrapperStyle={styles.mapRow}
        renderItem={({ item }) => (
          <MapCard
            map={item}
            onPress={() => navigation.navigate('MapDetail', { 
              mapId: item.id, 
              mapName: item.displayName 
            })}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              {isLoading ? 'Loading maps...' : error ? 'Failed to load maps' : 'No maps found'}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  mapList: {
    padding: theme.spacing.md,
  },
  mapRow: {
    justifyContent: 'space-between',
  },
  testButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  testButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  testButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    color: theme.colors.textSecondary,
    fontSize: 16,
  },
});