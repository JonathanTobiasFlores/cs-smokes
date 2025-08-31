// src/components/LineupCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Lineup } from '../types';
import { theme } from '../theme';

interface Props {
  lineup: Lineup;
  onPress: () => void;
}

const utilityIcons = {
  smoke: 'cloud',
  flash: 'flash',
  molotov: 'flame',
  grenade: 'radio-button-on',
};

const difficultyColors = {
  easy: theme.colors.success,
  medium: theme.colors.warning,
  hard: theme.colors.error,
};

export const LineupCard: React.FC<Props> = ({ lineup, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.utilityIcon, { backgroundColor: theme.colors[lineup.type] }]}>
            <Ionicons 
              name={utilityIcons[lineup.type] as any} 
              size={20} 
              color={theme.colors.text} 
            />
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.name}>{lineup.name}</Text>
            <View style={styles.tags}>
              <View style={[styles.sideTag, { backgroundColor: theme.colors[lineup.side.toLowerCase() as 't' | 'ct'] }]}>
                <Text style={styles.sideText}>{lineup.side}</Text>
              </View>
              <View style={[styles.difficultyTag, { borderColor: difficultyColors[lineup.difficulty] }]}>
                <Text style={[styles.difficultyText, { color: difficultyColors[lineup.difficulty] }]}>
                  {lineup.difficulty}
                </Text>
              </View>
            </View>
          </View>
        </View>
        {lineup.isPro && (
          <View style={styles.proBadge}>
            <Ionicons name="star" size={14} color={theme.colors.warning} />
            <Text style={styles.proText}>PRO</Text>
          </View>
        )}
      </View>
      
      <Text style={styles.description} numberOfLines={2}>
        {lineup.description}
      </Text>
      
      <View style={styles.footer}>
        <Text style={styles.callout}>
          {lineup.startPosition.callout} → {lineup.endPosition.callout}
        </Text>
        {lineup.views && (
          <View style={styles.views}>
            <Ionicons name="eye-outline" size={14} color={theme.colors.textSecondary} />
            <Text style={styles.viewsText}>{lineup.views.toLocaleString()}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  utilityIcon: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  tags: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },
  sideTag: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
  },
  sideText: {
    ...theme.typography.small,
    color: theme.colors.text,
    fontWeight: '600',
  },
  difficultyTag: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
  },
  difficultyText: {
    ...theme.typography.small,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  proBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    gap: 4,
  },
  proText: {
    ...theme.typography.small,
    color: theme.colors.warning,
    fontWeight: '700',
  },
  description: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  callout: {
    ...theme.typography.caption,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  views: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewsText: {
    ...theme.typography.small,
    color: theme.colors.textSecondary,
  },
});