// src/screens/QuickMapScreen.tsx
import React, { useEffect } from 'react';
import { FlatList, View, Text, Pressable, StyleSheet } from 'react-native';
import { Image } from 'expo-image'; // Much faster than React Native Image
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { useMapLineups } from '../hooks/useLineups';
import { MediaCacheService } from '../services/media/MediaCacheServices';

const mediaCache = new MediaCacheService();

type QuickMapScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MapDetail'>;
type QuickMapScreenRouteProp = RouteProp<RootStackParamList, 'MapDetail'>;

interface Props {
  navigation: QuickMapScreenNavigationProp;
  route: QuickMapScreenRouteProp;
}

export function QuickMapScreen({ route, navigation }: Props) {
  const { mapId } = route.params;
  const { data: lineups, isLoading } = useMapLineups(mapId);

  useEffect(() => {
    // Pre-cache essential videos in background
    if (lineups && Array.isArray(lineups) && lineups.length > 0) {
      mediaCache.preloadEssentialVideos(mapId, lineups);
    }
  }, [lineups]);

  // Render immediately with cached data
  return (
    <FlatList
      data={Array.isArray(lineups) ? lineups : []}
      keyExtractor={item => item.id}
      removeClippedSubviews={true} // Performance optimization
      maxToRenderPerBatch={10}
      initialNumToRender={5}
      windowSize={10}
      renderItem={({ item }) => (
        <Pressable 
          onPress={() => navigation.navigate('LineupDetail', { lineup: item })}
          style={styles.card}
        >
          <Image
            source={{ uri: item.thumbnail_url }}
            style={styles.thumbnail}
            contentFit="cover"
            transition={200}
            cachePolicy="memory-disk" // Aggressive caching
          />
          <View style={styles.info}>
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.position}>
              {item.start_position.callout} → {item.end_position.callout}
            </Text>
          </View>
        </Pressable>
      )}
      ListEmptyComponent={
        isLoading ? <LoadingState /> : <EmptyState />
      }
    />
  );
}

const LoadingState = () => (
  <View style={styles.loadingContainer}>
    <Text style={styles.loadingText}>Loading lineups...</Text>
  </View>
);

const EmptyState = () => (
  <View style={styles.emptyContainer}>
    <Text style={styles.emptyText}>No lineups found</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    margin: 8,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  thumbnail: {
    width: '100%',
    height: 120,
  },
  info: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  position: {
    fontSize: 14,
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});