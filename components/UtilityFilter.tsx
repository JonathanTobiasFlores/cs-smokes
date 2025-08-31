// src/components/UtilityFilter.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UtilityType } from '../types';
import { theme } from '../theme';

interface Props {
  type: UtilityType | 'all';
  isSelected: boolean;
  onPress: () => void;
}

const utilityIcons = {
  all: 'apps',
  smoke: 'cloud',
  flash: 'flash',
  molotov: 'flame',
  grenade: 'radio-button-on',
};

export const UtilityFilter: React.FC<Props> = ({ type, isSelected, onPress }) => {
  const backgroundColor = type === 'all' 
    ? isSelected ? theme.colors.primary : theme.colors.surface
    : isSelected ? theme.colors[type] : theme.colors.surface;

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor }]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons 
        name={utilityIcons[type] as any} 
        size={20} 
        color={isSelected ? theme.colors.text : theme.colors.textSecondary} 
      />
      <Text style={[styles.label, isSelected && styles.labelActive]}>
        {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    marginRight: theme.spacing.sm,
    gap: theme.spacing.xs,
  },
  label: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  labelActive: {
    color: theme.colors.text,
    fontWeight: '600',
  },
});