import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Video, ResizeMode } from 'expo-av';
import { RootStackParamList } from '../types';
import { theme } from '../theme';
import * as Haptics from 'expo-haptics';

type LineupDetailScreenRouteProp = RouteProp<RootStackParamList, 'LineupDetail'>;

interface Props {
  route: LineupDetailScreenRouteProp;
}

const { width } = Dimensions.get('window');

export const LineupDetailScreen: React.FC<Props> = ({ route }) => {
  const { lineup } = route.params;
  const [isFavorite, setIsFavorite] = useState(lineup.isFavorite || false);

  const handleFavoriteToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsFavorite(!isFavorite);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.videoContainer}>
          {lineup.videoUrl ? (
            <Video
              style={styles.video}
              source={{ uri: lineup.videoUrl }}
              useNativeControls
              resizeMode={ResizeMode.CONTAIN}
              isLooping
            />
          ) : (
            <View style={styles.placeholderVideo}>
              <Ionicons name="videocam-off" size={48} color={theme.colors.textSecondary} />
              <Text style={styles.placeholderText}>Video coming soon</Text>
            </View>
          )}
        </View>

        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={[styles.utilityBadge, { backgroundColor: theme.colors[lineup.type] }]}>
              <Text style={styles.utilityText}>{lineup.type.toUpperCase()}</Text>
            </View>
            <TouchableOpacity onPress={handleFavoriteToggle}>
              <Ionicons 
                name={isFavorite ? 'heart' : 'heart-outline'} 
                size={28} 
                color={isFavorite ? theme.colors.error : theme.colors.textSecondary} 
              />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.title}>{lineup.name}</Text>
          <Text style={styles.description}>{lineup.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Position</Text>
          <Text style={styles.positionText}>
            {lineup.startPosition.callout} → {lineup.endPosition.callout}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  videoContainer: {
    width: width,
    height: width * 0.75,
    backgroundColor: theme.colors.surface,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  placeholderVideo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
  },
  header: {
    padding: theme.spacing.lg,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  utilityBadge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
  },
  utilityText: {
    ...theme.typography.caption,
    color: theme.colors.text,
    fontWeight: '700',
  },
  title: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  description: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    lineHeight: 24,
  },
  section: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  positionText: {
    ...theme.typography.body,
    color: theme.colors.primary,
  },
});