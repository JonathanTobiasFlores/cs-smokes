// src/screens/SimplifiedMapScreen.tsx
import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Dimensions,
  ViewToken,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, UtilityType } from '../types';
import { LineupCardWithPreview } from '../components/LineupCardWithPreview';
import { useMapLineups } from '../hooks/useLineups';
import { theme } from '../theme';

const { width } = Dimensions.get('window');

type SimplifiedMapScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MapDetail'>;
type SimplifiedMapScreenRouteProp = RouteProp<RootStackParamList, 'MapDetail'>;

interface Props {
  navigation: SimplifiedMapScreenNavigationProp;
  route: SimplifiedMapScreenRouteProp;
}

export const SimplifiedMapScreen: React.FC<Props> = ({ route, navigation }) => {
  const { mapId, mapName } = route.params;
  const [selectedUtility, setSelectedUtility] = useState<'all' | UtilityType>('all');
  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set());
  
  // Fetch real data from Supabase
  const { data: lineups, isLoading, error } = useMapLineups(mapId);
  
  const filteredLineups = (lineups || []).filter(lineup => 
    selectedUtility === 'all' || lineup.type === selectedUtility
  );
  
  // Track visible items for auto-preview
  const onViewableItemsChanged = useCallback(({ viewableItems }: { 
    viewableItems: ViewToken[] 
  }) => {
    const visibleIds = new Set(viewableItems.map(item => item.item.id));
    setVisibleItems(visibleIds);
  }, []);

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  return (
    <SafeAreaView style={styles.container}>
      {/* Simplified Header */}
      <View style={styles.header}>
        <Text style={styles.mapTitle}>{mapName}</Text>
        <View style={styles.filterRow}>
          {(['all', 'smoke', 'flash', 'molotov', 'grenade'] as const).map(type => (
            <TouchableOpacity
              key={type}
              style={[
                styles.filterButton,
                selectedUtility === type && styles.filterButtonActive,
                type !== 'all' && selectedUtility === type && {
                  backgroundColor: theme.colors[type]
                }
              ]}
              onPress={() => setSelectedUtility(type)}
            >
              <Ionicons 
                name={
                  type === 'all' ? 'apps' :
                  type === 'smoke' ? 'cloud' :
                  type === 'flash' ? 'flash' :
                  type === 'molotov' ? 'flame' : 'radio-button-on'
                } 
                size={20} 
                color={selectedUtility === type ? '#FFF' : '#999'} 
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Grid Layout for Lineups */}
      <FlatList
        data={filteredLineups}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.grid}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        renderItem={({ item }) => (
          <LineupCardWithPreview
            lineup={item}
            isVisible={visibleItems.has(item.id)}
            onPress={() => navigation.navigate('LineupDetail', { lineup: item })}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              {isLoading ? 'Loading lineups...' : error ? 'Failed to load lineups' : 'No lineups found'}
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
    backgroundColor: '#0A0E27',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  mapTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 12,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#FF6B35',
  },
  grid: {
    padding: 12,
  },
  row: {
    justifyContent: 'space-between',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
  },
});