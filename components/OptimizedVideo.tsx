// src/components/OptimizedVideo.tsx
import React, { useState, useRef } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Video } from 'expo-av';

interface Props {
  source: string;
  thumbnail: string;
}

export function OptimizedVideo({ source, thumbnail }: Props) {
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef(null);

  return (
    <View style={styles.container}>
      {!isLoaded && (
        <Image source={{ uri: thumbnail }} style={StyleSheet.absoluteFill} />
      )}
      
      <Video
        ref={videoRef}
        source={{ uri: source }}
        shouldPlay={false}
        isLooping
        isMuted // Start muted for faster load
        onReadyForDisplay={() => setIsLoaded(true)}
        progressUpdateIntervalMillis={1000}
        positionMillis={0}
        style={styles.video}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  video: {
    width: '100%',
    height: 200,
  },
});