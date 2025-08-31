// src/components/QuickAccessBar.tsx
import React, { useEffect, useState } from 'react';
import { ScrollView, Pressable, Text, StyleSheet } from 'react-native';
import { AsyncStorageService } from '../services/storage/AsyncStorageService';

const storage = new AsyncStorageService();

interface Props {
  onSelectLineup: (lineupId: string) => void;
}

export function QuickAccessBar({ onSelectLineup }: Props) {
  const [lastViewed, setLastViewed] = useState<string[]>([]);

  useEffect(() => {
    const loadLastViewed = async () => {
      const data = await storage.getLastViewed();
      setLastViewed(data);
    };
    loadLastViewed();
  }, []);

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {/* Recent lineups for instant access */}
      {lastViewed.map((lineupId: string) => (
        <Pressable 
          key={lineupId}
          onPress={() => onSelectLineup(lineupId)}
          style={styles.quickButton}
        >
          <Text style={styles.buttonText}>Quick Access</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  quickButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});