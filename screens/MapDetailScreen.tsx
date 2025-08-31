// src/screens/MapDetailScreen.tsx
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, UtilityType, TeamSide } from '../types';
import { LineupCard } from '../components/LineupCard';
import { UtilityFilter } from '../components/UtilityFilter';
import { lineups } from '../data/lineups';
import { theme } from '../theme';

type MapDetailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MapDetail'>;
type MapDetailScreenRouteProp = RouteProp<RootStackParamList, 'MapDetail'>;

interface Props {
  navigation: MapDetailScreenNavigationProp;
  route: MapDetailScreenRouteProp;
}

export const MapDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { mapId, mapName } = route.params;
  const [selectedUtility, setSelectedUtility] = useState<UtilityType | 'all'>('all');
  const [selectedSide, setSelectedSide] = useState<TeamSide | 'both'>('both');

  const filteredLineups = useMemo(() => {
    return lineups.filter(lineup => {
      if (lineup.mapId !== mapId) return false;
      if (selectedUtility !== 'all' && lineup.type !== selectedUtility) return false;
      if (selectedSide !== 'both' && lineup.side !== selectedSide) return false;
      return true;
    });
  }, [mapId, selectedUtility, selectedSide]);

  const utilityTypes: Array<UtilityType | 'all'> = ['all', 'smoke', 'flash', 'molotov', 'grenade'];
  const sides: Array<TeamSide | 'both'> = ['both', 'T', 'CT'];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{mapName}</Text>
        <Text style={styles.subtitle}>{filteredLineups.length} lineups available</Text>
      </View>

      <View style={styles.filters}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
          {utilityTypes.map(type => (
            <UtilityFilter
              key={type}
              type={type}
              isSelected={selectedUtility === type}
              onPress={() => setSelectedUtility(type)}
            />
          ))}
        </ScrollView>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
          {sides.map(side => (
            <View key={side} style={[
              styles.sideFilter,
              selectedSide === side && styles.sideFilterActive,
              selectedSide === side && side !== 'both' && {
                backgroundColor: theme.colors[side.toLowerCase() as 't' | 'ct']
              }
            ]}>
              <Text 
                style={[
                  styles.sideFilterText,
                  selectedSide === side && styles.sideFilterTextActive
                ]}
                onPress={() => setSelectedSide(side)}
              >
                {side === 'both' ? 'Both Sides' : side === 'T' ? 'Terrorist' : 'Counter-Terrorist'}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredLineups}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lineupList}
        renderItem={({ item }) => (
          <LineupCard
            lineup={item}
            onPress={() => navigation.navigate('LineupDetail', { lineup: item })}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No lineups found with selected filters</Text>
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
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
  title: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  filters: {
    paddingBottom: theme.spacing.sm,
  },
  filterRow: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  sideFilter: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.surface,
    marginRight: theme.spacing.sm,
  },
  sideFilterActive: {
    backgroundColor: theme.colors.primary,
  },
  sideFilterText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  sideFilterTextActive: {
    color: theme.colors.text,
    fontWeight: '600',
  },
  lineupList: {
    padding: theme.spacing.lg,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.xxl,
  },
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
});