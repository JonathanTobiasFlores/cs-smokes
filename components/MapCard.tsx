import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { CSMap } from '../types';
import { theme } from '../theme';

const { width } = Dimensions.get('window');
const cardWidth = (width - theme.spacing.md * 3) / 2;

interface Props {
  map: CSMap;
  onPress: () => void;
}

export const MapCard: React.FC<Props> = ({ map, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.imageContainer}>
        <Image source={map.image} style={styles.image} />
        {map.competitivePool && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>ACTIVE</Text>
          </View>
        )}
      </View>
      <View style={styles.content}>
        <Text style={styles.name}>{map.displayName}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: cardWidth,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: cardWidth * 0.6,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  badge: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  badgeText: {
    ...theme.typography.small,
    color: theme.colors.text,
    fontWeight: '700',
  },
  content: {
    padding: theme.spacing.md,
  },
  name: {
    ...theme.typography.h3,
    color: theme.colors.text,
  },
});