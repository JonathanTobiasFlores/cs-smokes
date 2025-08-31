// src/components/LineupCardWithPreview.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { Lineup } from '../types';
import { theme } from '../theme';

const { width } = Dimensions.get('window');

interface Props {
  lineup: Lineup;
  onPress: () => void;
  isVisible: boolean; // For viewport detection
}

export const LineupCardWithPreview: React.FC<Props> = ({ 
  lineup, 
  onPress, 
  isVisible 
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const videoRef = useRef<Video>(null);
  const previewTimer = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    // Auto-play preview when card is visible for 500ms
    if (isVisible) {
      previewTimer.current = setTimeout(() => {
        setShowPreview(true);
        videoRef.current?.playAsync();
      }, 500);
    } else {
      // Stop preview when card leaves viewport
      clearTimeout(previewTimer.current);
      setShowPreview(false);
      videoRef.current?.pauseAsync();
    }

    return () => clearTimeout(previewTimer.current);
  }, [isVisible]);

  const utilityColors = {
    smoke: '#9E9E9E',
    flash: '#FFEB3B',
    molotov: '#FF5722',
    grenade: '#8BC34A',
  };

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.9}
      onPressIn={() => {
        // Start preview on press
        setShowPreview(true);
        videoRef.current?.playAsync();
      }}
      onPressOut={() => {
        // Stop preview on release
        setShowPreview(false);
        videoRef.current?.pauseAsync();
      }}
    >
      <View style={styles.mediaContainer}>
        {showPreview && lineup.videoUrl ? (
          <Video
            ref={videoRef}
            source={{ uri: lineup.videoUrl }}
            style={styles.media}
            resizeMode={ResizeMode.COVER}
            isLooping
            isMuted
            shouldPlay={false}
          />
        ) : (
          <Image 
            source={{ uri: lineup.thumbnailUrl }} 
            style={styles.media}
          />
        )}
        
        {/* Utility Type Badge */}
        <View style={[styles.typeBadge, { backgroundColor: utilityColors[lineup.type] }]}>
          <Ionicons 
            name={
              lineup.type === 'smoke' ? 'cloud' :
              lineup.type === 'flash' ? 'flash' :
              lineup.type === 'molotov' ? 'flame' : 'radio-button-on'
            } 
            size={16} 
            color="#FFF" 
          />
        </View>

        {/* Quick Info Overlay */}
        <View style={styles.overlay}>
          <View style={styles.overlayTop}>
            <View style={[styles.sideBadge, { 
              backgroundColor: lineup.side === 'T' ? '#C9A961' : '#5B92C9' 
            }]}>
              <Text style={styles.sideText}>{lineup.side}</Text>
            </View>
            <View style={styles.difficultyBadge}>
              <Text style={styles.difficultyText}>{lineup.difficulty}</Text>
            </View>
          </View>
          
          <View style={styles.overlayBottom}>
            <Text style={styles.lineupName} numberOfLines={1}>
              {lineup.name}
            </Text>
            <Text style={styles.positions}>
              {lineup.startPosition.callout} → {lineup.endPosition.callout}
            </Text>
          </View>
        </View>

        {/* Play indicator when not previewing */}
        {!showPreview && (
          <View style={styles.playButton}>
            <Ionicons name="play" size={24} color="#FFF" />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: (width - 36) / 2, // 2 columns with padding
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: theme.colors.card,
  },
  mediaContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    position: 'relative',
  },
  media: {
    width: '100%',
    height: '100%',
  },
  typeBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  overlayTop: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 4,
  },
  sideBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  sideText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
  difficultyBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  difficultyText: {
    color: '#FFF',
    fontSize: 10,
    textTransform: 'uppercase',
  },
  overlayBottom: {
    gap: 2,
  },
  lineupName: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  positions: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 10,
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -20 }],
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});